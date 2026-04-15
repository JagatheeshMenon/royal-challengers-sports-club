import { Trophy } from 'lucide-react';

export default function About() {
  return (
    <section className="py-32 bg-surface text-center" id="about">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-12 flex justify-center">
          <Trophy className="text-secondary-container" size={64} />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tight leading-tight mb-12 font-headline">
          Rooted in Tradition, Fueled by Excellence, Bound by the Royal Spirit.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12 text-left pt-12 border-t border-surface-container-low">
          <div>
            <h4 className="font-label font-black text-secondary-container bg-primary inline-block px-2 py-0.5 rounded uppercase text-[10px] mb-4">Our Values</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">Integrity and sportsmanship define every player who dons the royal blue.</p>
          </div>
          <div>
            <h4 className="font-label font-black text-secondary-container bg-primary inline-block px-2 py-0.5 rounded uppercase text-[10px] mb-4">Our Mission</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">To cultivate talent and build a community through the transformative power of sport.</p>
          </div>
          <div>
            <h4 className="font-label font-black text-secondary-container bg-primary inline-block px-2 py-0.5 rounded uppercase text-[10px] mb-4">Our Legacy</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">Since 1984, we've been the heartbeat of regional sports development.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
