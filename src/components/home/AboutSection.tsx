import React from 'react';
import { Sparkles, Layers, ShieldCheck, Zap, Database, ArrowRight } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface AboutSectionProps {
  onOpenSupabaseModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenSupabaseModal }) => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-pink-600/10 via-purple-700/15 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>About ALLORA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {siteContent.about.heading}
            </h2>

            <p className="text-base sm:text-lg text-[#c4b5fd] leading-relaxed">
              {siteContent.about.tagline}
            </p>

            {/* Feature Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {siteContent.about.coreValues.map((val) => (
                <div
                  key={val.title}
                  className="p-4 rounded-xl bg-[#14092b]/80 border border-purple-500/20"
                >
                  <h4 className="text-sm font-bold text-white mb-1.5 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    <span>{val.title}</span>
                  </h4>
                  <p className="text-xs text-[#a79bbd] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Architectural Glass Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl glass-card p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="flex items-center space-x-3 pb-4 border-b border-purple-500/20 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Platform Stack</h4>
                  <span className="text-xs text-purple-300">Supabase Auth & PostgreSQL</span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#b8abce]">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#120726] border border-purple-500/20">
                  <span className="text-purple-200 font-medium">Auth Provider</span>
                  <span className="text-pink-400 font-mono">Supabase Auth (Email + Instagram)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#120726] border border-purple-500/20">
                  <span className="text-purple-200 font-medium">Security</span>
                  <span className="text-purple-300 font-mono">PostgreSQL Row-Level Security</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#120726] border border-purple-500/20">
                  <span className="text-purple-200 font-medium">Tool Execution</span>
                  <span className="text-emerald-400 font-mono">100% Client-Side In-Memory</span>
                </div>
              </div>

              <button
                onClick={onOpenSupabaseModal}
                className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500/20 to-purple-600/30 border border-pink-500/30 hover:border-pink-500 hover:bg-pink-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>View Supabase Schema & Setup</span>
                <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
