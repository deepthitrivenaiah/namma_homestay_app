import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  MapPin, 
  Utensils, 
  Image as ImageIcon, 
  LogOut, 
  User as UserIcon, 
  Eye, 
  Edit, 
  Trash2,
  ChevronLeft,
  Loader2,
  Camera,
  Coffee,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, handleFirestoreError, OperationType } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomeStay, MenuItem, Host } from './types';

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const base = "px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95";
  const variants: any = {
    primary: "bg-primary-500 text-white hover:brightness-110 shadow-md",
    secondary: "bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50",
    accent: "bg-accent-500 text-white hover:brightness-110 shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-muted-500 hover:bg-primary-100 font-bold"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-[32px] p-8 shadow-sm border border-muted-100 ${className}`}>
    {children}
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-primary-50 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="w-20 h-20 bg-primary-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary-500/20 rotate-6">
          <Home className="text-white w-10 h-10" />
        </div>
        <h1 className="text-5xl font-bold font-display mb-6 text-primary-700 tracking-tight">Namma HomeStay</h1>
        <p className="text-xl text-muted-500 mb-12 leading-relaxed font-medium">
          Empowering rural hosts to share authentic hospitality and local flavors.
        </p>
        
        {user ? (
          <Button onClick={() => navigate('/dashboard')} className="w-full py-5 text-xl">
            Go to Dashboard <Plus size={24} />
          </Button>
        ) : (
          <Button onClick={handleLogin} variant="accent" className="w-full py-5 text-xl">
            Start Your Journey <Plus size={24} />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user, hostProfile } = useAuth();
  const [listings, setListings] = useState<HomeStay[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'homestays'), where('hostId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HomeStay));
        setListings(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'homestays');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-8 pb-32">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-500 rounded-[28px] flex items-center justify-center text-white text-3xl shadow-xl shadow-primary-500/10">
            🏠
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-primary-700">Namma HomeStay</h1>
            <p className="text-muted-500 font-medium">Manage your home with ease</p>
          </div>
        </div>
        <Link to="/profile" className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full shadow-sm border border-muted-100 hover:bg-primary-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden border-2 border-white shadow-sm font-display">
            {user?.photoURL ? <img src={user.photoURL} alt="p" /> : (hostProfile?.name?.[0] || user?.displayName?.[0] || 'M')}
          </div>
          <span className="font-bold text-primary-700">Namaskara, {hostProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0]}</span>
        </Link>
      </header>

      <div className="grid grid-cols-12 gap-8 auto-rows-auto">
        {/* Main Listing View (Large Bento Card) */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {listings.length > 0 ? (
            listings.slice(0, 1).map(listing => (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={listing.id}>
                <Card className="h-full flex flex-col justify-between min-h-[480px]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="inline-block px-4 py-1 bg-primary-100 text-primary-500 text-sm font-bold rounded-full mb-4 uppercase tracking-wider">Active Listing</span>
                      <h2 className="text-4xl font-bold font-display text-primary-700 mb-2">{listing.title}</h2>
                      <p className="text-lg text-muted-500 flex items-center gap-2 font-medium">
                        <MapPin size={20} /> {listing.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-accent-500 font-display">₹{listing.pricePerNight}</p>
                      <p className="text-xs text-muted-500 font-bold uppercase tracking-widest font-sans">per night</p>
                    </div>
                  </div>
                  
                  <div className="w-full grow bg-primary-50 rounded-2xl border-2 border-dashed border-muted-100 flex flex-col items-center justify-center text-muted-500 mb-8 overflow-hidden group">
                    {listing.roomPhotos?.[0] ? (
                      <img src={listing.roomPhotos[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Main" />
                    ) : (
                      <>
                        <span className="text-5xl mb-2">📸</span>
                        <p className="font-bold">No Photos Uploaded</p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => navigate(`/edit/${listing.id}`)} className="flex-1">Edit Listing Details</Button>
                    <Button onClick={() => navigate(`/listing/${listing.id}`)} variant="secondary" className="flex-1">View Live Page</Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="h-full flex flex-col items-center justify-center min-h-[480px] bg-primary-100/30 border-dashed border-2 border-primary-200">
               <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm shadow-primary-500/5">
                <Home size={32} className="text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold font-display text-primary-700 mb-2">No listings yet</h3>
              <p className="text-muted-500 mb-8 max-w-xs text-center">Start your journey by adding your first home-stay listing.</p>
              <Button onClick={() => navigate('/add')} variant="accent">Create Your First Listing</Button>
            </Card>
          )}

          {/* Secondary Listings Row */}
          {listings.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {listings.slice(1).map(listing => (
                 <Card key={listing.id} className="p-6">
                    <div className="h-32 bg-primary-100 rounded-2xl mb-4 overflow-hidden">
                       {listing.roomPhotos?.[0] && <img src={listing.roomPhotos[0]} className="w-full h-full object-cover" alt="r"/>}
                    </div>
                    <h3 className="font-bold font-display text-lg text-primary-700">{listing.title}</h3>
                    <p className="text-accent-500 font-bold mb-4 font-display">₹{listing.pricePerNight}<span className="text-xs text-muted-500 font-sans">/night</span></p>
                    <Button onClick={() => navigate(`/listing/${listing.id}`)} variant="ghost" className="w-full py-2">Manage <ChevronLeft className="rotate-180" size={16}/></Button>
                 </Card>
              ))}
            </div>
          )}
        </div>

        {/* Side Containers (Bento Column 2) */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Status Card */}
          <Card className="bg-primary-500 text-white min-h-[220px] flex flex-col justify-between border-0 shadow-xl shadow-primary-500/20">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold opacity-90 font-display">Active Bookings</h3>
              <span className="text-2xl">📅</span>
            </div>
            <div className="flex items-end gap-3 my-4">
              <span className="text-7xl font-bold font-display leading-none">00</span>
              <span className="text-xl mb-2 opacity-80 underline font-medium">New Proposals</span>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-sm font-medium opacity-80">Registration status: <span className="font-bold opacity-100">Ready for Guests</span></p>
            </div>
          </Card>

          {/* Quick Info / Food Menu Card */}
          <Card className="bg-[#FEFAE0] border-[#E9EDC9] min-h-[200px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary-600 font-display">Today's Local Menu</h3>
                <p className="text-sm text-primary-500 opacity-70 italic font-medium">Authentic Flavors</p>
              </div>
              <span className="text-3xl">🍲</span>
            </div>
            <div className="grow space-y-2">
               <div className="flex items-center gap-3 font-bold text-primary-700">
                  <div className="w-2 h-2 rounded-full bg-accent-500"></div> Akki Rotti with Chutney
               </div>
               <div className="flex items-center gap-3 font-bold text-primary-700">
                  <div className="w-2 h-2 rounded-full bg-accent-500"></div> Bamboo Shoot Curry
               </div>
            </div>
            <Button variant="ghost" className="w-full mt-4 bg-white/50 border border-muted-100">Update Menu</Button>
          </Card>

          {/* Quick Actions and Stats */}
          <div className="grid grid-cols-2 gap-4">
             <motion.div 
               whileHover={{ scale: 1.02 }} 
               onClick={() => navigate('/add')}
               className="bg-accent-500 rounded-[32px] p-6 text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-lg shadow-accent-500/20 hover:brightness-110 aspect-square"
             >
                <div className="text-4xl mb-3">➕</div>
                <h3 className="text-lg font-bold font-display leading-tight">Add New<br/>Listing</h3>
             </motion.div>

             <Card className="flex flex-col justify-between p-6 aspect-square">
                <h3 className="text-xs font-black text-muted-500 uppercase tracking-widest">Total Earnings</h3>
                <div>
                   <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-bold font-display text-primary-700">₹0</span>
                      <span className="text-primary-500 font-bold text-xs bg-primary-100 px-3 py-1 rounded-full">+0%</span>
                   </div>
                   <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-500 w-0 h-full"></div>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm z-50">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      )}
    </div>
  );
};

const ListingForm = ({ mode = 'add' }: { mode: 'add' | 'edit' }) => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<HomeStay>>({
    title: '',
    description: '',
    pricePerNight: 0,
    location: '',
    roomPhotos: [],
    surroundingPhotos: [],
    foodMenu: []
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchListing = async () => {
        const docRef = doc(db, 'homestays', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      };
      fetchListing();
    }
  }, [id, mode]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'roomPhotos' | 'surroundingPhotos') => {
    if (!e.target.files) return;
    setLoading(true);
    const files = Array.from(e.target.files) as File[];
    try {
      const urls = await Promise.all(
        files.map(async (file: File) => {
          const storageRef = ref(storage, `listings/${user?.uid}/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), ...urls]
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      foodMenu: [...(prev.foodMenu || []), { itemName: '', description: '' }]
    }));
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...(formData.foodMenu || [])];
    newMenu[index] = { ...newMenu[index], [field]: value };
    setFormData(prev => ({ ...prev, foodMenu: newMenu }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        hostId: user.uid,
        updatedAt: serverTimestamp()
      };

      if (mode === 'add') {
        await addDoc(collection(db, 'homestays'), {
          ...finalData,
          createdAt: serverTimestamp()
        });
      } else if (id) {
        await updateDoc(doc(db, 'homestays', id), finalData);
      }
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, mode === 'add' ? OperationType.CREATE : OperationType.UPDATE, 'homestays');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-primary-200">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold font-display text-primary-700">
          {mode === 'add' ? 'New Home-Stay' : 'Edit Listing'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-600">Home-Stay Title</label>
              <input 
                required
                className="w-full bg-primary-50 border border-primary-100 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. Malnad Green Peaks HomeStay"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-600">Description</label>
              <textarea 
                className="w-full bg-primary-50 border border-primary-100 rounded-xl p-3 h-32 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Tell guests about your space and surroundings..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-primary-600">Price per Night (₹)</label>
                <input 
                  type="number"
                  required
                  className="w-full bg-primary-50 border border-primary-100 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.pricePerNight}
                  onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-primary-600">Location</label>
                <input 
                  required
                  className="w-full bg-primary-50 border border-primary-100 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Shimoga, Karnataka"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Camera size={18} className="text-primary-500" /> Photos
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-primary-500 font-bold mb-2">Room Photos</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.roomPhotos?.map((url, i) => (
                  <img key={i} src={url} className="w-20 h-20 rounded-xl object-cover" alt="room" />
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-primary-200 flex items-center justify-center cursor-pointer hover:bg-primary-50">
                  <Plus size={20} className="text-primary-300" />
                  <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, 'roomPhotos')} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-primary-500 font-bold mb-2">Surroundings</label>
              <div className="flex flex-wrap gap-2">
                {formData.surroundingPhotos?.map((url, i) => (
                  <img key={i} src={url} className="w-20 h-20 rounded-xl object-cover" alt="surrounding" />
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-primary-200 flex items-center justify-center cursor-pointer hover:bg-primary-50">
                  <Plus size={20} className="text-primary-300" />
                  <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, 'surroundingPhotos')} />
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Utensils size={18} className="text-primary-500" /> Daily Food Menu
            </h3>
            <Button variant="ghost" onClick={addMenuItem} className="text-sm py-1">
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {formData.foodMenu?.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  className="flex-1 bg-primary-50 border border-primary-100 rounded-xl p-2 text-sm outline-none"
                  placeholder="Item name (e.g. Akki Rotti)"
                  value={item.itemName}
                  onChange={e => updateMenuItem(i, 'itemName', e.target.value)}
                />
                <input 
                  className="flex-[2] bg-primary-50 border border-primary-100 rounded-xl p-2 text-sm outline-none"
                  placeholder="Short info..."
                  value={item.description}
                  onChange={e => updateMenuItem(i, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <span>{mode === 'add' ? 'Publish Listing' : 'Save Changes'}</span>}
        </Button>
        
        {mode === 'edit' && (
          <Button 
            variant="danger" 
            className="w-full py-3 opacity-70 hover:opacity-100" 
            onClick={async () => {
              if (window.confirm('Delete this listing permanently?')) {
                await deleteDoc(doc(db, 'homestays', id!));
                navigate('/dashboard');
              }
            }}
          >
            <Trash2 size={18} /> Delete Listing
          </Button>
        )}
      </form>
    </div>
  );
};

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<HomeStay | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'homestays', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as HomeStay);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="relative h-64 md:h-96">
        <img src={listing.roomPhotos?.[0]} className="w-full h-full object-cover" alt="" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur rounded-2xl shadow-lg"
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="p-6 -mt-10 relative bg-primary-50 rounded-t-[40px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-700 mb-2">{listing.title}</h1>
            <p className="text-primary-600/70 flex items-center gap-1">
              <MapPin size={18} /> {listing.location}
            </p>
          </div>
          <div className="bg-primary-500 text-white px-5 py-2 rounded-2xl text-xl font-bold shadow-lg shadow-primary-200">
            ₹{listing.pricePerNight}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h3 className="font-bold text-xl mb-3 font-display">About Local Region</h3>
            <p className="text-primary-600/80 leading-relaxed italic">{listing.description || "A beautiful serene place away from the city hustle."}</p>
          </section>

          <section>
            <h3 className="font-bold text-xl mb-4 font-display flex items-center gap-2">
              <Coffee size={20} className="text-accent-500" /> Traditional Food
            </h3>
            <Card>
              <div className="space-y-4">
                {listing.foodMenu?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-primary-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-primary-700">{item.itemName}</h4>
                      <p className="text-sm text-primary-600/60">{item.description}</p>
                    </div>
                  </div>
                )) || <p className="text-primary-400">No menu items added.</p>}
              </div>
            </Card>
          </section>

          <section>
            <h3 className="font-bold text-xl mb-4 font-display">Surrounding Beauty</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.surroundingPhotos?.map((url, i) => (
                <img key={i} src={url} className="h-32 w-full object-cover rounded-2xl shadow-sm" alt="view" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, hostProfile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: hostProfile?.name || user?.displayName || '',
    phoneNumber: hostProfile?.phoneNumber || '',
    location: hostProfile?.location || ''
  });
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'hosts', user.uid), formData);
      await refreshProfile();
      setEditing(false);
    } catch {
      // If doc doesn't exist, create it
      await updateDoc(doc(db, 'hosts', user.uid), formData).catch(async () => {
        await addDoc(collection(db, 'hosts'), { ...formData, uid: user.uid, email: user.email, createdAt: new Date().toISOString() });
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-12">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-primary-200 rounded-full mx-auto mb-4 overflow-hidden relative">
          <img src={user?.photoURL || ''} alt="" />
        </div>
        <h2 className="text-2xl font-bold font-display">{hostProfile?.name || user?.displayName}</h2>
        <p className="text-primary-500 font-medium">{user?.email}</p>
      </div>

      <Card className="space-y-6">
        <div>
          <label className="text-xs font-bold text-primary-400 uppercase">Phone Number</label>
          <input 
            disabled={!editing}
            className="w-full bg-transparent font-medium text-lg outline-none disabled:text-primary-700"
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="+91 00000 00000"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-primary-400 uppercase">Region / Base Location</label>
          <input 
            disabled={!editing}
            className="w-full bg-transparent font-medium text-lg outline-none disabled:text-primary-700"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="e.g. Chikmagalur"
          />
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        {editing ? (
          <Button onClick={handleSave} className="w-full py-4">Save Profile</Button>
        ) : (
          <Button onClick={() => setEditing(true)} variant="secondary" className="w-full py-4">Edit Profile</Button>
        )}
        <Button onClick={() => { signOut(auth); navigate('/'); }} variant="danger" className="w-full gap-2 py-4">
          <LogOut size={20} /> Logout
        </Button>
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary-50 font-sans text-primary-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><ListingForm mode="add" /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><ListingForm mode="edit" /></ProtectedRoute>} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Persistent Tab Bar */}
          <AuthTab />
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
};

const AuthTab = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-2xl px-10 py-5 rounded-[40px] shadow-2xl border border-muted-100 flex gap-12 items-center z-50">
      <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary-500 group">
        <Home size={28} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
      </Link>
      <Link to="/add" className="flex flex-col items-center gap-1 text-muted-500 hover:text-primary-500 group">
        <Plus size={28} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tighter">Add</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center gap-1 text-muted-500 hover:text-primary-500 group">
        <UserIcon size={28} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
      </Link>
    </div>
  );
};
