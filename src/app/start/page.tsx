'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";

export default function StartPage() {
  const { connected, account, wallet, network, signAndSubmitTransaction } = useWallet();
  const router = useRouter();
  const [aptAmount, setAptAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const AGENT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_AGENT_WALLET_ADDRESS;

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  const handleSendAPT = async () => {
    if (!aptAmount || !account || !AGENT_WALLET_ADDRESS) {
      alert("Please enter a valid APT amount and ensure agent wallet address is configured");
      return;
    }

    const amount = parseFloat(aptAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    setIsLoading(true);
    setTransactionHash("");

    try {
      // Convert APT to Octas (1 APT = 100,000,000 Octas)
      const amountInOctas = Math.floor(amount * 100000000);

      const response = await signAndSubmitTransaction({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [AGENT_WALLET_ADDRESS, amountInOctas],
        },
      });

      setTransactionHash(response.hash);
      setAptAmount("");
      alert(`Successfully sent ${amount} APT to agent wallet!`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please connect your wallet to continue</div>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                TWDCA
              </h1>
            </div>
            
            <div className="flex items-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-light mb-4">
              Welcome to TWDCA!
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Your wallet is successfully connected. Fund your agent to start copy trading!
            </p>
          </div>

          {/* Fund Agent Section */}
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-8 mb-8 border border-green-800/30">
            <h2 className="text-2xl font-semibold mb-6 text-center">💰 Fund Your Trading Agent</h2>
            
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label htmlFor="aptAmount" className="block text-sm font-medium text-gray-300 mb-2">
                  APT Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="aptAmount"
                    value={aptAmount}
                    onChange={(e) => setAptAmount(e.target.value)}
                    placeholder="Enter APT amount (e.g., 1.5)"
                    step="0.01"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-sm">APT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendAPT}
                disabled={isLoading || !aptAmount || !AGENT_WALLET_ADDRESS}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  "Send APT to Agent"
                )}
              </button>

              {!AGENT_WALLET_ADDRESS && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <p className="text-red-400 text-sm text-center">
                    ⚠️ Agent wallet address not configured. Please add NEXT_PUBLIC_AGENT_WALLET_ADDRESS to your .env.local file.
                  </p>
                </div>
              )}

              {transactionHash && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <p className="text-green-400 text-sm text-center">
                    ✅ Transaction successful!
                  </p>
                  <p className="text-gray-400 text-xs text-center mt-1 break-all">
                    Hash: {transactionHash}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-800/30">
            <h2 className="text-2xl font-semibold mb-6 text-center">Next Steps</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-medium mb-2">Fund Your Agent</h3>
                <p className="text-gray-400 text-sm">
                  Send APT tokens to your trading agent using the form above
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-lg font-medium mb-2">Agent Starts Trading</h3>
                <p className="text-gray-400 text-sm">
                  Your agent will automatically start copy trading strategies
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-lg font-medium mb-2">Monitor Performance</h3>
                <p className="text-gray-400 text-sm">
                  Track your agent's performance and earnings in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 