import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { CategoriesSection } from './components/home/CategoriesSection';
import { EssentialToolsSection } from './components/home/EssentialToolsSection';
import { MoviesSection } from './components/home/MoviesSection';
import { SocialMediaSection } from './components/home/SocialMediaSection';
import { PopularSection } from './components/home/PopularSection';
import { NewSection } from './components/home/NewSection';
import { AboutSection } from './components/home/AboutSection';
import { SearchResultsModal } from './components/search/SearchResultsModal';
import { ToolRunnerModal } from './components/tools/ToolRunnerModal';
import { MovieDetailsModal } from './components/movies/MovieDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { InstagramLoginPage } from './components/auth/InstagramLoginPage';
import { ScrollToTop } from './components/common/ScrollToTop';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { SupabaseConfigModal } from './components/auth/SupabaseConfigModal';
import { siteContent } from './data/siteContent';
import { ToolItem, MovieItem } from './types';
import { supabase } from './supabaseClient.js';

function AlloraApp() {
  // Modal states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [instagramLoginOpen, setInstagramLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [supabaseDocsOpen, setSupabaseDocsOpen] = useState(false);

  // Active item detail modals
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [activeMovie, setActiveMovie] = useState<MovieItem | null>(null);

  // Protect private pages with supabase.auth.getSession() — if no session, redirect to /login
  useEffect(() => {
    const currentPath = window.location.pathname.toLowerCase();
    const privatePages = ['/dashboard', '/profile', '/settings', '/account', '/saved'];
    
    if (privatePages.some((path) => currentPath === path || currentPath.startsWith(path + '/'))) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          window.location.href = '/login';
        }
      });
    }

    if (currentPath === '/login' || currentPath === '/signin' || currentPath === '/signup') {
      setAuthOpen(true);
    }

    if (currentPath === '/instagram-login') {
      setInstagramLoginOpen(true);
    }
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAuthOpen(false);
        setProfileOpen(false);
        setSupabaseDocsOpen(false);
        setActiveTool(null);
        setActiveMovie(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(true);
  };

  const handleOpenTool = (toolId: string) => {
    const found = siteContent.essentialTools.find((t) => t.id === toolId);
    if (found) {
      setActiveTool(found);
    }
  };

  const handleOpenMovie = (movieId: string) => {
    const found = siteContent.movies.find((m) => m.id === movieId);
    if (found) {
      setActiveMovie(found);
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070312] text-[#e8e4f5] relative selection:bg-pink-500 selection:text-white">
      {/* Background ambient mesh */}
      <div className="fixed inset-0 bg-mesh-radial pointer-events-none opacity-90 -z-20"></div>

      {/* Navigation Header */}
      <Header
        onOpenSearch={() => {
          setSearchQuery('');
          setSearchOpen(true);
        }}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onSearchSubmit={handleSearchSubmit}
          onExploreCategories={scrollToCategories}
          onOpenSearchModal={() => {
            setSearchQuery('');
            setSearchOpen(true);
          }}
        />

        {/* Categories Section */}
        <CategoriesSection
          onSelectCategory={(categoryId) => {
            const el = document.getElementById(categoryId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Essential Tools Section */}
        <EssentialToolsSection onOpenTool={handleOpenTool} />

        {/* Movies Section */}
        <MoviesSection onOpenMovie={handleOpenMovie} />

        {/* Social Media Section */}
        <SocialMediaSection />

        {/* Popular Section */}
        <PopularSection
          onOpenTool={handleOpenTool}
          onOpenMovie={handleOpenMovie}
          onViewAll={scrollToCategories}
        />

        {/* New Arrivals Section */}
        <NewSection
          onOpenTool={handleOpenTool}
          onOpenMovie={handleOpenMovie}
        />

        {/* About Section */}
        <AboutSection
          onOpenSupabaseModal={() => setSupabaseDocsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAuth={() => setAuthOpen(true)}
        onOpenSupabaseInfo={() => setSupabaseDocsOpen(true)}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

      {/* Search Results Interface Modal */}
      <SearchResultsModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialQuery={searchQuery}
        onOpenTool={handleOpenTool}
        onOpenMovie={handleOpenMovie}
      />

      {/* Interactive Tool Runner Modal */}
      <ToolRunnerModal
        tool={activeTool}
        onClose={() => setActiveTool(null)}
      />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={activeMovie}
        onClose={() => setActiveMovie(null)}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onOpenSupabaseDocs={() => {
          setAuthOpen(false);
          setSupabaseDocsOpen(true);
        }}
        onOpenInstagramLogin={() => {
          setAuthOpen(false);
          setInstagramLoginOpen(true);
        }}
      />

      {/* Instagram-style Dedicated Login Portal */}
      {instagramLoginOpen && (
        <InstagramLoginPage
          onClose={() => {
            setInstagramLoginOpen(false);
            if (window.location.pathname === '/instagram-login') {
              window.history.pushState(null, '', '/');
            }
          }}
          onSuccess={() => {
            setInstagramLoginOpen(false);
            if (window.location.pathname === '/instagram-login') {
              window.history.pushState(null, '', '/');
            }
          }}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenSupabaseDocs={() => {
          setProfileOpen(false);
          setSupabaseDocsOpen(true);
        }}
      />

      {/* Supabase Technical Documentation & Setup Modal */}
      <SupabaseConfigModal
        isOpen={supabaseDocsOpen}
        onClose={() => setSupabaseDocsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AlloraApp />
    </AuthProvider>
  );
}
