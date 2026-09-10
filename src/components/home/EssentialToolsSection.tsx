import React from 'react';
import { QrCode, KeyRound, FileText, Scale, Image as ImageIcon, Code2, ArrowUpRight, Wrench, Sparkles } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { ToolItem } from '../../types';

interface EssentialToolsSectionProps {
  onOpenTool: (toolId: string) => void;
}

export const EssentialToolsSection: React.FC<EssentialToolsSectionProps> = ({ onOpenTool }) => {
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-pink-400" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-purple-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-fuchsia-400" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-indigo-400" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-pink-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-violet-400" />;
      default:
        return <Wrench className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <section id="essential-tools" className="py-20 relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Utilities & Productivity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Essential <span className="text-gradient-neon">Digital Tools</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              High-speed, browser-native utilities built with privacy-first client execution.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-purple-400/80 font-mono">
            Zero Server Uploads • Instant Run
          </div>
        </div>

        {/* Dynamic Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.essentialTools.map((tool: ToolItem) => (
            <div
              key={tool.id}
              id={`tool-card-${tool.id}`}
              className="group rounded-2xl glass-card glass-card-hover p-6 flex flex-col justify-between border border-purple-500/20 hover:border-pink-500/40 relative overflow-hidden transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#1d0f38] border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all">
                    {getToolIcon(tool.iconName)}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {tool.isPopular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold uppercase">
                        Popular
                      </span>
                    )}
                    {tool.isNew && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#b8abce] leading-relaxed mb-6">
                  {tool.shortDescription}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-purple-300/80 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  id={`open-tool-btn-${tool.id}`}
                  onClick={() => onOpenTool(tool.id)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500/20 via-purple-600/30 to-fuchsia-600/20 border border-purple-500/30 group-hover:border-pink-500 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Open Tool</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
