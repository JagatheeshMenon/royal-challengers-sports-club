import { motion } from 'motion/react';

export default function UpcomingMatch() {
  return (
    <section className="py-24 bg-primary text-white" id="upcoming">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 font-headline">Next Fixture</h2>
            <p className="text-primary-fixed-dim leading-relaxed">Join us for the most anticipated clash of the season as we defend our home turf.</p>
          </div>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between border border-white/10"
          >
            <div className="text-center md:text-left space-y-2">
              <p className="font-label text-secondary-container font-black uppercase tracking-widest text-xs">Opponent</p>
              <h3 className="text-3xl font-black uppercase font-headline">Spartans United</h3>
            </div>
            
            <div className="h-px w-20 md:h-20 md:w-px bg-white/20 my-8 md:my-0"></div>
            
            <div className="text-center space-y-2">
              <p className="font-label text-secondary-container font-black uppercase tracking-widest text-xs">Date & Time</p>
              <p className="text-2xl font-bold font-headline">Oct 24 • 14:30 PM</p>
            </div>
            
            <div className="h-px w-20 md:h-20 md:w-px bg-white/20 my-8 md:my-0"></div>
            
            <div className="text-center md:text-right space-y-2">
              <p className="font-label text-secondary-container font-black uppercase tracking-widest text-xs">Venue</p>
              <p className="text-2xl font-bold font-headline">Royal Grand Arena</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
