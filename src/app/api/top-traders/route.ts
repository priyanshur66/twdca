import { NextResponse } from 'next/server';

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT || 'your-hasura-endpoint';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'your-secret';

interface PositionEvent {
  user: string;
  pnl_without_fee: string;
  is_profit: boolean;
  entry_exit_fee: string;
  funding_fee: string;
  rollover_fee: string;
  size_delta: string;
  collateral_delta: string;
  price: string;
  pair_type_struct_name: string;
  // metadata_sequence_number removed – we only need it for ordering, not selection
}

/**
 * Fetches position_event rows from Hasura in chunks to avoid timeouts.
 */
async function fetchPositionEventsPaginated(): Promise<PositionEvent[]> {
  const limitEnv = process.env.POSITION_EVENT_PAGE_LIMIT ? Number(process.env.POSITION_EVENT_PAGE_LIMIT) : undefined;
  const limit = limitEnv && !Number.isNaN(limitEnv) && limitEnv > 0 ? limitEnv : 500; // smaller page size to avoid statement timeout
  let offset = 0;
  let currentLimit = limit;
  const allEvents: PositionEvent[] = [];
  let hasMore = true;

  // eslint-disable-next-line no-console
  console.log('Starting to fetch position events...');

  while (hasMore) {
    const query = `
      query GetPositionEventsPaginated($limit: Int!, $offset: Int!) {
        position_event(
          where: { pnl_without_fee: { _is_null: false } }
          order_by: [{ user: asc }, { metadata_sequence_number: asc }]
          limit: $limit
          offset: $offset
        ) {
          user
          pnl_without_fee
          is_profit
          entry_exit_fee
          funding_fee
          rollover_fee
          size_delta
          collateral_delta
          price
          pair_type_struct_name
        }
      }
    `;

    try {
      // Verbose logging per page
      console.log(`Fetching position_event page: offset=${offset}, limit=${currentLimit}`);

      const response = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify({
          query,
          variables: { limit: currentLimit, offset },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        // eslint-disable-next-line no-console
        console.error(`GraphQL errors at offset ${offset}:`, JSON.stringify(data.errors, null, 2));
        throw new Error('GraphQL query failed');
      }

      const events: PositionEvent[] = data.data.position_event;
      allEvents.push(...events);

      // eslint-disable-next-line no-console
      console.log(`Fetched ${events.length} events (Total: ${allEvents.length})`);

      hasMore = events.length === currentLimit;
      offset += currentLimit;

      // Avoid hammering Hasura
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching data for offset ${offset}:`, error);

      const timeoutDetected = (error?.message || '').includes('GraphQL query failed');
      // naive check: Hasura turned statement_timeout into generic GraphQL error; we already logged details above
      if (timeoutDetected && currentLimit > 50) {
        currentLimit = Math.floor(currentLimit / 2);
        console.warn(`⏳ Statement timeout – reducing page size to ${currentLimit} and retrying offset ${offset}`);
        continue; // retry same offset with smaller limit
      }

      throw error;
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Total events fetched: ${allEvents.length}`);
  return allEvents;
}

/**
 * Calculate P&L and derive metrics for wallets.
 */
function calculateWalletPnL(positionEvents: PositionEvent[]) {
  const walletPnL: Record<string, any> = {};

  positionEvents.forEach((event) => {
    const wallet = event.user;
    const pnl = parseFloat(event.pnl_without_fee) || 0;
    const entryExitFee = parseFloat(event.entry_exit_fee) || 0;
    const fundingFee = parseFloat(event.funding_fee) || 0;
    const rolloverFee = parseFloat(event.rollover_fee) || 0;
    const sizeUsd = parseFloat(event.size_delta) || 0;

    if (!walletPnL[wallet]) {
      walletPnL[wallet] = {
        walletAddress: wallet,
        netPnL: 0,
        totalFees: 0,
        tradeCount: 0,
        profitableTrades: 0,
        totalVolume: 0,
        winRate: 0,
        avgTradeSize: 0,
        pairs: new Set<string>(),
      };
    }

    walletPnL[wallet].netPnL += pnl;
    walletPnL[wallet].totalFees += entryExitFee + fundingFee + rolloverFee;
    walletPnL[wallet].tradeCount += 1;
    walletPnL[wallet].totalVolume += Math.abs(sizeUsd);
    walletPnL[wallet].pairs.add(event.pair_type_struct_name);

    if (event.is_profit) {
      walletPnL[wallet].profitableTrades += 1;
    }
  });

  const results = Object.values(walletPnL).map((trader: any) => {
    trader.winRate = trader.tradeCount > 0 ? (trader.profitableTrades / trader.tradeCount * 100).toFixed(2) : 0;
    trader.avgTradeSize = trader.tradeCount > 0 ? (trader.totalVolume / trader.tradeCount).toFixed(2) : 0;
    trader.netPnL = parseFloat(trader.netPnL.toFixed(2));
    trader.totalFees = parseFloat(trader.totalFees.toFixed(2));
    trader.totalVolume = parseFloat(trader.totalVolume.toFixed(2));
    trader.pairsTraded = trader.pairs.size;
    delete trader.pairs; // Remove Set for serialization
    return trader;
  });

  return results.sort((a: any, b: any) => b.netPnL - a.netPnL).slice(0, 10);
}

export async function GET() {
  try {
    const startTime = Date.now();

    const allEvents = await fetchPositionEventsPaginated();
    const topTraders = calculateWalletPnL(allEvents);

    const endTime = Date.now();
    const processingTime = (endTime - startTime) / 1000;

    return NextResponse.json(
      {
        success: true,
        data: {
          topTraders,
          meta: {
            totalRecordsProcessed: allEvents.length,
            processingTimeSeconds: processingTime,
            timestamp: new Date().toISOString(),
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch and process trading data',
        message: error.message,
      },
      { status: 500 },
    );
  }
} 