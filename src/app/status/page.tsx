'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { getUserByWalletAddress, getUserTrades } from "@/lib/database";
import { User, Trade } from "@/lib/supabase";

// ScrollReveal component for animations
const ScrollReveal = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay]);

  const getTransform = () => {
    if (direction === 'up') return 'translate-y-20';
    if (direction === 'down') return '-translate-y-20';
    if (direction === 'left') return 'translate-x-20';
    if (direction === 'right') return '-translate-x-20';
    return 'translate-y-20';
  };

  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0' 
          : `opacity-0 ${getTransform()}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Floating particles background
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/10 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Static section wrapper
const StaticSection = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default function StatusPage() {
  const { connected, account } = useWallet();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);

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

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FloatingParticles />
        
        <StaticSection className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
        </StaticSection>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ScrollReveal>
              <div className="w-full flex items-center justify-center">

              <div className="w-28 h-28 bg-white rounded-lg mr-3 flex items-center justify-center my-8 ">
                <div className="w-16 h-16 bg-black rounded"></div>
              </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-light mb-6">
                Connect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {' '}Wallet
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-md mx-auto">
                Please connect your wallet to view your portfolio status and trading history
              </p>
              <ConnectWallet className="text-xl px-12 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-2xl mx-auto" />
            </ScrollReveal>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background Elements */}
      <StaticSection className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/2 rounded-full blur-3xl" />
      </StaticSection>

      {/* Enhanced Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                TWDCA
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/start')}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Fund Agent
              </button>
              <ConnectWallet className="text-sm px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16 pt-8">
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl font-light mb-6">
                Portfolio
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {' '}Status
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Track your investment performance and profits with real-time analytics
              </p>
            </ScrollReveal>
          </div>

          {isLoading ? (
            <ScrollReveal>
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white/50 rounded-full animate-spin animation-delay-150"></div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <>
              {/* Enhanced Stats Cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                
                {/* Total Investment Card */}
                <ScrollReveal delay={100}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 text-center">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💰</div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Total Investment</h3>
                      <p className="text-3xl font-light text-white mb-2">
                        {user?.investment_amount ? `${user.investment_amount}` : '0'}
                      </p>
                      <p className="text-sm text-gray-400">APT</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Total Profit Card */}
                <ScrollReveal delay={200}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 text-center">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Total Profit</h3>
                      <p className="text-3xl font-light text-white mb-2">
                        {formatCurrency(totalProfit)}
                      </p>
                      <p className="text-sm text-gray-400">USD</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Total Trades Card */}
                <ScrollReveal delay={300}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 text-center">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔄</div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Total Trades</h3>
                      <p className="text-3xl font-light text-white mb-2">
                        {trades.length}
                      </p>
                      <p className="text-sm text-gray-400">Executed</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Enhanced Trades History */}
              <ScrollReveal delay={400}>
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden mb-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-light mb-8 text-center">
                      Trade
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {' '}History
                      </span>
                    </h2>
                    
                    {trades.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-8xl mb-8">📊</div>
                        <h3 className="text-2xl font-light mb-4">No trades yet</h3>
                        <p className="text-gray-400 text-lg mb-8">
                          Start by funding your agent to begin copy trading
                        </p>
                        <button
                          onClick={() => router.push('/start')}
                          className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-2xl"
                        >
                          Fund Agent
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-6 px-6 font-semibold text-gray-300 text-lg">Date</th>
                              <th className="text-left py-6 px-6 font-semibold text-gray-300 text-lg">Investment</th>
                              <th className="text-left py-6 px-6 font-semibold text-gray-300 text-lg">Profit</th>
                              <th className="text-left py-6 px-6 font-semibold text-gray-300 text-lg">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trades.map((trade, index) => (
                              <ScrollReveal key={trade.id} delay={500 + (index * 100)}>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                                  <td className="py-6 px-6 text-gray-300 text-base">
                                    {formatDate(trade.created_at)}
                                  </td>
                                  <td className="py-6 px-6 text-white font-medium text-base">
                                    {trade.investment} APT
                                  </td>
                                  <td className="py-6 px-6 font-medium text-base">
                                    <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                                      {formatCurrency(trade.profit)}
                                    </span>
                                  </td>
                                  <td className="py-6 px-6">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                                      trade.profit > 0 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : trade.profit < 0 
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                      {trade.profit > 0 ? 'Profit' : trade.profit < 0 ? 'Loss' : 'Pending'}
                                    </span>
                                  </td>
                                </tr>
                              </ScrollReveal>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Enhanced Portfolio Summary */}
              {user && (
                <ScrollReveal delay={600}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10">
                      <h2 className="text-3xl font-light mb-8 text-center">
                        Portfolio
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                          {' '}Summary
                        </span>
                      </h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400 text-base">Wallet Address</span>
                            </div>
                            <span className="text-sm text-white font-mono break-all">
                              {user.wallet_address}
                            </span>
                          </div>
                          
                          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-base">Member Since</span>
                              <span className="text-white font-medium">
                                {formatDate(user.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-base">ROI</span>
                              <span className={`font-medium text-lg ${
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
                          </div>
                          
                          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-base">Last Updated</span>
                              <span className="text-white font-medium">
                                {formatDate(user.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}