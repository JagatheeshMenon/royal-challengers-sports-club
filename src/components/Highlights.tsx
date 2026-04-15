import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

export default function Highlights() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .eq('status', 'Visible')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHighlights(data || []);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('highlights_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'highlights' }, () => {
        fetchHighlights();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-surface" id="highlights">
        <div className="max-w-screen-2xl mx-auto px-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-64 bg-surface-container-high mx-auto rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-surface-container-high rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-surface" id="highlights">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-primary uppercase tracking-tighter mb-4 font-headline">Highlights of the Week</h2>
            <div className="w-24 h-1.5 bg-secondary-container"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.length > 0 ? (
            highlights.map((item, index) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-xl shadow-on-surface/5 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <span className="font-label text-xs font-bold text-secondary-container bg-primary px-2 py-0.5 rounded uppercase tracking-widest mb-4 inline-block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-primary mb-3 font-headline">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">{item.description || "No description available."}</p>
                  <a href="#" className="inline-flex items-center text-primary font-bold font-label text-xs uppercase tracking-widest group-hover:gap-3 gap-2 transition-all">
                    Read More <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-medium">
              No highlights available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
