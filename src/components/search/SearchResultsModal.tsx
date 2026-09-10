import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ExternalLink, ArrowRight, Loader2, Sparkles, Film, Wrench, Share2, Globe, Star } from 'lucide-react';
import { searchService } from '../../services/searchService';
import { SearchResultItem } from '../../types';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOpenTool?: (toolId: string) => void;
  onOpenMovie?: (movieId: string) => void;
}

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onOpenTool,
  onOpenMovie,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      if (initialQuery) {
        performSearch(initialQuery, activeCategory);
      } else {
        // Show default discovery set
        performSearch('a', 'All');
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialQuery]);

  const performSearch = async (searchTerm: string, category: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchService.search(searchTerm, category);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim(), activeCategory);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    performSearch(query.trim() || 'all', cat);
  };

  const handleResultAction = (item: SearchResultItem) => {
    if (item.type === 'tool' && onOpenTool) {
      const toolId = item.id.replace('tool-', '');
      onClose();
      onOpenTool(toolId);
    } else if (item.type === 'movie' && onOpenMovie) {
      const movieId = item.id.replace('movie-', '');
      onClose();
      onOpenMovie(movieId);
    } else if (item.url) {
      if (item.url.startsWith('http')) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        const targetId = item.url.replace('#', '');
        onClose();
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!isOpen) return null;

  const categories = ['All', 'Essential Tools', 'Movies', 'Social Media'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Essential Tools':
        return <Wrench className="w-3.5 h-3.5 text-pink-400" />;
      case 'Movies':
        return <Film className="w-3.5 h-3.5 text-purple-400" />;
      case 'Social Media':
        return <Share2 className="w-3.5 h-3.5 text-fuchsia-400" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        id="search-results-dialog"
        className="w-full max-w-3xl glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden my-6 transition-all"
      >
        {/* Header & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-purple-500/20 bg-[#120826]/90">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs uppercase tracking-widest text-pink-300 font-bold">
                ALLORA Search Engine
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-pink-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                performSearch(e.target.value, activeCategory);
              }}
              placeholder="Search tools, movies, platforms, or discover content..."
              className="w-full bg-[#1b0e38] text-white placeholder-purple-300/40 text-base rounded-xl pl-12 pr-24 py-3 border border-purple-500/30 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all font-medium"
            />
            <div className="absolute right-3 flex items-center space-x-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    performSearch('', activeCategory);
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-purple-400 hover:text-white"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-purple-400/80 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-pink-500/30 text-white border border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                    : 'bg-[#180b33] text-purple-300 border border-purple-500/20 hover:text-white hover:border-purple-400/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="px-6 py-2.5 bg-[#0e061e] border-b border-purple-500/10 flex items-center justify-between text-xs text-[#9d8ebd]">
          <span>
            {loading ? (
              <span className="flex items-center space-x-1.5 text-pink-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching catalog...</span>
              </span>
            ) : (
              <span>
                Found <strong className="text-white font-semibold">{results.length}</strong> results {query && <span>for "{query}"</span>}
              </span>
            )}
          </span>
          <span className="text-[11px] text-purple-400/70">
            Powered by ALLORA Discovery Core
          </span>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 max-h-[55vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-purple-300">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              <p className="text-sm font-medium">Scanning tools, cinema, and network feeds...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                id={`search-result-${item.id}`}
                onClick={() => handleResultAction(item)}
                className="p-4 rounded-xl bg-[#170c30]/70 border border-purple-500/20 hover:border-pink-500/50 hover:bg-[#201042] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-900/60 border border-purple-500/30 text-purple-200">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      <span className="text-xs text-purple-400/70">
                        {item.sourceDomain}
                      </span>
                      {item.rating && (
                        <span className="inline-flex items-center text-amber-400 text-xs font-semibold space-x-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.rating}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#b3a4cb] leading-relaxed">
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-purple-300 border border-white/5"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                      {item.type === 'external' ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">
                No matching results found
              </h4>
              <p className="text-xs text-purple-300/80 max-w-sm mx-auto mb-4">
                Try searching for keywords like "QR", "Movies", "Password", "Instagram", or switch filters.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['QR Code', 'Sci-Fi', 'Converter', 'Social'].map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => {
                      setQuery(rec);
                      performSearch(rec, activeCategory);
                    }}
                    className="px-3 py-1 rounded-full text-xs bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white hover:border-pink-500"
                  >
                    Search "{rec}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
