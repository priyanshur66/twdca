'use client';
import React, { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
          <div className="flex items-center gap-6">
            <Link href="/status" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Status
            </Link>
            <Link href="/start" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              Fund Agent
            </Link>
            <ConnectWallet className="text-sm px-6 py-2 bg-white text-black  rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 " />
          </div>
        </div>
      </div>
    </nav>
  );
};

const StaticSection = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
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
      }`}
    >
      {children}
    </div>
  );
};

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
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

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background Elements */}
      <StaticSection className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
      </StaticSection>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero Text */}
          <div className="space-y-8">
            <ScrollReveal delay={200}>
              <h1 className="text-6xl md:text-8xl font-light leading-none">
                Agentic Copy
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Trading Hub
                </span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <p className="text-xl text-gray-300 max-w-lg">
                Experience the future of automated trading with AI-powered strategies on the Aptos blockchain
              </p>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="flex items-center gap-4 text-4xl font-light">
                <span className="text-gray-400">Powered by</span>
                  <svg viewBox="0 0 243 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-auto">
                <path fillRule="evenodd" clipRule="evenodd" d="M177.919 11.3688C178.145 11.3688 178.369 11.3229 178.576 11.2339C178.784 11.1449 178.971 11.0147 179.127 10.8512L181.548 8.33736C181.697 8.18149 181.876 8.05729 182.074 7.97222C182.272 7.88716 182.485 7.84299 182.7 7.84236H182.801C183.257 7.84236 183.697 8.03648 183.998 8.38266L186.037 10.6797C186.426 11.1165 186.979 11.3688 187.565 11.3688H193.026C190.371 7.83554 186.93 4.96866 182.975 2.99534C179.02 1.02202 174.659 -0.00350479 170.238 1.17707e-05C165.817 -0.00400735 161.456 1.02128 157.5 2.99462C153.544 4.96796 150.103 7.8351 147.448 11.3688H177.919ZM180.8 19.0462H197.137C197.92 21.2785 198.431 23.6338 198.635 26.0765H177.444C177.154 26.0764 176.868 26.015 176.604 25.8962C176.34 25.7774 176.105 25.604 175.913 25.3874L173.873 23.0903C173.724 22.9204 173.539 22.7844 173.333 22.6912C173.126 22.5981 172.902 22.5499 172.676 22.55H172.579C172.363 22.55 172.149 22.5939 171.95 22.679C171.751 22.7641 171.572 22.8886 171.423 23.045L169.005 25.5621C168.849 25.7255 168.662 25.8556 168.455 25.9445C168.247 26.0335 168.024 26.0795 167.798 26.0797H141.838C142.036 23.6823 142.538 21.3197 143.334 19.0494H170.831C171.695 19.0494 172.514 18.6774 173.09 18.0335L174.838 16.06C174.988 15.89 175.172 15.7539 175.379 15.6606C175.585 15.5673 175.809 15.5191 176.036 15.5191C176.262 15.5191 176.486 15.5673 176.693 15.6606C176.899 15.7539 177.084 15.89 177.233 16.06L179.272 18.3571C179.661 18.7938 180.218 19.0462 180.8 19.0462ZM158.757 40.3344C158.601 40.4976 158.413 40.6273 158.205 40.7158C157.997 40.8042 157.773 40.8495 157.547 40.8488H144.561C143.473 38.5975 142.689 36.2116 142.23 33.7538H160.712C161.577 33.7538 162.396 33.385 162.969 32.738L164.716 30.7644C164.866 30.5944 165.05 30.4583 165.257 30.365C165.463 30.2717 165.687 30.2235 165.914 30.2235C166.141 30.2235 166.365 30.2717 166.571 30.365C166.778 30.4583 166.962 30.5944 167.112 30.7644L169.151 33.0615C169.539 33.5015 170.096 33.7506 170.682 33.7506H198.244C197.785 36.2093 197.001 38.5963 195.913 40.8488H167.196C166.906 40.8488 166.62 40.7873 166.356 40.6685C166.092 40.5497 165.857 40.3763 165.665 40.1597L163.626 37.8627C163.476 37.6928 163.292 37.5567 163.085 37.4636C162.879 37.3704 162.655 37.3223 162.428 37.3224H162.331C162.115 37.3224 161.901 37.3662 161.702 37.4513C161.504 37.5364 161.324 37.6609 161.175 37.8174L158.757 40.3344ZM159.482 47.8856H191.074C188.41 50.7462 185.185 53.0268 181.599 54.5849C178.014 56.143 174.145 56.9452 170.235 56.9412C166.326 56.9456 162.457 56.1439 158.872 54.5864C155.286 53.0288 152.061 50.7488 149.396 47.8888H149.513C150.377 47.8888 151.196 47.5168 151.769 46.873L153.517 44.8994C153.667 44.7294 153.851 44.5933 154.057 44.5C154.264 44.4067 154.488 44.3585 154.715 44.3585C154.941 44.3585 155.165 44.4067 155.372 44.5C155.578 44.5933 155.762 44.7294 155.912 44.8994L157.951 47.1965C158.34 47.6332 158.897 47.8856 159.482 47.8856ZM44.2185 55.1003L38.4181 41.0268H12.5039L6.7035 55.1003H0L25.4222 1.83442L50.922 55.0938H44.2185V55.1003ZM14.692 35.6885H36.1588L25.3898 12.9962L14.692 35.6885ZM60.1826 1.83766V55.0971H66.4362V32.3788H74.9491C86.2457 32.3788 92.7258 27.1894 92.7258 17.1827C92.7258 7.17913 86.6244 1.83766 75.0203 1.83766H60.1826ZM73.5184 26.8141H66.4362V7.40236H73.5184C82.4068 7.40236 86.401 10.4888 86.401 17.1827C86.401 23.8797 82.4844 26.8141 73.5184 26.8141ZM115.435 7.55442H97.0535V1.83766H140.068V7.55442H121.686V55.0971H115.432L115.435 7.55442ZM212.822 41.745L207.436 45.3944C211.728 53.3694 217.454 56.5238 225.741 56.5238C235.61 56.5238 242.54 49.678 242.54 41.6318C242.54 34.2553 239.523 29.6677 227.246 24.103C217.83 19.813 215.645 17.4803 215.645 13.42C215.645 9.05884 219.034 5.82354 224.838 5.82354C229.583 5.82354 232.37 7.85531 234.629 11.3882L235.911 11.6924L240.28 8.68354C237.416 3.56531 232.37 0.40766 224.986 0.40766C214.968 0.40766 209.168 6.19883 209.168 13.5721C209.168 20.3403 212.936 25.08 224.009 29.6677C233.651 33.6568 236.063 36.8921 236.063 41.7062C236.063 46.8212 231.768 51.0335 225.666 51.0335C220.167 51.0335 216.551 48.6265 213.237 42.6088L212.822 41.745Z" fill="url(#paint0_linear_aptos_icon_0ein3b4ta)"></path>
                <defs>
                  <linearGradient id="paint0_linear_aptos_icon_0ein3b4ta" x1="0" y1="28.4706" x2="242.54" y2="28.4706" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"></stop>
                    <stop offset="1" stopColor="#FFFFFF"></stop>
                  </linearGradient>
                </defs>
              </svg>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side - Steps Card */}
          <div className="relative">
            <StaticSection>
              <ScrollReveal delay={800} direction="right">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    {steps.map((step, index) => (
                      <ScrollReveal key={index} delay={1000 + (index * 200)}>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{step.emoji}</span>
                              <h3 className="text-lg font-semibold">{step.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                    
                    <ScrollReveal delay={1600}>
                      <div className="pt-4">
                        <ConnectWallet className="w-full py-4 text-lg hover:scale-105 bg-white text-black px-8 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 " />
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </ScrollReveal>
            </StaticSection>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white text-black relative overflow-hidden">
      {/* Background Elements */}
      <StaticSection className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-black/3 rounded-full blur-2xl" />
      </StaticSection>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-light mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600">
                {' '}TWDCA?
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of automated trading with our cutting-edge AI agents
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-8 border border-black/10 hover:border-black/20 transition-all duration-500 group hover:scale-105">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      <StaticSection className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </StaticSection>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <ScrollReveal>
          <h2 className="text-5xl md:text-7xl font-light mb-8">
            Ready to Start
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Trading?
            </span>
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={300}>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of traders who are already earning passive income with our AI-powered copy trading platform
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <ConnectWallet className="text-xl px-12 py-4 hover:scale-110 transition-all duration-300 shadow-2xl bg-white text-black  rounded-full font-semibold hover:bg-gray-100  mx-auto" />
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center mb-2">
              
              <div className="relative w-8 h-8 bg-gradient-to-br mr-3 from-gray-900 to-black rounded-md flex items-center justify-center border-2 border-white/30">
                    <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded shadow-2xl"></div>
                  </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                TWDCA
              </h1>
            </div>

              <p className="text-gray-400">
                The future of automated copy trading powered by Aptos blockchain.
              </p>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 TWDCA. All rights reserved.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

const steps = [
  {
    emoji: "🔗",
    stepNumber: 1,
    title: "Connect Wallet",
    description: "Link your crypto wallet to get started with copy trading"
  },
  {
    emoji: "💰",
    stepNumber: 2,
    title: "Deposit Funds to Agent",
    description: "Fund your account to begin copying successful traders"
  },
  {
    emoji: "🎯",
    stepNumber: 3,
    title: "Claim Profits",
    description: "Automatically earn returns from your chosen trading strategies"
  }
];

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Built on Aptos blockchain for ultra-fast transaction processing"
  },
  {
    icon: "🔒",
    title: "Secure & Transparent",
    description: "Your funds remain secure with full transparency on all transactions"
  },
  {
    icon: "📈",
    title: "Proven Strategies",
    description: "Copy from top-performing traders with verified track records"
  },
  {
    icon: "🎯",
    title: "Risk Management",
    description: "Built-in risk controls to protect your investments"
  },
  {
    icon: "💎",
    title: "Low Fees",
    description: "Competitive fee structure with no hidden charges"
  },
  {
    icon: "🤖",
    title: "AI Powered",
    description: "Advanced AI algorithms optimize your trading performance"
  }
];

const App = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default App;