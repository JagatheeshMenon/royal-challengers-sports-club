import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, PlayCircle } from 'lucide-react';
import { supabase } from '../supabase';

const categories = ["All", "Photos", "Videos", "Match Day"];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGalleryItems(data || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('gallery_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
        fetchGallery();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-24 bg-surface" id="gallery">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-primary uppercase tracking-tighter mb-6 font-headline">Gallery</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold font-label text-xs uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? "bg-secondary-container text-on-secondary-container" 
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">No items in this category yet.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-xl overflow-hidden cursor-pointer"
                >
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {item.type === 'video' ? (
                      <PlayCircle className="text-white" size={48} />
                    ) : (
                      <Eye className="text-white" size={48} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
