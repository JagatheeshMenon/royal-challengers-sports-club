import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabase';
import { Play, BarChart3, Layout } from 'lucide-react';

export default function DynamicContent() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from('dynamic_blocks')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlocks(data || []);
      } catch (error) {
        console.error("Error fetching dynamic blocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('dynamic_blocks_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dynamic_blocks' }, () => {
        fetchBlocks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading || blocks.length === 0) return null;

  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 space-y-24">
        {blocks.map((block, index) => (
          <motion.div 
            key={block.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <span className="font-label text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <Layout size={14} />
                  {block.type}
                </span>
                <h2 className="text-6xl font-black text-primary uppercase tracking-tighter leading-[0.9] font-headline">
                  {block.title}
                </h2>
              </div>
              
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
                {block.description || "Experience the next level of club engagement with our dynamic content modules. Stay updated with the latest news, stats, and media directly from the heart of the club."}
              </p>

              {block.type === 'Stats Grid' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-high">
                    <p className="text-3xl font-black text-primary font-headline">98%</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Win Rate</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-high">
                    <p className="text-3xl font-black text-primary font-headline">12k</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Fans</p>
                  </div>
                </div>
              )}

              <button className="bg-primary text-white px-8 py-4 rounded-xl font-black font-label uppercase text-sm tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                Explore More
              </button>
            </div>

            <div className="flex-1 relative group">
              <div className="absolute -inset-4 bg-secondary-container/10 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-2xl">
                <img 
                  src={block.asset_url || "https://picsum.photos/seed/sports/1200/900"} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {block.type === 'Video Player' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[2px]">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play size={32} fill="currentColor" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
