import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', spacing: 'gap-2.5' },
    md: { icon: 36, text: 'text-xl', spacing: 'gap-3' },
    lg: { icon: 48, text: 'text-2xl', spacing: 'gap-3.5' },
  }[size];

  return (
    <div className={`flex items-center ${dimensions.spacing} group cursor-pointer ${className}`} id="allora-brand-logo">
      {/* Unique ALLORA Icon: Geometric Cyber Prism / Infinity Apex */}
      <div className="relative flex items-center justify-center">
        {/* Glow halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
        
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="allora-grad-primary" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff2e93" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="allora-grad-accent" x1="22" y1="6" x2="22" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
            </linearGradient>
            <filter id="allora-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Prism Diamond Frame */}
          <rect
            x="5"
            y="5"
            width="34"
            height="34"
            rx="9"
            fill="#120826"
            stroke="url(#allora-grad-primary)"
            strokeWidth="1.75"
          />

          {/* Futuristic Stylized "A" Apex Glyph */}
          <path
            d="M22 10L32 30H27.5L25 24H19L16.5 30H12L22 10Z"
            fill="url(#allora-grad-primary)"
            filter="url(#allora-neon-glow)"
          />

          {/* Translucent Central Bridge & Orbital Core */}
          <path
            d="M20 20.5H24L22 15.5L20 20.5Z"
            fill="#0b0417"
          />

          {/* Center Luminous Energy Pip */}
          <circle
            cx="22"
            cy="27"
            r="2.2"
            fill="url(#allora-grad-accent)"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-extrabold tracking-[0.22em] text-white leading-none ${dimensions.text} transition-colors group-hover:text-pink-300`}>
            ALLORA
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-pink-400/80 font-medium mt-0.5">
            DISCOVERY
          </span>
        </div>
      )}
    </div>
  );
};
