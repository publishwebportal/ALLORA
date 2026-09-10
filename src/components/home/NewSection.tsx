import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight, Clock, Star } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface NewSectionProps {
  onOpenTool: (toolId: string) => void;
  onOpenMovie: (movieId: string) => void;
}

export const NewSection: React.FC<NewSectionProps> = ({ onOpenTool, onOpenMovie }) => {
  const newTools = siteContent.essentialTools.filter((t) => t.isNew);
  const newMovies = siteContent.movies.filter((m) => m.isNew);

  return (
    <section id="new" className="py-20 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Fresh Arrivals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Recently Added <span className="text-gradient-neon">to ALLORA</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              Discover newly deployed utilities, fresh releases, and platform enhancements.
            </p>
          </div>

          <span className="mt-4 md:mt-0 text-xs font-mono text-purple-400/80">
            Updated Daily
          </span>
        </div>

        {/* Dynamic New Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newTools.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl glass-card glass-card-hover border border-purple-500/20 hover:border-pink-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    New Utility
                  </span>
                  <span className="text-xs text-pink-400 flex items-center space-x-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>v2.4</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-xs sm:text-sm text-[#b8abce] leading-relaxed mb-6">
                  {tool.shortDescription}
                </p>
              </div>

              <button
                onClick={() => onOpenTool(tool.id)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
              >
                <span>Try Utility</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {newMovies.slice(0, 1).map((movie) => (
            <div
              key={movie.id}
              className="p-6 rounded-2xl glass-card glass-card-hover border border-purple-500/20 hover:border-pink-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    New Premiere
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
                <p className="text-xs sm:text-sm text-[#b8abce] leading-relaxed mb-6">
                  {movie.shortDescription}
                </p>
              </div>

              <button
                onClick={() => onOpenMovie(movie.id)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
              >
                <span>View Premiere</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
