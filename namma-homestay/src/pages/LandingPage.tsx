import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { ArrowRight, Leaf, Utensils, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="px-6 pt-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-olive/10 rounded-full text-brand-olive text-sm font-semibold uppercase tracking-wider">
            <Leaf className="w-4 h-4" />
            Sustainable Coastal Stays
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
            Authentic <br />
            <span className="text-brand-olive italic font-light">Experiences.</span>
          </h1>
          <p className="text-xl text-brand-earth/60 font-serif max-w-md italic">
            Connecting travelers with local micro-entrepreneurs in the coastal rural heartlands.
          </p>
          <div className="flex gap-4">
            <Link to="/explore">
              <Button size="lg" className="flex items-center gap-2">
                Discover Stays <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <div className="aspect-[4/5] rounded-[64px] bg-brand-olive/5 overflow-hidden border-8 border-white shadow-2xl skew-x-2">
            <img 
              src="https://images.unsplash.com/photo-1549110660-8432857418a0?q=80&w=2670&auto=format&fit=crop" 
              alt="Rural coastal life" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 p-8 bg-white rounded-3xl shadow-xl border border-brand-earth/5 space-y-2 max-w-[200px]">
            <Utensils className="text-brand-olive w-8 h-8" />
            <h3 className="font-bold">Today's Special</h3>
            <p className="text-xs text-brand-earth/60 font-serif italic">Fresh Bamboo shoot curry & Akki Rotti</p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-earth text-brand-cream py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-cream/10 rounded-2xl flex items-center justify-center">
              <Heart className="text-brand-olive w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">Support Local Farmers</h3>
            <p className="text-brand-cream/60 leading-relaxed font-light">
              Your stay directly provides a third source of income for farming families, keeping local traditions alive.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-cream/10 rounded-2xl flex items-center justify-center">
              <Leaf className="text-brand-olive w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">Eco-Conscious Travel</h3>
            <p className="text-brand-cream/60 leading-relaxed font-light">
              Promoting low-impact, local-first travel that respects the surrounding farm ecosystems.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-cream/10 rounded-2xl flex items-center justify-center">
              <ArrowRight className="text-brand-olive w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">Digital Empowerment</h3>
            <p className="text-brand-cream/60 leading-relaxed font-light">
              We help non-tech-savvy micro-entrepreneurs manage their digital business with ease.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
