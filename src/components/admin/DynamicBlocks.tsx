import { useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Play, BarChart3, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../supabase';

export default function DynamicBlocks({ blocks }: { blocks: any[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Text & Image');
  const [isVisible, setIsVisible] = useState(true);
  const [assetUrl, setAssetUrl] = useState('https://picsum.photos/seed/sports/1200/900');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBlock = async () => {
    if (!title) return alert("Please enter a block title");
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('dynamic_blocks')
        .insert({
          title,
          description,
          type,
          is_visible: isVisible,
          asset_url: assetUrl,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      setTitle('');
      setDescription('');
      alert("Block generated successfully!");
    } catch (e: any) {
      setError(`Create Failed: ${e.message || 'Unable to create block'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const randomizeImage = () => {
    const seeds = ['stadium', 'athlete', 'match', 'trophy', 'team', 'training'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setAssetUrl(`https://picsum.photos/seed/${randomSeed}-${Date.now()}/1200/900`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-2 font-headline">Dynamic Blocks</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Extend your website layout with custom content blocks. Choose a type and populate your data instantly.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle size={18} />
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto underline text-xs">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label text-xs font-black text-primary uppercase tracking-widest">Block Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Championship History" 
              className="w-full bg-white border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs font-black text-primary uppercase tracking-widest">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter section description..." 
              rows={3}
              className="w-full bg-white border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs font-black text-primary uppercase tracking-widest">Content Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              >
                <option>Text & Image</option>
                <option>Video Player</option>
                <option>Stats Grid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs font-black text-primary uppercase tracking-widest">Display Logic</label>
              <div className="flex items-center gap-3 bg-white border border-surface-container-high rounded-lg px-4 py-2.5">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Visible</span>
                <button 
                  onClick={() => setIsVisible(!isVisible)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isVisible ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isVisible ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs font-black text-primary uppercase tracking-widest">Section Asset</label>
            <div 
              onClick={randomizeImage}
              className="border-2 border-dashed border-surface-container-high rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group"
            >
              <div className="p-3 bg-white rounded-full shadow-sm text-on-surface-variant group-hover:scale-110 transition-transform">
                <ImageIcon size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-primary">Click to randomize preview image</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Current: {assetUrl.split('/').pop()?.split('?')[0]}</p>
              </div>
            </div>
          </div>

          <motion.button 
            onClick={handleCreateBlock}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-primary editorial-gradient text-white py-4 rounded-lg font-black font-label uppercase text-sm shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Generating...' : 'Generate Content Block'}
          </motion.button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-label text-xs font-black text-primary uppercase tracking-widest">Real-time Preview</h3>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-surface-container-high p-8 flex flex-col gap-6 sticky top-24">
          <div className="space-y-4">
            <span className="font-label text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <Layout size={12} />
              {type}
            </span>
            <h3 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none font-headline">
              {title || "Section Title"}
            </h3>
          </div>
          
          <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">
            {description || "Your section description will appear here. This is a real-time preview of how the content will look on the live website."}
          </p>

          <div className="relative aspect-video bg-surface-container-low rounded-xl overflow-hidden group">
            <img 
              src={assetUrl} 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {type === 'Video Player' && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          {type === 'Stats Grid' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high">
                <p className="text-xl font-black text-primary font-headline">98%</p>
                <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Metric</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high">
                <p className="text-xl font-black text-primary font-headline">12k</p>
                <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Metric</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-surface-container-high">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500' : 'bg-surface-container-high'}`}></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {isVisible ? 'Live on Site' : 'Draft Mode'}
                </span>
              </div>
              <div className="h-6 w-20 bg-primary/10 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
