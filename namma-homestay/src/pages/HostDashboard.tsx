import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getHostHomestay, 
  saveHomestay, 
  getMenus, 
  updateTodayMenu, 
  getInquiries, 
  updateInquiryStatus 
} from '../services/dataService';
import { Homestay, DailyMenu, Inquiry } from '../types';
import { Card, Button, Input, Textarea } from '../components/UI';
import { 
  LayoutDashboard, 
  Utensils, 
  MessageSquare, 
  Settings, 
  Camera, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HostDashboard() {
  const { user } = useAuth();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'profile' | 'inquiries'>('overview');
  
  // Menu form state
  const [menuForm, setMenuForm] = useState({ dinnerSpecial: '', price: '' });
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  
  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!user) return;
    
    getHostHomestay(user.uid).then(data => {
      setHomestay(data);
      setLoading(false);
      
      if (data) {
        getMenus(data.id, setMenus);
        getInquiries(data.id, setInquiries);
      }
    });
  }, [user]);

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homestay) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    await updateTodayMenu(homestay.id, {
      homestayId: homestay.id,
      date: today,
      dinnerSpecial: menuForm.dinnerSpecial,
      price: Number(menuForm.price),
      photos: []
    });
    setMenuForm({ dinnerSpecial: '', price: '' });
  };

  const handleCreateHomestay = async () => {
    if (!user) return;
    const newId = await saveHomestay({
      hostId: user.uid,
      name: 'My New HomeStay',
      description: 'A cozy stay near the coast.',
      address: 'Coastal Village',
      pricePerNight: 1000,
      photos: [],
      verificationChecklist: {
        cleanliness: true,
        privacy: false,
        localExperience: true,
        essentialAmenities: false
      },
      secretSpots: []
    });
    const fresh = await getHostHomestay(user.uid);
    setHomestay(fresh);
  };

  if (loading) return <div className="h-screen bg-brand-cream animate-pulse" />;

  if (!homestay) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-8 px-6">
        <div className="w-24 h-24 bg-brand-olive/10 rounded-full flex items-center justify-center mx-auto">
          <Settings className="text-brand-olive w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Welcome, Host!</h2>
          <p className="text-brand-earth/60 font-serif italic">You haven't registered your homestay yet. It only takes a minute to get started.</p>
        </div>
        <Button onClick={handleCreateHomestay} size="lg" className="w-full">Create Your Profile</Button>
      </div>
    );
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayMenu = menus.find(m => m.date === todayStr);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 space-y-4">
        <div className="p-6 bg-brand-olive text-white rounded-[32px] space-y-2 mb-8">
          <h3 className="font-bold text-lg truncate">{homestay.name}</h3>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Manager Portal</p>
        </div>

        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
          { id: 'menu', icon: Utensils, label: 'Daily Menu' },
          { id: 'inquiries', icon: MessageSquare, label: 'Inquiries', count: inquiries.filter(i => i.status === 'new').length },
          { id: 'profile', icon: Settings, label: 'Edit Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-brand-olive text-white shadow-lg shadow-brand-olive/20' : 'hover:bg-brand-olive/5 text-brand-earth/60'}`}
          >
            <div className="flex items-center gap-3 font-semibold">
              <tab.icon className="w-5 h-5" /> {tab.label}
            </div>
            {tab.count ? <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">{tab.count}</span> : <ChevronRight className="w-4 h-4 opacity-40" />}
          </button>
        ))}

        <div className="pt-8 mt-8 border-t border-brand-earth/5">
          <Link to={`/homestay/${homestay.id}`} target="_blank">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Public Page
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-none bg-brand-olive/10 space-y-2">
                  <TrendingUp className="text-brand-olive w-6 h-6" />
                  <div className="text-3xl font-black">{inquiries.length}</div>
                  <div className="text-xs uppercase font-bold text-brand-olive/60 tracking-wider">Total Visitors Contacted</div>
                </Card>
                <Card className="p-8 border-none bg-brand-earth text-brand-cream space-y-2">
                  <Utensils className="text-brand-olive w-6 h-6" />
                  <div className="truncate text-xl font-bold">{todayMenu ? todayMenu.dinnerSpecial : 'Not Set Today'}</div>
                  <div className="text-xs uppercase font-bold text-brand-cream/40 tracking-wider">Tonight's Dinner</div>
                </Card>
                <Card className="p-8 border-none bg-white space-y-2 border-brand-earth/5 border">
                  <Clock className="text-brand-olive w-6 h-6" />
                  <div className="text-3xl font-black">₹{homestay.pricePerNight}</div>
                  <div className="text-xs uppercase font-bold text-brand-earth/40 tracking-wider">Current Daily Rate</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold">Quick Menu Update</h3>
                  <p className="text-sm text-brand-earth/60 italic font-serif">What's special for dinner tonight? Update it in seconds.</p>
                  <form onSubmit={handleUpdateMenu} className="space-y-4">
                    <Input 
                      placeholder="e.g., Fish Curry & Brown Rice" 
                      value={menuForm.dinnerSpecial}
                      onChange={(e: any) => setMenuForm({...menuForm, dinnerSpecial: e.target.value})}
                    />
                    <div className="flex gap-4">
                      <Input 
                        placeholder="Price (₹)" 
                        className="flex-grow"
                        value={menuForm.price}
                        onChange={(e: any) => setMenuForm({...menuForm, price: e.target.value})}
                      />
                      <Button type="submit">Update Menu</Button>
                    </div>
                  </form>
                </Card>

                <Card className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold">Recent Inquiries</h3>
                  <div className="space-y-4">
                    {inquiries.slice(0, 3).map(inq => (
                      <div key={inq.id} className="flex items-center justify-between p-4 bg-brand-cream rounded-2xl">
                        <div className="truncate pr-4">
                          <h4 className="font-bold text-sm">{inq.guestName}</h4>
                          <p className="text-[10px] text-brand-earth/60 truncate">{inq.guestMessage}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${inq.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                    {inquiries.length === 0 && <p className="text-center py-8 text-brand-earth/40 italic font-serif">No messages yet.</p>}
                  </div>
                  <Button onClick={() => setActiveTab('inquiries')} variant="ghost" className="w-full text-xs">View All Messages</Button>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black italic">Daily Menu History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 space-y-6 border-2 border-brand-olive/20 shadow-xl lg:col-span-2">
                   <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Plus className="text-brand-olive" /> Update Today's Menu
                   </h3>
                   <form onSubmit={handleUpdateMenu} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <Input 
                          label="Today's Special Dinner" 
                          placeholder="What are you cooking?" 
                          value={menuForm.dinnerSpecial}
                          onChange={(e: any) => setMenuForm({...menuForm, dinnerSpecial: e.target.value})}
                        />
                        <Input 
                          label="Dinner Price (₹)" 
                          placeholder="Price per person" 
                          value={menuForm.price}
                          onChange={(e: any) => setMenuForm({...menuForm, price: e.target.value})}
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <Button type="submit" size="lg" className="w-full h-[52px]">Save Menu</Button>
                      </div>
                   </form>
                </Card>

                {menus.map(menu => (
                  <Card key={menu.id} className="p-6 flex items-center justify-between border-brand-earth/5 border">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-earth/40 uppercase tracking-widest">{menu.date === todayStr ? 'Today' : menu.date}</span>
                      <h4 className="font-bold text-lg">{menu.dinnerSpecial}</h4>
                      <p className="text-brand-olive text-sm font-bold">₹{menu.price}</p>
                    </div>
                    <div className="p-3 bg-brand-olive/5 rounded-2xl">
                      <Utensils className="text-brand-olive w-5 h-5 opacity-40" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'inquiries' && (
            <motion.div 
              key="inquiries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black italic">Visitor Messages</h2>
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <Card key={inq.id} className={`p-8 border-l-8 ${inq.status === 'new' ? 'border-l-brand-olive' : 'border-l-brand-earth/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{inq.guestName}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-brand-earth/40 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
                          <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {inq.guestPhone}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {inq.status === 'new' && (
                          <Button 
                            onClick={() => updateInquiryStatus(homestay.id, inq.id, 'replied')}
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Called
                          </Button>
                        )}
                        <Button 
                          onClick={() => updateInquiryStatus(homestay.id, inq.id, 'closed')}
                          size="sm" 
                          variant="secondary"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                    <div className="bg-brand-cream p-6 rounded-2xl font-serif italic text-brand-earth/80">
                      "{inq.guestMessage}"
                    </div>
                  </Card>
                ))}
                {inquiries.length === 0 && (
                  <div className="py-24 text-center space-y-4 opacity-40">
                    <MessageSquare className="w-12 h-12 mx-auto" />
                    <p className="font-serif italic">Your inquiry box is currently empty.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
             <motion.div 
               key="profile"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
             >
               <h2 className="text-4xl font-black italic">Home Profile</h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 space-y-6">
                    <h3 className="text-xl font-bold italic">Verification Checklist</h3>
                    <p className="text-xs text-brand-earth/40 uppercase font-bold tracking-widest">Students: Ensure these are set for high quality</p>
                    <div className="space-y-4">
                      {Object.keys(homestay.verificationChecklist).map((key) => (
                        <button
                          key={key}
                          onClick={async () => {
                             const newList = { ...homestay.verificationChecklist, [key]: !((homestay.verificationChecklist as any)[key]) };
                             await saveHomestay({ verificationChecklist: newList }, homestay.id);
                             setHomestay({ ...homestay, verificationChecklist: newList });
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${ (homestay.verificationChecklist as any)[key] ? 'bg-brand-olive/10 border-brand-olive text-brand-olive' : 'bg-white border-brand-earth/10 text-brand-earth/40 opacity-60' }`}
                        >
                          <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          { (homestay.verificationChecklist as any)[key] ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" /> }
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-8 space-y-6">
                    <h3 className="text-xl font-bold italic">Homestay Details</h3>
                    <div className="space-y-4">
                      <Input 
                        label="Homestay Name" 
                        value={homestay.name}
                        onChange={(e: any) => setHomestay({...homestay, name: e.target.value})}
                        onBlur={async () => saveHomestay({name: homestay.name}, homestay.id)}
                      />
                      <Input 
                        label="Location / Area" 
                        value={homestay.address}
                        onChange={(e: any) => setHomestay({...homestay, address: e.target.value})}
                        onBlur={async () => saveHomestay({address: homestay.address}, homestay.id)}
                      />
                      <Textarea 
                        label="Experience Description" 
                        value={homestay.description}
                        onChange={(e: any) => setHomestay({...homestay, description: e.target.value})}
                        onBlur={async () => saveHomestay({description: homestay.description}, homestay.id)}
                      />
                    </div>
                  </Card>

                  <Card className="p-8 space-y-6 lg:col-span-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold italic text-brand-olive">Nearby Secret Spots</h3>
                      <Button size="sm" onClick={async () => {
                        const newSpot = { name: 'New Spot', description: 'Briefly describe this spot', type: 'other' as any };
                        const newList = [...(homestay.secretSpots || []), newSpot];
                        setHomestay({...homestay, secretSpots: newList});
                        await saveHomestay({secretSpots: newList}, homestay.id);
                      }}>Add Spot</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {homestay.secretSpots?.map((spot, i) => (
                        <div key={i} className="p-4 bg-brand-cream rounded-2xl border border-brand-earth/5 space-y-3">
                          <Input 
                            value={spot.name} 
                            placeholder="Spot Name" 
                            onChange={(e: any) => {
                              const newList = [...homestay.secretSpots];
                              newList[i].name = e.target.value;
                              setHomestay({...homestay, secretSpots: newList});
                            }}
                            onBlur={() => saveHomestay({secretSpots: homestay.secretSpots}, homestay.id)}
                          />
                          <Textarea 
                            rows={2} 
                            value={spot.description} 
                            placeholder="Why is it special?" 
                            onChange={(e: any) => {
                              const newList = [...homestay.secretSpots];
                              newList[i].description = e.target.value;
                              setHomestay({...homestay, secretSpots: newList});
                            }}
                            onBlur={() => saveHomestay({secretSpots: homestay.secretSpots}, homestay.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
