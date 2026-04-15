import { 
  LayoutDashboard, 
  Image, 
  Star, 
  User, 
  Images, 
  Calendar, 
  Share2, 
  Layers 
} from 'lucide-react';

const menuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Banner', icon: Image },
  { id: 'highlights', label: 'Highlights', icon: Star },
  { id: 'performer', label: 'Performer', icon: User },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'fixtures', label: 'Fixtures', icon: Calendar },
  { id: 'about', label: 'About/Social', icon: Share2 },
  { id: 'dynamic', label: 'Dynamic Blocks', icon: Layers },
];

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-surface-container-low border-r border-surface-container-high h-screen sticky top-0 flex flex-col p-6">
      <div className="mb-8">
        <p className="font-label text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Main Menu</p>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-bold transition-all ${
                activeSection === item.id
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
