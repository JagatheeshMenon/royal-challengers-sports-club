import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 w-full relative mt-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-screen-2xl mx-auto">
        <div className="space-y-6">
          <div className="text-xl font-black text-primary-container uppercase font-headline">
            Royal Challengers Sports Club
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            The premier destination for sporting excellence and regional talent development.
          </p>
        </div>
        
        <div>
          <h4 className="font-label text-xs uppercase tracking-widest text-primary-container font-bold mb-6">Mission</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Vision 2030</a></li>
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Youth Academy</a></li>
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Community Outreach</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label text-xs uppercase tracking-widest text-primary-container font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Match Tickets</a></li>
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Membership Plans</a></li>
            <li><a href="#" className="text-slate-500 hover:text-primary-container transition-all text-sm">Shop Merchandise</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label text-xs uppercase tracking-widest text-primary-container font-bold mb-6">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex gap-2 text-sm text-slate-500">
              <MapPin size={16} className="shrink-0" />
              12 Royal Arena Way, Club District
            </li>
            <li className="flex gap-2 text-sm text-slate-500">
              <Phone size={16} className="shrink-0" />
              +1 (555) ROYAL-RC
            </li>
            <li className="flex gap-2 text-sm text-slate-500">
              <Mail size={16} className="shrink-0" />
              hello@royalchallengers.club
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-200 py-8 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2024 Royal Challengers Sports Club. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
