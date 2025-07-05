'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ConnectWalletProps {
  className?: string;
  onConnect?: () => void;
  redirectToStart?: boolean;
}

export default function ConnectWallet({ 
  className = "", 
  onConnect,
  redirectToStart = false 
}: ConnectWalletProps) {
  const { connect, disconnect, connected, wallet, wallets, account } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected && redirectToStart) {
      router.push('/start');
    }
  }, [connected, redirectToStart, router]);

  const handleConnect = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        // Only connect to Petra wallet
        const petraWallet = wallets?.find(w => w.name === "Petra");
        if (petraWallet) {
          await connect(petraWallet.name);
          onConnect?.();
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-300">
          {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
        </div>
        <button
          onClick={handleConnect}
          className={`bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${className}`}
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Check if Petra wallet is available
  const petraWallet = wallets?.find(w => w.name === "Petra");

  return (
    <div className="relative">
      {!petraWallet ? (
        <div className="text-center">
          <div className="text-yellow-500 text-sm mb-2">
            Petra wallet not found
          </div>
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Install Petra Wallet
          </a>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 ${className}`}
        >
          {petraWallet.icon && (
            <img 
              src={petraWallet.icon} 
              alt="Petra" 
              className="w-5 h-5" 
            />
          )}
          Connect Petra
        </button>
      )}
    </div>
  );
} 