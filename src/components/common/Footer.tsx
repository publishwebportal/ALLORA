import React from 'react';
import { Logo } from './Logo';
import { siteContent } from '../../data/siteContent';
import { Github, Twitter, Instagram, Disc as Discord, Shield, Database, Heart } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface FooterProps {
  onOpenAuth: () => void;
  onOpenSupabaseInfo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenSupabaseInfo }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="relative border-t border-purple-500/20 bg-[#060210] overflow-hidden pt-16 pb-12">
      {/* Background neon blur orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-r from-pink-500/10 via-purple-600/15 to-indigo-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm font-semibold tracking-wide text-gradient-neon">
              {siteContent.footer.brandQuote}
            </p>
            <p className="text-sm text-[#a79bbd] max-w-sm leading-relaxed">
              {siteContent.brand.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#160d2b] border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#160d2b] border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#160d2b] border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                aria-label="Discord"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#160d2b] border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4 flex items-center space-x-1.5">
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b8abce]">
              {siteContent.footer.sections.navigation.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href.replace('#', ''))}
                    className="hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b8abce]">
              {siteContent.footer.sections.categories.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href.replace('#', ''))}
                    className="hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Account & Backend Status */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Account & Cloud
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b8abce]">
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-pink-300 transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupabaseInfo}
                  className="flex items-center space-x-1.5 text-left hover:text-pink-300 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-pink-400 inline" />
                  <span>Supabase Backend</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isSupabaseConfigured
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isSupabaseConfigured ? 'Connected' : 'Setup Ready'}
                  </span>
                </button>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={() => scrollTo('about')}
                  className="hover:text-pink-300 transition-colors"
                >
                  Platform Architecture
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Disclaimer */}
        <div className="pt-8 mt-8 border-t border-purple-500/15 flex flex-col md:flex-row items-center justify-between text-xs text-[#8c7fa6] gap-4">
          <p>{siteContent.footer.copyright}</p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-[#73668f]">
            {siteContent.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};
