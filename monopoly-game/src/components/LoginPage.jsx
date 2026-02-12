import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('LOGIN FAILED!');
      console.error("Error logging in with email and password", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError('GOOGLE LINK FAILED!');
      console.error("Error logging in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 font-retro bg-[#0a0a0a]">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 crt-overlay opacity-[0.03]"></div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-[480px]">

        {/* Retro Header */}
        <div className="text-center mb-12 transform -rotate-2">
          <h1 className="text-4xl md:text-5xl font-black text-[#ffcc00] mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest animate-pulse">
            MONOPOLY
          </h1>
          <div className="inline-block bg-[#ff3366] text-white text-[10px] px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
            v1.0.8-BIT
          </div>
        </div>

        {/* Retro Card */}
        <div className="bg-[#e0e0e0] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative">
          {/* Card Corner detail */}
          <div className="absolute top-0 right-0 w-8 h-8 border-l-[6px] border-b-[6px] border-black"></div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-[#ff3333] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-white text-[10px] leading-relaxed text-center font-bold">
                !!! {error} !!!
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-black text-[12px] mb-3 uppercase font-bold">
                Enter Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-4 border-black p-3 text-[12px] focus:bg-[#ffffcc] focus:outline-none placeholder-gray-400 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                placeholder="PLAYER@GMAIL.COM"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-black text-[12px] mb-3 uppercase font-bold">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 text-[12px] focus:bg-[#ffffcc] focus:outline-none placeholder-gray-400 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] hover:text-[#ff3366]"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#40ff00] border-[6px] border-black p-4 text-black text-[16px] font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:translate-0 disabled:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              {isLoading ? "LOADING..." : "START GAME"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-1 bg-black"></div>
            <span className="px-4 text-[10px] text-black font-bold">SELECT LINK</span>
            <div className="flex-1 h-1 bg-black"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border-4 border-black p-3 flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            </svg>
            <span className="text-[12px] font-bold">GOOGLE LOGIN</span>
          </button>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-[10px] text-black">
              NO ACCOUNT? <a href="#" className="text-[#ff3366] underline hover:bg-[#ff3366] hover:text-white">JOIN NOW</a>
            </p>
            <div className="flex justify-center gap-4 text-[8px] text-gray-600">
              <a href="#" className="hover:text-black">INFO</a>
              <a href="#" className="hover:text-black">HELP</a>
            </div>
          </div>
        </div>

        {/* Floating Credit */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-500 animate-bounce">
            INSERT COIN TO PLAY
          </p>
          <div className="mt-4 text-[8px] text-gray-700">
            © 198X MONOPOLY SYSTEMS
          </div>
        </div>
      </div>

      <style jsx>{`
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
        }
        
        @keyframes flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.95; }
          10% { opacity: 0.9; }
          15% { opacity: 0.95; }
          20% { opacity: 0.98; }
          25% { opacity: 0.95; }
          30% { opacity: 0.9; }
          100% { opacity: 1; }
        }

        .animate-flicker {
          animation: flicker 0.15s infinite;
        }

        @font-face {
          font-family: 'retro';
          font-display: swap;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;