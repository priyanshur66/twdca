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

// Black and white floating particles
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.3 + 0.1,
      isWhite: Math.random() > 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.isWhite ? 'bg-white/20' : 'bg-gray-400/20'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: particle.isWhite ? '0 0 10px rgba(255,255,255,0.3)' : '0 0 8px rgba(156,163,175,0.3)',
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

// Black and white animated background
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large monochrome orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-white/10 to-gray-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-gray-400/10 to-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-gradient-to-br from-gray-500/10 to-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-20 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-gray-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      
      {/* Center monochrome aurora effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-white/8 via-transparent to-white/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Monochrome grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Subtle diagonal lines */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-[size:20px_20px]" />
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
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FloatingParticles />
        <AnimatedBackground />

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ScrollReveal>
              <div className="w-full flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center border-2 border-white/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-300 rounded-xl shadow-2xl"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-extralight mb-6 tracking-wide">
                Connect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 font-light">
                  {' '}Wallet
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Please connect your wallet to view your portfolio status and trading history with our advanced analytics
              </p>
              <div className="relative group">
               
                <ConnectWallet className="relative text-xl px-16 py-5 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-2xl mx-auto border-2 border-white/30" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <FloatingParticles />
      <AnimatedBackground />

      {/* Enhanced monochrome navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-400/20 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="flex items-center mb-2">
              
              <div className="relative w-8 h-8 bg-gradient-to-br mr-3 from-gray-900 to-black rounded-md flex items-center justify-center border-2 border-white/30">
                    <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded shadow-2xl"></div>
                  </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                TWDCA
              </h1>
            </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push('/')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/start')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Fund Agent
              </button>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-gray-400/30 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <ConnectWallet className="relative text-sm px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 border-2 border-white/30" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced monochrome header */}
          <div className="text-center mb-20 pt-8">
            <ScrollReveal>
              <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-wide">
                Portfolio
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 font-light">
                  {' '}Status
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Track your investment performance and profits with real-time analytics and advanced insights
              </p>
            </ScrollReveal>
          </div>

          {isLoading ? (
            <ScrollReveal>
              <div className="flex items-center justify-center py-32">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-transparent border-t-white border-r-gray-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-gray-400 border-r-white rounded-full animate-spin" style={{ animationDelay: '-0.5s', animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-t-gray-300 border-r-white rounded-full animate-spin" style={{ animationDelay: '-1s' }}></div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <>
              {/* Enhanced monochrome stats cards */}
              <div className="grid md:grid-cols-3 gap-10 mb-20">
                
                {/* Total Investment Card */}
                <ScrollReveal delay={100}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray-400/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/70 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-10 overflow-hidden group-hover:scale-105 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">💰</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-6 tracking-wide">Total Investment</h3>
                        <p className="text-4xl font-extralight text-white mb-3">
                          {user?.investment_amount ? `${user.investment_amount}` : '0'}
                        </p>
                        <p className="text-base text-gray-400 font-medium">APT</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Total Profit Card */}
                <ScrollReveal delay={200}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-white/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/70 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-10 overflow-hidden group-hover:scale-105 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">📈</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-6 tracking-wide">Total Value</h3>
                        <p className="text-4xl font-extralight text-white mb-3">
                          {formatCurrency(totalProfit)}
                        </p>
                        <p className="text-base text-gray-400 font-medium">APT</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Total Trades Card */}
                <ScrollReveal delay={300}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray-300/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/70 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-10 overflow-hidden group-hover:scale-105 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">🔄</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-6 tracking-wide">Total Trades</h3>
                        <p className="text-4xl font-extralight text-white mb-3">
                          {trades.length}
                        </p>
                        <p className="text-base text-gray-400 font-medium">Executed</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
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

             
             
            </>
          )}
        </div>
      </div>
    </div>
  );
}