import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Compass, ShieldCheck, Film, Wrench, Share2 } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface HeroProps {
  onSearchSubmit: (query: string) => void;
  onExploreCategories: () => void;
  onOpenSearchModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  onExploreCategories,
  onOpenSearchModal,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    } else {
      onOpenSearchModal();
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchInput(term);
    onSearchSubmit(term);
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Futuristic Background Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-pink-600/20 via-fuchsia-600/15 to-purple-800/25 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-700/15 rounded-full blur-[90px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-pink-500/12 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Subtle geometric light ring in background */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10 pointer-events-none -z-10"></div>
      <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-pink-500/10 pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 to-purple-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(236,72,153,0.15)] animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>{siteContent.hero.eyebrow}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          {siteContent.hero.titleStart}
          <span className="text-gradient-neon inline-block ml-1">
            {siteContent.hero.titleGradient}
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#c4b5fd] font-normal leading-relaxed mb-10">
          {siteContent.hero.description}
        </p>

        {/* Large Premium Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form
            onSubmit={handleFormSubmit}
            className="relative group transition-all duration-300"
          >
            {/* Search glow outline */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-600/30 to-fuchsia-500/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"></div>

            <div className="relative flex items-center bg-[#120826]/95 border border-purple-500/30 group-focus-within:border-pink-500/60 rounded-2xl px-4 py-2.5 sm:py-3 shadow-2xl backdrop-blur-xl">
              <Search className="w-5 h-5 text-pink-400 mr-3 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={siteContent.hero.searchPlaceholder}
                className="w-full bg-transparent text-white placeholder-purple-300/50 text-base focus:outline-none font-medium"
              />
              <button
                type="submit"
                id="hero-search-submit"
                className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center space-x-1.5 shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-purple-400/80 font-medium mr-1">Trending:</span>
            {siteContent.hero.quickSuggestions.map((item) => (
              <button
                key={item}
                onClick={() => handleSuggestionClick(item)}
                className="px-3 py-1 rounded-full bg-[#1b1033]/80 border border-purple-500/20 text-[#d8b4fe] hover:text-white hover:border-pink-500/40 hover:bg-pink-500/10 transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            id="hero-explore-categories-btn"
            onClick={onExploreCategories}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:opacity-95 shadow-[0_0_28px_rgba(236,72,153,0.4)] hover:shadow-[0_0_36px_rgba(236,72,153,0.6)] transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{siteContent.hero.primaryCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-start-searching-btn"
            onClick={onOpenSearchModal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-purple-200 bg-[#160b2e]/90 hover:bg-[#211145] border border-purple-500/30 hover:border-pink-500/40 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-pink-400" />
            <span>{siteContent.hero.secondaryCta}</span>
          </button>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-3 max-w-lg mx-auto mt-16 pt-8 border-t border-purple-500/15 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5 text-pink-400 font-bold text-lg">
              <Wrench className="w-4 h-4" />
              <span>12+</span>
            </div>
            <span className="text-[11px] text-[#9d8ebd] uppercase tracking-wider mt-1">Tools</span>
          </div>
          <div className="flex flex-col items-center border-x border-purple-500/15">
            <div className="flex items-center space-x-1.5 text-purple-300 font-bold text-lg">
              <Film className="w-4 h-4" />
              <span>2.4k+</span>
            </div>
            <span className="text-[11px] text-[#9d8ebd] uppercase tracking-wider mt-1">Movies</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5 text-fuchsia-400 font-bold text-lg">
              <Share2 className="w-4 h-4" />
              <span>10+</span>
            </div>
            <span className="text-[11px] text-[#9d8ebd] uppercase tracking-wider mt-1">Networks</span>
          </div>
        </div>
      </div>
    </section>
  );
};
