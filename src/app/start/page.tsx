'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { updateUserInvestment, createTrade } from "@/lib/database";

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

export default function StartPage() {
  const { connected, account, wallet, network, signAndSubmitTransaction } = useWallet();
  const router = useRouter();
  const [aptAmount, setAptAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const AGENT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_AGENT_WALLET_ADDRESS;

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
      const walletAddress = account.address.toString();

      console.log(`Sending ${amount} APT (${amountInOctas} Octas) to agent wallet...`);

      const response = await signAndSubmitTransaction({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [AGENT_WALLET_ADDRESS, amountInOctas],
        },
      });

      console.log('Transaction successful, hash:', response.hash);
      setTransactionHash(response.hash);

      // Update database after successful transaction
      console.log('Updating database records...');
      
      // Update user's investment amount
      const updatedUser = await updateUserInvestment(walletAddress, amount);
      
      if (updatedUser) {
        console.log('User investment updated successfully:', updatedUser);
        
        // Create trade record
        const newTrade = await createTrade(walletAddress, amount);
        
        if (newTrade) {
          console.log('Trade record created successfully:', newTrade);
          setAptAmount("");
          alert(`Successfully sent ${amount} APT to agent wallet! Your investment has been recorded.`);
        } else {
          console.error('Failed to create trade record');
          alert(`Transaction successful but failed to record trade. Transaction hash: ${response.hash}`);
        }
      } else {
        console.error('Failed to update user investment');
        alert(`Transaction successful but failed to update investment record. Transaction hash: ${response.hash}`);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
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
                Please connect your wallet to fund your agent and start copy trading with advanced analytics
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
                onClick={() => router.push('/status')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Status
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
          
          {/* Enhanced header */}
          <div className="text-center mb-20 pt-8">
            <ScrollReveal>
              <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-wide">
                Welcome to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 font-light">
                  {' '}TWDCA
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Your wallet is connected. Fund your agent to start copy trading with advanced analytics
              </p>
            </ScrollReveal>
          </div>

          {/* Fund Agent Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <ScrollReveal delay={300}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray-400/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-black/70 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-12 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-12">
                      <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-300">💰</div>
                      <h2 className="text-4xl font-extralight mb-6 tracking-wide">
                        Fund Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 font-light">
                          {' '}Trading Agent
                        </span>
                      </h2>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <div className="mb-8">
                        <label htmlFor="aptAmount" className="block text-lg font-medium text-gray-300 mb-4">
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
                            className="w-full bg-black/70 border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 text-lg backdrop-blur-sm"
                            disabled={isLoading}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                            <span className="text-gray-400 text-lg font-medium">APT</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-gray-400/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                        <button
                          onClick={handleSendAPT}
                          disabled={isLoading || !aptAmount || !AGENT_WALLET_ADDRESS}
                          className="relative w-full bg-white text-black font-semibold py-5 px-8 rounded-2xl transition-all duration-300 hover:bg-gray-100 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-105 disabled:transform-none shadow-2xl text-lg border-2 border-white/30"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-6 h-6 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
                              Processing Transaction...
                            </div>
                          ) : (
                            "Send APT to Agent"
                          )}
                        </button>
                      </div>

                      {!AGENT_WALLET_ADDRESS && (
                        <div className="mt-6 p-4 bg-red-900/20 backdrop-blur-sm border-2 border-red-400/30 rounded-2xl">
                          <p className="text-red-400 text-sm text-center">
                            ⚠️ Agent wallet address not configured. Please add NEXT_PUBLIC_AGENT_WALLET_ADDRESS to your .env.local file.
                          </p>
                        </div>
                      )}

                      {transactionHash && (
                        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl">
                          <p className="text-white text-sm text-center font-medium">
                            ✅ Transaction successful! Investment recorded.
                          </p>
                          <p className="text-gray-400 text-xs text-center mt-2 break-all font-mono">
                            Hash: {transactionHash}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Next Steps Section */}
          <ScrollReveal delay={400}>
            <div className="relative group mb-20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-400/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-black/70 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-extralight mb-12 text-center tracking-wide">
                    Next
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 font-light">
                      {' '}Steps
                    </span>
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-10">
                    <ScrollReveal delay={500}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray-400/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">✅</div>
                          <h3 className="text-xl font-semibold mb-4 text-white">Fund Your Agent</h3>
                          <p className="text-gray-300 text-base leading-relaxed">
                            Send APT tokens to your trading agent using the form above
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={600}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
                          <h3 className="text-xl font-semibold mb-4 text-white">Agent Starts Trading</h3>
                          <p className="text-gray-300 text-base leading-relaxed">
                            Your agent will automatically start copy trading strategies
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={700}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray-300/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
                          <h3 className="text-xl font-semibold mb-4 text-white">Monitor Performance</h3>
                          <p className="text-gray-300 text-base leading-relaxed">
                            Track your agent's performance and earnings in real-time
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}