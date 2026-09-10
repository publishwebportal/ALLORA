import React from 'react';
import { Share2, Instagram, Facebook, Video, Youtube, Twitter, Ghost, MessageSquare, Compass, ExternalLink, Sparkles, ShieldAlert } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { SocialPlatformItem } from '../../types';

export const SocialMediaSection: React.FC = () => {
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-[#E4405F]" />;
      case 'Facebook':
        return <Facebook className="w-5 h-5 text-[#1877F2]" />;
      case 'Video':
        return <Video className="w-5 h-5 text-[#FE2C55]" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-[#FF0000]" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
      case 'Ghost':
        return <Ghost className="w-5 h-5 text-[#FFFC00]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#5865F2]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#FF4500]" />;
      default:
        return <Share2 className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <section id="social-media" className="py-20 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-purple-800/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Global Networks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Social Media <span className="text-gradient-neon">Portals</span>
            </h2>
            <p className="text-[#a79bbd] text-sm sm:text-base mt-2 max-w-xl">
              Direct access launchpads to creator hubs, global communities, and real-time feeds.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-[11px] text-[#8e81a8] bg-[#140829] px-3.5 py-1.5 rounded-full border border-purple-500/20">
            <ShieldAlert className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>Independent gateway. Not affiliated with listed platforms.</span>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteContent.socialPlatforms.map((platform: SocialPlatformItem) => (
            <div
              key={platform.id}
              id={`social-card-${platform.id}`}
              className="group rounded-2xl glass-card glass-card-hover p-6 flex flex-col justify-between border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1d0f38] border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.15)] transition-all">
                    {getSocialIcon(platform.iconName)}
                  </div>

                  {platform.badge && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 font-semibold">
                      {platform.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {platform.name}
                </h3>
                <p className="text-xs text-[#b8abce] leading-relaxed mb-6">
                  {platform.shortDescription}
                </p>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noreferrer noopener"
                id={`open-social-btn-${platform.id}`}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a0e36] border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:text-white" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
