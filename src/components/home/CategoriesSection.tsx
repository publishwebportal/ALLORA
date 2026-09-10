import React, { useState } from 'react';
import { Wrench, Film, Share2, ArrowRight, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface CategoriesSectionProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const [showFutureModal, setShowFutureModal] = useState(false);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-pink-400" />;
      case 'Film':
        return <Film className="w-6 h-6 text-purple-400" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-fuchsia-400" />;
      default:
        return <Layers className="w-6 h-6 text-pink-400" />;
    }
  };

  const scrollToCategory = (id: string) => {
    onSelectCategory(id);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-20 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Core Modules</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated <span className="text-gradient-neon">Discovery Hubs</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              Navigate seamlessly across utility tools, cinema collections, and social portals.
            </p>
          </div>

          <button
            onClick={() => setShowFutureModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-300 hover:text-pink-300 transition-colors group cursor-pointer"
          >
            <span>Preview upcoming catalog</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Main Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteContent.categories.map((category) => (
            <div
              key={category.id}
              id={`category-card-${category.id}`}
              className="group relative rounded-2xl glass-card glass-card-hover p-7 flex flex-col justify-between overflow-hidden border border-purple-500/20 hover:border-pink-500/50 transition-all duration-300"
            >
              {/* Top Card Glow Background */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${category.color} rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`}
              ></div>

              <div>
                {/* Top Row: Icon and Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#1d0f38] border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)] transition-all duration-300">
                    {getCategoryIcon(category.iconName)}
                  </div>
                  {category.badge && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-500/15 border border-pink-500/30 text-pink-300">
                      {category.badge}
                    </span>
                  )}
                </div>

                {/* Category Details */}
                <div className="text-xs uppercase tracking-widest font-semibold text-purple-400 mb-1">
                  {category.tagline}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-[#b8abce] leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>

              {/* Bottom Action and Stats */}
              <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300/80">
                  {category.itemCount}
                </span>

                <button
                  id={`explore-btn-${category.id}`}
                  onClick={() => scrollToCategory(category.id)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500/20 to-purple-600/30 border border-pink-500/30 group-hover:border-pink-400 group-hover:bg-pink-500/30 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-pink-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Categories Expansion Modal */}
      {showFutureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-2xl w-full rounded-2xl p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="text-xl font-bold text-white">
                  Future Categories Expansion Catalog
                </h3>
              </div>
              <button
                onClick={() => setShowFutureModal(false)}
                className="px-3 py-1 rounded-lg text-xs bg-purple-900/40 text-purple-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-[#b8abce] mb-6 leading-relaxed">
              ALLORA is built with an expandable architecture designed to host future discovery verticals.
              The backend data model is already wired to integrate these categories seamlessly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {siteContent.futureCategoriesCatalog.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl bg-[#170c30] border border-purple-500/20 hover:border-pink-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{cat.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-pink-300 font-semibold">
                      Planned
                    </span>
                  </div>
                  <p className="text-xs text-[#a091ba]">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
