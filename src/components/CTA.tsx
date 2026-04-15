import { motion } from 'motion/react';
import { Share2, Mail, Phone } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 editorial-gradient text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgO_TU4SWoeBQtUqIfLGIXUQL5zPh5JtSxPYP9WuK-bM8w6gzyz8nohRJnxL5lwlj7W-kK7jNk5zCqR1CwJlPFjtddzkBHQQ_Xj4mqBK4_UgZ4Cu8OcUKRuYuRbmHwQ_29e4W9mgb4BhP6nCTra0eN65YIuThDK0uExel7kgfsET4gX-tgfpgZTbKHGIPzW6XLgwQjFe2lcm7vbOSdq2-Qmil4eaBkJ_naS7ciSkviE1XGQnl7e4KFuOnwsh7yOmmniQx8zIz0z7JR" 
          alt="Background" 
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 text-center space-y-12">
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none font-headline"
        >
          Become Part <br/>of the Legacy
        </motion.h2>
        <p className="text-xl text-primary-fixed-dim max-w-2xl mx-auto">Registration for the new season is now open. Join a community of champions.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-lg font-black font-label uppercase text-lg shadow-2xl"
          >
            Join the Club
          </motion.button>
          
          <div className="flex gap-6">
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              href="#" 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 transition-colors"
            >
              <Share2 size={20} />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              href="#" 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 transition-colors"
            >
              <Mail size={20} />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              href="#" 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 transition-colors"
            >
              <Phone size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
