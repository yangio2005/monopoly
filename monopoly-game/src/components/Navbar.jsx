import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-retro bg-[#0a0a0a]/90 backdrop-blur-sm border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left Section - Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-3 py-2 bg-[#e0e0e0] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-bold text-black hidden sm:inline">BACK</span>
          </button>

          {/* Center Section - Logo */}
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 group"
          >
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-black text-[#ffcc00] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tighter hover:scale-110 transition-transform">
                MONOPOLY
              </span>
              <div className="h-1 w-full bg-[#ffcc00] mt-1 hidden group-hover:block"></div>
            </div>
          </Link>

          {/* Right Section - Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/docs"
              className="px-4 py-2 bg-[#ffffcc] border-4 border-black text-black text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              DOCS
            </Link>
            <Link
              to="/showcase"
              className="px-4 py-2 bg-[#ccffff] border-4 border-black text-black text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ASSETS
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 bg-[#ffccff] border-4 border-black text-black text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              PLAYER
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#ff3366] border-4 border-black text-white text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              EXIT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 bg-[#e0e0e0] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <div className="w-full h-1 bg-black"></div>
              <div className="w-full h-1 bg-black"></div>
              <div className="w-full h-1 bg-black"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[400px] border-t-4 border-black' : 'max-h-0'}`}
      >
        <div className="px-4 py-6 space-y-4 bg-white">
          <Link
            to="/docs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full p-4 bg-[#ffffcc] border-4 border-black text-black text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            DOCUMENTS
          </Link>
          <Link
            to="/showcase"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full p-4 bg-[#ccffff] border-4 border-black text-black text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            GAME ASSETS
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full p-4 bg-[#ffccff] border-4 border-black text-black text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            PLAYER PROFILE
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full p-4 bg-[#ff3366] border-4 border-black text-white text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            LOGOUT GAME
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
