import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Sidebar from '../components/admin/Sidebar';
import AdminTopNav from '../components/admin/TopNav';
import OverviewCards from '../components/admin/OverviewCards';
import HighlightsTable from '../components/admin/HighlightsTable';
import DynamicBlocks from '../components/admin/DynamicBlocks';
import GalleryUpload from '../components/admin/GalleryUpload';
import Footer from '../components/Footer';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [highlights, setHighlights] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [dynamicBlocks, setDynamicBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        // Fetch highlights
        const { data: highlightsData, error: highlightsError } = await supabase
          .from('highlights')
          .select('*')
          .order('created_at', { ascending: false });

        if (highlightsError) throw highlightsError;
        setHighlights(highlightsData || []);

        // Fetch gallery
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });

        if (galleryError) throw galleryError;
        setGallery(galleryData || []);

        // Fetch dynamic blocks
        const { data: blocksData, error: blocksError } = await supabase
          .from('dynamic_blocks')
          .select('*')
          .order('created_at', { ascending: false });

        if (blocksError) throw blocksError;
        setDynamicBlocks(blocksData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const highlightsSubscription = supabase
      .channel('highlights_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'highlights' }, () => {
        fetchData();
      })
      .subscribe();

    const gallerySubscription = supabase
      .channel('gallery_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      highlightsSubscription.unsubscribe();
      gallerySubscription.unsubscribe();
    };
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid username or password');
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <AdminTopNav />
        <div className="flex-grow flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl shadow-2xl border border-surface-container-high max-w-md w-full text-center space-y-8"
          >
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
              <Lock size={40} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tighter font-headline">Admin Access Required</h2>
              <p className="text-on-surface-variant text-sm">Please sign in with your administrator account to manage the club's content.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-surface-container-high bg-surface placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-surface-container-high bg-surface placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {loginError && (
                <div className="text-red-500 text-sm font-medium">
                  {loginError}
                </div>
              )}
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary editorial-gradient text-white py-4 rounded-xl font-black font-label uppercase text-sm shadow-lg flex items-center justify-center gap-3"
              >
                <LogIn size={20} />
                Sign In
              </motion.button>
            </form>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <AdminTopNav />
      <div className="flex flex-grow">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-grow p-12 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-6xl font-black text-primary uppercase tracking-tighter font-headline">
                {activeSection === 'overview' && 'Overview'}
                {activeSection === 'gallery' && 'Gallery'}
              </h1>
            </div>
            <p className="text-on-surface-variant text-xs font-medium">
              {loading ? 'Syncing...' : 'Real-time Sync Active'}
            </p>
          </div>

          {activeSection === 'overview' && (
            <>
              <OverviewCards highlightsCount={highlights.length} />
              <HighlightsTable highlights={highlights} />
              <DynamicBlocks blocks={dynamicBlocks} />
            </>
          )}

          {activeSection === 'gallery' && (
            <GalleryUpload galleryItems={gallery} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
