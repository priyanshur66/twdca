'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUserExists, createUser } from "@/lib/database";

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
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (connected && account && redirectToStart) {
      handleUserConnection();
    }
  }, [connected, account, redirectToStart]);

  const handleUserConnection = async () => {
    if (!account) return;

    setIsProcessing(true);
    
    try {
      const walletAddress = account.address.toString();
      console.log('Checking user existence for:', walletAddress);

      // Check if user exists
      const existingUser = await checkUserExists(walletAddress);
      
      if (existingUser) {
        console.log('User exists, redirecting to /start');
        router.push('/start');
      } else {
        console.log('User does not exist, creating new user');
        
        // Create new user
        const newUser = await createUser(walletAddress);
        
        if (newUser) {
          console.log('User created successfully:', newUser);
          // Verify user was created
          const verifyUser = await checkUserExists(walletAddress);
          
          if (verifyUser) {
            console.log('User verification successful, redirecting to /start');
            router.push('/start');
          } else {
            console.error('User verification failed');
            alert('There was an issue setting up your account. Please try again.');
          }
        } else {
          console.error('Failed to create user');
          alert('Failed to create your account. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error handling user connection:', error);
      alert('There was an error connecting to the database. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConnect = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        setIsProcessing(true);
        // Only connect to Petra wallet
        const petraWallet = wallets?.find(w => w.name === "Petra");
        if (petraWallet) {
          await connect(petraWallet.name);
          onConnect?.();
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsProcessing(false);
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
          disabled={isProcessing}
          className={`bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg ${className}`}
        >
          {isProcessing ? 'Processing...' : 'Disconnect'}
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
          disabled={isProcessing}
          className={`bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg flex items-center gap-3 ${className}`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <>
              {petraWallet.icon && (
                <img 
                  src={petraWallet.icon} 
                  alt="Petra" 
                  className="w-5 h-5" 
                />
              )}
              Connect Petra
            </>
          )}
        </button>
      )}
    </div>
  );
} 