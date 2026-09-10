import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button once user scrolls down 300px
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress percentage (0 - 100)
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case user is already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <button
        type="button"
        id="scroll-to-top-button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to top"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#160b2b]/90 hover:bg-[#200e40] border border-pink-500/40 hover:border-pink-500 text-pink-400 hover:text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_28px_rgba(236,72,153,0.6)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/50"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[2px]"
          viewBox="0 0 48 48"
        >
          {/* Background circle track */}
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-purple-900/40"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Active progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="url(#scrollGradient)"
            strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-150"
          />
          <defs>
            <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Up Arrow Icon */}
        <span className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </span>

        {/* Tooltip on hover */}
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#0e071d] border border-purple-500/30 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          Back to Top ↑
        </span>
      </button>
    </div>
  );
};
