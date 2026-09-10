import React from 'react';
import { Flame, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface PopularSectionProps {
  onOpenTool: (toolId: string) => void;
  onOpenMovie: (movieId: string) => void;
  onViewAll: () => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({
  onOpenTool,
  onOpenMovie,
  onViewAll,
}) => {
  // Collect popular tools & movies
  const popularTools = siteContent.essentialTools.filter((t) => t.isPopular);
  const popularMovies = siteContent.movies.filter((m) => m.isPopular);

  return (
    <section id="popular" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              <span>Trending Worldwide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Most Popular <span className="text-gradient-neon">Right Now</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              The highest-rated utilities and cinematic features actively engaged by the ALLORA community.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all cursor-pointer"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
          </button>
        </div>

        {/* Popular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Popular Tool 1 */}
          {popularTools.slice(0, 2).map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl glass-card glass-card-hover border border-purple-500/20 hover:border-pink-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Tool • Highly Ranked
                  </span>
                  <Flame className="w-4 h-4 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-xs sm:text-sm text-[#b8abce] mb-6">
                  {tool.shortDescription}
                </p>
              </div>

              <button
                onClick={() => onOpenTool(tool.id)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Tool</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Top Popular Movie */}
          {popularMovies.slice(0, 1).map((movie) => (
            <div
              key={movie.id}
              className="p-6 rounded-2xl glass-card glass-card-hover border border-purple-500/20 hover:border-pink-500/40 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    Cinema • Top Pick
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
                <p className="text-xs sm:text-sm text-[#b8abce] line-clamp-3 mb-6">
                  {movie.shortDescription}
                </p>
              </div>

              <button
                onClick={() => onOpenMovie(movie.id)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
              >
                <span>Movie Dossier & Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
