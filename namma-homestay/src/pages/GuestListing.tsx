import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHomestays } from '../services/dataService';
import { Homestay } from '../types';
import { Card, Button } from '../components/UI';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuestListing() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomestays().then(data => {
      setHomestays(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-80 bg-brand-olive/5 rounded-[32px] animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tight">Explore coastal <br /><span className="text-brand-olive italic">HomeStays</span></h2>
        <p className="text-brand-earth/60 font-serif italic max-w-lg text-lg">Authentic stays managed by local farming families.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {homestays.map((home, index) => (
          <motion.div
            key={home.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/homestay/${home.id}`}>
              <Card className="group">
                <div className="aspect-[4/3] bg-brand-olive/5 relative">
                  {home.photos?.[0] ? (
                    <img src={home.photos[0]} alt={home.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-olive/20 font-serif italic">No photos yet</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Verified Stay
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-olive uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> {home.address}
                  </div>
                  <h3 className="text-2xl font-bold">{home.name}</h3>
                  <p className="text-sm text-brand-earth/60 line-clamp-2 font-serif">{home.description}</p>
                  <div className="pt-4 flex items-center justify-between border-t border-brand-earth/5">
                    <div className="text-lg font-bold">₹{home.pricePerNight} <span className="text-xs text-brand-earth/40 font-normal">/ day</span></div>
                    <div className="p-3 bg-brand-olive/10 rounded-2xl text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}

        {homestays.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-4">
            <div className="text-6xl">🏡</div>
            <h3 className="text-xl font-bold">No homestays registered yet.</h3>
            <p className="text-brand-earth/40">Be the first to list your home!</p>
          </div>
        )}
      </div>
    </div>
  );
}
