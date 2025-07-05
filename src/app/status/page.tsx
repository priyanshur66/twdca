'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { getUserByWalletAddress, getUserTrades } from "@/lib/database";
import { User, Trade } from "@/lib/supabase";

export default function StatusPage() {
  const { connected, account } = useWallet();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (connected && account) {
      fetchUserData();
    }
  }, [connected, account]);

  const fetchUserData = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const walletAddress = account.address.toString();
      
      // Fetch user data
      const userData = await getUserByWalletAddress(walletAddress);
      setUser(userData);
      
      // Fetch user trades
      const userTrades = await getUserTrades(walletAddress);
      setTrades(userTrades);
      
      // Calculate total profit
      const total = userTrades.reduce((sum, trade) => sum + trade.profit, 0);
      setTotalProfit(total);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTakeExit = async () => {
    if (!account) return;
    if (totalProfit <= 0) return;
    try {
      setIsExiting(true);
      const res = await fetch('/api/take-exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: account.address.toString(),
          amount: totalProfit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unknown error');
      }
      alert(`Exit successful! Tx hash: ${data.txHash}`);
      // Refresh data after successful withdrawal
      fetchUserData();
    } catch (err: any) {
      console.error(err);
      alert(`Exit failed: ${err.message}`);
    } finally {
      setIsExiting(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please connect your wallet to view status</div>
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
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/start')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Fund Agent
              </button>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-light mb-4">
              Portfolio Status
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Track your investment performance and profits
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Total Investment */}
                <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-800/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Investment</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      {user?.investment_amount ? `${user.investment_amount} APT` : '0 APT'}
                    </p>
                  </div>
                </div>

                {/* Total Profit */}
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-800/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total </h3>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(totalProfit)}
                    </p>
                  </div>
                </div>

                {/* Total Trades */}
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-800/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Trades</h3>
                    <p className="text-2xl font-bold text-purple-400">
                      {trades.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Take Exit Button */}
              {totalProfit > 0 && (
                <div className="flex justify-center mb-12">
                  <button
                    onClick={handleTakeExit}
                    disabled={isExiting}
                    className={`bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${isExiting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isExiting ? 'Processing...' : `Take Exit (${totalProfit.toFixed(2)} APT)`}
                  </button>
                </div>
              )}

              {/* Trades History */}
              <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-2xl font-semibold mb-6 text-center">Trade History</h2>
                
                {trades.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-400 text-lg">No trades yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Start by funding your agent to begin copy trading
                    </p>
                    <button
                      onClick={() => router.push('/start')}
                      className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Fund Agent
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-300">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300">Investment</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300">Profit</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trades.map((trade) => (
                          <tr key={trade.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                            <td className="py-3 px-4 text-gray-300">
                              {formatDate(trade.created_at)}
                            </td>
                            <td className="py-3 px-4 text-blue-400 font-medium">
                              {trade.investment} APT
                            </td>
                            <td className="py-3 px-4 font-medium">
                              <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {formatCurrency(trade.profit)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                trade.profit > 0 
                                  ? 'bg-green-900/20 text-green-400 border border-green-800/30' 
                                  : trade.profit < 0 
                                  ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                                  : 'bg-gray-900/20 text-gray-400 border border-gray-800/30'
                              }`}>
                                {trade.profit > 0 ? 'Profit' : trade.profit < 0 ? 'Loss' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Portfolio Summary */}
              {user && (
                <div className="mt-12 bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-semibold mb-6 text-center">Portfolio Summary</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Wallet Address:</span>
                        <span className="text-sm text-gray-300 font-mono break-all max-w-xs">
                          {user.wallet_address}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Member Since:</span>
                        <span className="text-gray-300">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">ROI:</span>
                        <span className={`font-medium ${
                          user.investment_amount > 0 
                            ? totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                            : 'text-gray-400'
                        }`}>
                          {user.investment_amount > 0 
                            ? `${((totalProfit / user.investment_amount) * 100).toFixed(2)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-gray-300">
                          {formatDate(user.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 