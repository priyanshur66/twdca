import { NextResponse } from 'next/server';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import { AgentRuntime, LocalSigner } from 'move-agent-kit';

export async function POST(req: Request) {
  try {
    const { walletAddress, amount } = await req.json();

    if (!walletAddress || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const privateKeyString = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyString) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);

    const account = await aptos.deriveAccountFromPrivateKey({
      // @ts-ignore - helper types provided by library
      privateKey: new Ed25519PrivateKey(
        // @ts-ignore
        PrivateKey.formatPrivateKey(privateKeyString, PrivateKeyVariants.Ed25519)
      ),
    });

    const signer = new LocalSigner(account, Network.MAINNET);

    const agent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: process.env.PANORA_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    });

    // Convert amount in APT (human readable) to on-chain units (octas – 8 decimals)
    const onChainAmount = BigInt(Math.round(amount * 1e8));
    // Using Aptos native coin type tag
    const APTOS_COIN_TYPE = "0x1::aptos_coin::AptosCoin";

    const txHash = await agent.transferTokens(walletAddress, onChainAmount, APTOS_COIN_TYPE);

    return NextResponse.json({ txHash }, { status: 200 });
  } catch (error: any) {
    console.error('Take exit error', error);
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
} 