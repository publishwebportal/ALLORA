import React, { useState } from 'react';
import { X, Star, Play, Clock, Film, Heart, Bookmark, Share2, Sparkles } from 'lucide-react';
import { MovieItem } from '../../types';

interface MovieDetailsModalProps {
  movie: MovieItem | null;
  onClose: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        id="movie-details-dialog"
        className="w-full max-w-3xl glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden"
      >
        {/* Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d051e] via-[#0d051e]/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Interactive Play Trailer Overlay */}
          {!isPlayingTrailer ? (
            <button
              onClick={() => setIsPlayingTrailer(true)}
              className="absolute inset-0 flex items-center justify-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-1" />
              </div>
            </button>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-pink-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-white">Streaming 4K Ultra-HD Trailer Feed...</p>
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="mt-3 text-xs text-purple-300 hover:text-pink-300 underline"
              >
                Return to details
              </button>
            </div>
          )}

          {/* Floating Rating Badge */}
          <div className="absolute bottom-4 left-6 flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.rating} / 10</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold backdrop-blur-md">
              {movie.releaseYear}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/70 border border-white/10 text-white/80 text-xs flex items-center space-x-1 backdrop-blur-md">
              <Clock className="w-3 h-3" />
              <span>{movie.duration}</span>
            </span>
          </div>
        </div>

        {/* Modal Info Content */}
        <div className="p-6 sm:p-8 bg-[#0d051e] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>
              {movie.director && (
                <p className="text-xs text-purple-300/80 mt-1">
                  Directed by <span className="text-pink-300 font-semibold">{movie.director}</span>
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                  isSaved
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                    : 'bg-[#180c33] border-purple-500/30 text-purple-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-pink-400' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Watchlist'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Movie share link copied to clipboard!');
                }}
                className="p-2.5 rounded-xl bg-[#180c33] border border-purple-500/30 text-purple-300 hover:text-white hover:border-pink-500 transition-colors"
                title="Share Movie"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1c0f38] text-purple-200 border border-purple-500/30"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-purple-300 mb-2">
              Synopsis
            </h4>
            <p className="text-sm sm:text-base text-[#c4b5fd] leading-relaxed">
              {movie.shortDescription}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between">
            <span className="text-xs text-purple-400">
              Curated by ALLORA Cinema Index
            </span>
            <button
              onClick={() => alert(`Streaming provider selector launched for "${movie.title}"`)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 shadow-[0_0_20px_rgba(236,72,153,0.35)] flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Stream Options</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
