'use client';
import ConnectWallet from "@/components/ConnectWallet";
import React, { useState, useEffect } from "react";


const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 transform transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
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
  );
};

const StepCard = ({
  emoji,
  stepNumber,
  title,
  description,
  delay = 0
}: {
  emoji: string;
  stepNumber: number;
  title: string;
  description: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-gray-950/40 rounded-2xl p-4 mb-3 text-white border border-gray-700 hover:border-gray-600 transition-all duration-500 transform ${
      isVisible 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-8 opacity-0 scale-95'
    } hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20`}>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
          isVisible ? 'animate-pulse' : ''
        }`}>
          {stepNumber}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`text-2xl transition-all duration-300 ${
              isVisible ? 'motion-bounce' : ''
              }`}
              style={{
              animationDelay: `${delay + 500}ms`,
              animationDuration: '1s',
              animationIterationCount: '3',
              display: 'inline-block'
              }}
            >
              {emoji}
            </span>
            <style jsx>{`
              @keyframes motion-bounce {
              0%, 100% { transform: translateY(0); }
              20% { transform: translateY(-10px); }
              40% { transform: translateY(0); }
              60% { transform: translateY(-6px); }
              80% { transform: translateY(0); }
              }
              .motion-bounce {
              animation-name: motion-bounce;
              }
            `}</style>
            <h3 className="text-lg font-semibold text-gray-100">
              {title}
            </h3>
          </div>
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const page = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setTitleVisible(true), 300),
      setTimeout(() => setSubtitleVisible(true), 800),
      setTimeout(() => setLogoVisible(true), 1200),
      setTimeout(() => setCardVisible(true), 1600)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black grid p-2 grid-cols-12 items-center justify-start pt-20">
        <div className="min-h-screen lg:col-span-6 bg-black text-white flex flex-col items-center justify-center p-8 pt-0">
          <div className="text-left max-w-4xl">
            <h1 className={`text-6xl md:text-8xl font-light leading-tight transform transition-all duration-1000 ${
              titleVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}>
              Agentic Copy Trading Hub
            </h1>
            <div className={`flex items-center justify-left gap-6 text-6xl md:text-8xl font-light transform transition-all duration-1000 ${
              logoVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            }`}>
              <svg viewBox="0 0 243 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-60 h-auto hover:scale-105 transition-transform duration-300">
                <path fillRule="evenodd" clipRule="evenodd" d="M177.919 11.3688C178.145 11.3688 178.369 11.3229 178.576 11.2339C178.784 11.1449 178.971 11.0147 179.127 10.8512L181.548 8.33736C181.697 8.18149 181.876 8.05729 182.074 7.97222C182.272 7.88716 182.485 7.84299 182.7 7.84236H182.801C183.257 7.84236 183.697 8.03648 183.998 8.38266L186.037 10.6797C186.426 11.1165 186.979 11.3688 187.565 11.3688H193.026C190.371 7.83554 186.93 4.96866 182.975 2.99534C179.02 1.02202 174.659 -0.00350479 170.238 1.17707e-05C165.817 -0.00400735 161.456 1.02128 157.5 2.99462C153.544 4.96796 150.103 7.8351 147.448 11.3688H177.919ZM180.8 19.0462H197.137C197.92 21.2785 198.431 23.6338 198.635 26.0765H177.444C177.154 26.0764 176.868 26.015 176.604 25.8962C176.34 25.7774 176.105 25.604 175.913 25.3874L173.873 23.0903C173.724 22.9204 173.539 22.7844 173.333 22.6912C173.126 22.5981 172.902 22.5499 172.676 22.55H172.579C172.363 22.55 172.149 22.5939 171.95 22.679C171.751 22.7641 171.572 22.8886 171.423 23.045L169.005 25.5621C168.849 25.7255 168.662 25.8556 168.455 25.9445C168.247 26.0335 168.024 26.0795 167.798 26.0797H141.838C142.036 23.6823 142.538 21.3197 143.334 19.0494H170.831C171.695 19.0494 172.514 18.6774 173.09 18.0335L174.838 16.06C174.988 15.89 175.172 15.7539 175.379 15.6606C175.585 15.5673 175.809 15.5191 176.036 15.5191C176.262 15.5191 176.486 15.5673 176.693 15.6606C176.899 15.7539 177.084 15.89 177.233 16.06L179.272 18.3571C179.661 18.7938 180.218 19.0462 180.8 19.0462ZM158.757 40.3344C158.601 40.4976 158.413 40.6273 158.205 40.7158C157.997 40.8042 157.773 40.8495 157.547 40.8488H144.561C143.473 38.5975 142.689 36.2116 142.23 33.7538H160.712C161.577 33.7538 162.396 33.385 162.969 32.738L164.716 30.7644C164.866 30.5944 165.05 30.4583 165.257 30.365C165.463 30.2717 165.687 30.2235 165.914 30.2235C166.141 30.2235 166.365 30.2717 166.571 30.365C166.778 30.4583 166.962 30.5944 167.112 30.7644L169.151 33.0615C169.539 33.5015 170.096 33.7506 170.682 33.7506H198.244C197.785 36.2093 197.001 38.5963 195.913 40.8488H167.196C166.906 40.8488 166.62 40.7873 166.356 40.6685C166.092 40.5497 165.857 40.3763 165.665 40.1597L163.626 37.8627C163.476 37.6928 163.292 37.5567 163.085 37.4636C162.879 37.3704 162.655 37.3223 162.428 37.3224H162.331C162.115 37.3224 161.901 37.3662 161.702 37.4513C161.504 37.5364 161.324 37.6609 161.175 37.8174L158.757 40.3344ZM159.482 47.8856H191.074C188.41 50.7462 185.185 53.0268 181.599 54.5849C178.014 56.143 174.145 56.9452 170.235 56.9412C166.326 56.9456 162.457 56.1439 158.872 54.5864C155.286 53.0288 152.061 50.7488 149.396 47.8888H149.513C150.377 47.8888 151.196 47.5168 151.769 46.873L153.517 44.8994C153.667 44.7294 153.851 44.5933 154.057 44.5C154.264 44.4067 154.488 44.3585 154.715 44.3585C154.941 44.3585 155.165 44.4067 155.372 44.5C155.578 44.5933 155.762 44.7294 155.912 44.8994L157.951 47.1965C158.34 47.6332 158.897 47.8856 159.482 47.8856ZM44.2185 55.1003L38.4181 41.0268H12.5039L6.7035 55.1003H0L25.4222 1.83442L50.922 55.0938H44.2185V55.1003ZM14.692 35.6885H36.1588L25.3898 12.9962L14.692 35.6885ZM60.1826 1.83766V55.0971H66.4362V32.3788H74.9491C86.2457 32.3788 92.7258 27.1894 92.7258 17.1827C92.7258 7.17913 86.6244 1.83766 75.0203 1.83766H60.1826ZM73.5184 26.8141H66.4362V7.40236H73.5184C82.4068 7.40236 86.401 10.4888 86.401 17.1827C86.401 23.8797 82.4844 26.8141 73.5184 26.8141ZM115.435 7.55442H97.0535V1.83766H140.068V7.55442H121.686V55.0971H115.432L115.435 7.55442ZM212.822 41.745L207.436 45.3944C211.728 53.3694 217.454 56.5238 225.741 56.5238C235.61 56.5238 242.54 49.678 242.54 41.6318C242.54 34.2553 239.523 29.6677 227.246 24.103C217.83 19.813 215.645 17.4803 215.645 13.42C215.645 9.05884 219.034 5.82354 224.838 5.82354C229.583 5.82354 232.37 7.85531 234.629 11.3882L235.911 11.6924L240.28 8.68354C237.416 3.56531 232.37 0.40766 224.986 0.40766C214.968 0.40766 209.168 6.19883 209.168 13.5721C209.168 20.3403 212.936 25.08 224.009 29.6677C233.651 33.6568 236.063 36.8921 236.063 41.7062C236.063 46.8212 231.768 51.0335 225.666 51.0335C220.167 51.0335 216.551 48.6265 213.237 42.6088L212.822 41.745Z" fill="url(#paint0_linear_aptos_icon_0ein3b4ta)"></path>
                <defs>
                  <linearGradient id="paint0_linear_aptos_icon_0ein3b4ta" x1="0" y1="28.4706" x2="242.54" y2="28.4706" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFCE6D"></stop>
                    <stop offset="1" stopColor="#00D6D6"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-6 px-10 w-full max-w-166 mx-auto rounded-2xl ">
          <div className={`bg-[url("/bg.png")] backdrop-blur-sm flex transition-all duration-1000 bg-card flex-col items-center justify-center gap-2 p-4 rounded-2xl group bg-cover bg-center bg-no-repeat border border-gray-800 shadow-xl transform ${
            cardVisible 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          } hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-700`}>
            <div className="max-w-164 w-full mx-auto space-y-1">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  emoji={step.emoji}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  delay={2000 + (index * 200)}
                />
              ))}
            </div>
            <div className={`transform transition-all duration-1000 ${
              cardVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-95'
            }`} style={{ transitionDelay: '800ms' }}>
              <ConnectWallet 
                className="text-lg px-16 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
               
              />
            </div>
          </div>
        </div>
      </div>
    </>
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

export default page;