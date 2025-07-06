import { NextResponse } from 'next/server';
import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
  convertAmountFromHumanReadableToOnChain,
} from '@aptos-labs/ts-sdk';
import { AgentRuntime, LocalSigner } from 'move-agent-kit';

// POST /api/buy-multiple-tokens
// Body: { amount: number }  // amount in human-readable APT
export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const privateKeyString = process.env.APTOS_PRIVATE_KEY;
    const panoraApiKey = process.env.PANORA_API_KEY;
    if (!privateKeyString || !panoraApiKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Init Aptos + signer
    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);
    const account = await aptos.deriveAccountFromPrivateKey({
      // @ts-ignore – helper types provided by library
      privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyString, PrivateKeyVariants.Ed25519)),
    });
    const signer = new LocalSigner(account, Network.MAINNET);

    // Create agent runtime instance
    const agent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: panoraApiKey,
    });

    // Percent allocations (sum 99%)
    const ALLOCATIONS = [
      { symbol: 'ami', pct: 0.14 },
      { symbol: 'thl', pct: 0.25 },
      { symbol: 'lsd', pct: 0.6 },
    ];

    const fromTokenAddress = '0x1::aptos_coin::AptosCoin';

    const swapResults: { token: string; hash: string }[] = [];

    for (const { symbol, pct } of ALLOCATIONS) {
      const tokenInfo = agent.getTokenByTokenName(symbol);
      if (!tokenInfo) {
        throw new Error(`Token mapping for ${symbol.toUpperCase()} not found in Move Agent Kit`);
      }

      const onChainAmount = convertAmountFromHumanReadableToOnChain(amount * pct, 8);

      const txHash = await agent.swapWithPanora(
        fromTokenAddress,
        tokenInfo.tokenAddress,
        onChainAmount.toString(),
      );

      swapResults.push({ token: symbol, hash: txHash });
    }

    return NextResponse.json({ success: true, swaps: swapResults }, { status: 200 });
  } catch (error: any) {
    console.error('buy-multiple-tokens error', error);
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
} 