import { motion } from 'motion/react';
import heroImage from '../assets/royalchallenger.jpg';

export default function Hero() {
  return (
    <header className="relative w-full min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Stadium" 
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 py-20 w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase font-headline">
            Royal Challengers <br/>Sports Club
          </h1>
          <p className="text-xl text-primary-fixed-dim max-w-lg font-medium leading-relaxed">
            Royal Challengers Sports club is a new initiative of an old ambition to start a common club where players from all dimensions of the society can come and participate in various sporting events, have a family time together or enjoy your time with your friends. The club is open to all who are open minded and have a mindset to progress together.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#highlights" 
              className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-lg font-black font-label uppercase text-sm hover:shadow-lg transition-all"
            >
              View This Week’s Highlights
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#gallery" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-black font-label uppercase text-sm hover:bg-white/20 transition-all"
            >
              Explore Gallery
            </motion.a>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
