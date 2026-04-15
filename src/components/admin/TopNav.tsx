import { Link } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';

export default function AdminTopNav() {
  return (
    <nav className="bg-white border-b border-surface-container-high sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary-container uppercase font-headline">
            Royal Challengers Sports Club
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors font-label uppercase tracking-widest">
            <ArrowLeft size={14} />
            Back to Site
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-primary-container font-bold border-b-4 border-secondary-container pb-1 font-label text-sm">Dashboard Overview</a>
          <a href="#" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Hero Banner</a>
          <a href="#" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Highlights</a>
          <a href="#" className="text-slate-600 hover:text-primary-container transition-colors font-label text-sm">Gallery</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-primary editorial-gradient text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-2 font-label text-sm">
            <User size={18} />
            Admin Account
          </button>
        </div>
      </div>
    </nav>
  );
}
