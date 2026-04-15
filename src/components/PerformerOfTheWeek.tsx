import { motion } from 'motion/react';

export default function PerformerOfTheWeek() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="relative flex flex-col md:flex-row items-center gap-16">
          {/* Large Image Overlap */}
          <div className="relative w-full md:w-1/2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container z-0"
            ></motion.div>
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 aspect-[3/4] overflow-hidden rounded-xl shadow-2xl"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUvdSuoDAa0vGLEDtZb7VKULFMtagRQRmzUf6dgKTWkFZEv5JFFqhUQEKbbeCq7jU-Y1EGFimEelDgC5z_Hwi00ZjgL75LFygsfD_oBEGC4bFB3ZgWEliF0lYCbt_jxPVRWUO6BdXKsFsI6thGOu0I_dDkz0gHT5yoJG2K3jgwYdpgIcboaMbqKkkpjQJ4bVaLkiHgE_xthbMiAlR1wx8JJCoVh_9ZTzIPdn010bRq-ruI17Z5Kakz2O-lceAzaLdMJR-5efoGFVV" 
                alt="Arjun Rathore" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-4">
              <span className="w-12 h-px bg-primary"></span>
              <span className="font-label text-sm font-bold tracking-widest text-primary uppercase">Elite Spotlight</span>
            </div>
            <h2 className="text-6xl font-black text-primary uppercase leading-none tracking-tighter font-headline">
              Performer <br/>Of The Week
            </h2>
            
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg border-l-8 border-secondary-container">
              <h3 className="text-3xl font-black text-primary mb-1 font-headline">Arjun Rathore</h3>
              <p className="font-label text-secondary-container bg-primary inline-block px-2 py-0.5 rounded font-bold uppercase tracking-widest text-[10px] mb-6">
                All-Rounder • Royal First XI
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="space-y-1">
                  <p className="font-label text-xs font-bold text-on-surface-variant uppercase">Runs Scored</p>
                  <p className="text-4xl font-black text-primary font-headline">145<span className="text-lg text-secondary-container ml-1">*</span></p>
                </div>
                <div className="space-y-1">
                  <p className="font-label text-xs font-bold text-on-surface-variant uppercase">Wickets Taken</p>
                  <p className="text-4xl font-black text-primary font-headline">4/22</p>
                </div>
              </div>
              
              <p className="text-on-surface-variant leading-relaxed italic border-t border-surface-container pt-6">
                "Arjun delivered a career-best performance under pressure, leading the team to a remarkable comeback victory with both bat and ball. A true embodiment of the Royal spirit."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
