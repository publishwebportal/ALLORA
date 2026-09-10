import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User as UserIcon, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { siteContent } from '../../data/siteContent';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAuth, onOpenProfile }) => {
  const { user, profile } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active link spy
      const sections = ['home', 'categories', 'popular', 'new', 'about'];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header py-3.5 shadow-2xl shadow-purple-950/40 border-b border-purple-500/15'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div onClick={() => scrollToSection('home')} className="flex items-center">
          <Logo size="md" />
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#120826]/70 border border-purple-500/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner">
          {siteContent.navigation.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <button
                key={item.label}
                id={`nav-link-${item.sectionId}`}
                onClick={() => scrollToSection(item.sectionId)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-pink-500/25 to-purple-600/30 text-shadow-sm border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                    : 'text-[#c4b5fd] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-medium text-[#c4b5fd] bg-[#1a0f33]/80 border border-purple-500/25 hover:border-pink-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.25)] transition-all duration-200 group"
          >
            <Search className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span>Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-black/40 border border-white/10 rounded text-purple-300 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* User Auth or Profile Button */}
          {user ? (
            <button
              id="header-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#200f40] to-[#150a2b] border border-pink-500/40 hover:border-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.2)] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate text-xs font-medium text-pink-100">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="relative group overflow-hidden px-5 py-2 rounded-full text-xs font-semibold text-white transition-all duration-300"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
              {/* Neon border glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xs opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Login / Sign Up</span>
              </span>
            </button>
          )}
        </div>

        {/* Mobile menu and search toggles */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-[#1a0f33] border border-purple-500/30 text-pink-400 hover:text-white"
            aria-label="Open Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#1a0f33] border border-purple-500/30 text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="sm:hidden absolute top-full left-0 right-0 glass-card border-t border-purple-500/20 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col space-y-3 mb-6">
            {siteContent.navigation.map((item) => (
              <button
                key={item.label}
                id={`mobile-nav-${item.sectionId}`}
                onClick={() => scrollToSection(item.sectionId)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.sectionId
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : 'text-[#c4b5fd] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-purple-500/20 flex flex-col gap-3">
            {user ? (
              <button
                id="mobile-profile-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-900/60 border border-purple-500/30"
              >
                <UserIcon className="w-4 h-4 text-pink-400" />
                <span>Account ({profile?.full_name || user.email?.split('@')[0]})</span>
              </button>
            ) : (
              <button
                id="mobile-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
