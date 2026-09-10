import React from 'react';
import { X, LogOut, User as UserIcon, Mail, Key, ShieldCheck, Database, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupabaseDocs: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenSupabaseDocs,
}) => {
  const { user, profile, signOut, isConfigured } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="user-profile-dialog"
        className="w-full max-w-md glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(236,72,153,0.25)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 bg-[#120826]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-pink-500/20">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {profile?.full_name || 'Allora Explorer'}
              </h3>
              <p className="text-xs text-purple-300">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4 bg-[#120826]">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#180c33] border border-purple-500/20 flex items-center justify-between">
              <span className="text-xs text-purple-300 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <span>Email Account</span>
              </span>
              <span className="text-xs font-semibold text-white">{user.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#180c33] border border-purple-500/20 flex items-center justify-between">
              <span className="text-xs text-purple-300 flex items-center space-x-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span>Supabase UUID</span>
              </span>
              <span className="text-[11px] font-mono text-pink-300">
                {user.id.slice(0, 16)}...
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#180c33] border border-purple-500/20 flex items-center justify-between">
              <span className="text-xs text-purple-300 flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Database Sync</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isConfigured ? 'Live PostgreSQL' : 'Local Sandbox'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={onOpenSupabaseDocs}
              className="w-full py-2.5 rounded-xl bg-[#180c33] border border-purple-500/30 text-purple-200 hover:text-white hover:border-pink-500 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              <span>Inspect Supabase Schema & RLS Policies</span>
            </button>

            <button
              id="user-signout-btn"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
