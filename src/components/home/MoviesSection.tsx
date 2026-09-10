import React, { useState } from 'react';
import { Film, Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { MovieItem } from '../../types';

interface MoviesSectionProps {
  onOpenMovie: (movieId: string) => void;
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({ onOpenMovie }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const allGenres = ['All', 'Sci-Fi', 'Mystery', 'Adventure', 'Neo-Noir', 'Documentary', 'Cyberpunk'];

  const filteredMovies = siteContent.movies.filter((movie: MovieItem) => {
    if (selectedGenre === 'All') return true;
    return movie.genre.includes(selectedGenre);
  });

  const displayedMovies = showAll ? filteredMovies : filteredMovies.slice(0, 3);

  return (
    <section id="movies" className="py-20 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span>Cinema & Streaming</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured <span className="text-gradient-neon">Cinematic Works</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              Curated speculative fiction, documentaries, and high-concept feature films.
            </p>
          </div>

          <button
            id="view-all-movies-btn"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all cursor-pointer"
          >
            <span>{showAll ? 'Show Featured Only' : 'View All Movies'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
          </button>
        </div>

        {/* Genre Filter Tags */}
        <div className="flex items-center space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-pink-500/25 text-white border border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                  : 'bg-[#15092a] text-purple-300 border border-purple-500/20 hover:text-white hover:border-purple-400/40'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayedMovies.map((movie: MovieItem) => (
            <div
              key={movie.id}
              id={`movie-card-${movie.id}`}
              className="group rounded-2xl glass-card glass-card-hover border border-purple-500/20 hover:border-pink-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300"
            >
              {/* Poster/Backdrop area */}
              <div className="relative h-52 w-full overflow-hidden bg-[#120826]">
                <img
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e061e] via-transparent to-black/40"></div>

                {/* Top Rating Chip */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/70 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{movie.rating}</span>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  {movie.isNew && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-500/30 border border-pink-500/50 text-pink-200 backdrop-blur-md">
                      New
                    </span>
                  )}
                </div>

                {/* Release Year & Duration */}
                <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-xs text-purple-200">
                  <span className="font-semibold">{movie.releaseYear}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-purple-300" />
                    <span>{movie.duration}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#b8abce] line-clamp-2 leading-relaxed mb-4">
                    {movie.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b0d38] text-purple-300 border border-purple-500/20"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <button
                    id={`view-details-btn-${movie.id}`}
                    onClick={() => onOpenMovie(movie.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500/20 to-purple-600/30 border border-purple-500/30 group-hover:border-pink-400 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-pink-400 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
