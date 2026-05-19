import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Homestay, DailyMenu, Inquiry } from '../types';
import { Card, Button, Input, Textarea } from '../components/UI';
import { 
  getMenus, 
  sendInquiry 
} from '../services/dataService';
import { 
  CheckCircle2, 
  MapPin, 
  Utensils, 
  Compass, 
  PhoneCall, 
  Check,
  Send,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomestayDetails() {
  const { id } = useParams<{ id: string }>();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryData, setInquiryData] = useState({ guestName: '', guestMessage: '', guestPhone: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      const docSnap = await getDoc(doc(db, 'homestays', id));
      if (docSnap.exists()) {
        setHomestay({ id: docSnap.id, ...docSnap.data() } as Homestay);
      }
      setLoading(false);
    };

    fetchDetails();
    const unsubscribe = getMenus(id, setMenus);
    return () => unsubscribe();
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await sendInquiry(id, inquiryData);
    setSubmitted(true);
  };

  if (loading) return <div className="h-screen bg-brand-cream animate-pulse" />;
  if (!homestay) return <div className="p-12 text-center">Homestay not found</div>;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayMenu = menus.find(m => m.date === todayStr);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <Link to="/explore" className="inline-flex items-center gap-2 text-brand-olive font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Info & Photos */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black">{homestay.name}</h1>
            <div className="flex items-center gap-2 text-brand-olive font-bold uppercase tracking-wider text-sm">
              <MapPin className="w-4 h-4" /> {homestay.address}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {homestay.photos?.slice(0, 4).map((p, i) => (
              <img key={i} src={p} alt={homestay.name} className={`w-full aspect-square object-cover rounded-[32px] ${i === 0 ? 'col-span-2 aspect-video' : ''}`} />
            ))}
            {!homestay.photos?.length && (
              <div className="col-span-full h-80 bg-brand-olive/5 rounded-[32px] flex items-center justify-center font-serif italic text-brand-olive/20">
                No environment photos uploaded yet
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-bold italic">The Experience</h3>
            <p className="text-lg text-brand-earth/70 font-serif leading-relaxed italic">{homestay.description}</p>
          </div>

          <div className="bg-brand-olive/5 p-8 rounded-[40px] space-y-6 border border-brand-olive/10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-brand-olive" /> Verification Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(homestay.verificationChecklist || {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${val ? 'bg-brand-olive text-white' : 'bg-brand-earth/10 text-brand-earth/20'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={`text-sm font-medium capitalize ${val ? 'text-brand-earth' : 'text-brand-earth/40 line-through'}`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Daily Menu & Inquiry */}
        <div className="space-y-8">
          {/* Today's Menu */}
          <Card className="p-8 border-none bg-brand-earth text-brand-cream relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-olive/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
            <div className="relative space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-olive">Today's Kitchen</span>
                  <h3 className="text-3xl font-bold">Today's Special</h3>
                </div>
                <Utensils className="text-brand-olive w-8 h-8" />
              </div>

              {todayMenu ? (
                <div className="space-y-4">
                  <div className="text-4xl font-serif italic text-brand-cream/90">{todayMenu.dinnerSpecial}</div>
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1 border border-brand-cream/20 rounded-full text-xs font-bold uppercase tracking-wider">Natural Ingredients</span>
                    <span className="text-2xl font-bold text-brand-olive">₹{todayMenu.price}</span>
                  </div>
                </div>
              ) : (
                <p className="text-brand-cream/40 font-serif italic italic">The host hasn't updated today's menu yet. Expect a fresh surprise!</p>
              )}
            </div>
          </Card>

          {/* Secret Spots */}
          {homestay.secretSpots?.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Compass className="text-brand-olive" /> Local Secrets
              </h3>
              <div className="space-y-4">
                {homestay.secretSpots.map((spot, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white rounded-3xl border border-brand-earth/5">
                    <div className="w-12 h-12 bg-brand-olive/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="text-brand-olive w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">{spot.name}</h4>
                      <p className="text-xs text-brand-earth/60 font-serif lowercase italic">{spot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Form */}
          <Card className="p-8 space-y-6 overflow-visible">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Planned a visit?</h3>
              <p className="text-sm text-brand-earth/60">Message the host to check availability or ask questions.</p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-olive/10 p-8 rounded-3xl text-center space-y-4 border border-brand-olive/20"
                >
                  <div className="w-16 h-16 bg-brand-olive text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-olive/30">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-olive">Message Sent!</h4>
                  <p className="text-sm text-brand-earth/60 font-serif italic text-balance">The host will check their inquiry box soon. You can also directly call them if they've provided a number.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">Send another message</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  <Input 
                    label="Your Name" 
                    placeholder="Enter your name" 
                    required 
                    value={inquiryData.guestName}
                    onChange={(e: any) => setInquiryData({...inquiryData, guestName: e.target.value})}
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="For host to call you back" 
                    required 
                    value={inquiryData.guestPhone}
                    onChange={(e: any) => setInquiryData({...inquiryData, guestPhone: e.target.value})}
                  />
                  <Textarea 
                    label="Special Message" 
                    placeholder="Ask about dates, dietary needs, or parking..." 
                    required 
                    value={inquiryData.guestMessage}
                    onChange={(e: any) => setInquiryData({...inquiryData, guestMessage: e.target.value})}
                  />
                  <Button type="submit" className="w-full flex items-center justify-center gap-2 py-4">
                    Send Inquiry <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-brand-earth/5 flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-earth/30">Or direct call</span>
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <PhoneCall className="w-4 h-4" /> Call Host
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
