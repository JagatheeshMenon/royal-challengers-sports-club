import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-xl shadow-blue-900/5">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary-container uppercase font-headline">
          Royal Challengers Sports Club
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-primary-container font-bold border-b-4 border-secondary-container pb-1 font-label text-sm">Home</Link>
          <a href="#highlights" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Highlights</a>
          <a href="#gallery" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Gallery</a>
          <a href="#upcoming" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Upcoming</a>
          <a href="#about" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">About</a>
          <Link to="/admin" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm flex items-center gap-1">
            <Settings size={14} />
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-on-surface-variant hover:text-error transition-colors p-2"
                title="Logout"
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          ) : (
            <motion.button 
              onClick={() => window.location.href = '/admin'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary editorial-gradient text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-2 font-label text-sm"
            >
              <User size={18} />
              Member Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
