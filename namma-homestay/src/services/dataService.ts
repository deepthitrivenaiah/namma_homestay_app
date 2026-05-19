import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Homestay, DailyMenu, Inquiry } from '../types';

// Homestays
export const getHomestays = async (): Promise<Homestay[]> => {
  const q = query(collection(db, 'homestays'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Homestay));
};

export const getHostHomestay = async (hostId: string): Promise<Homestay | null> => {
  const q = query(collection(db, 'homestays'), where('hostId', '==', hostId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Homestay;
};

export const saveHomestay = async (homestay: Partial<Homestay>, id?: string) => {
  if (id) {
    await updateDoc(doc(db, 'homestays', id), homestay);
    return id;
  } else {
    const docRef = await addDoc(collection(db, 'homestays'), homestay);
    return docRef.id;
  }
};

// Menus
export const getMenus = (homestayId: string, callback: (menus: DailyMenu[]) => void) => {
  const q = query(collection(db, 'homestays', homestayId, 'menus'), orderBy('date', 'desc'), limit(7));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyMenu)));
  });
};

export const updateTodayMenu = async (homestayId: string, menu: Partial<DailyMenu>) => {
  const q = query(collection(db, 'homestays', homestayId, 'menus'), where('date', '==', menu.date));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await updateDoc(doc(db, 'homestays', homestayId, 'menus', snapshot.docs[0].id), menu);
  } else {
    await addDoc(collection(db, 'homestays', homestayId, 'menus'), menu);
  }
};

// Inquiries
export const sendInquiry = async (homestayId: string, inquiry: Partial<Inquiry>) => {
  await addDoc(collection(db, 'homestays', homestayId, 'inquiries'), {
    ...inquiry,
    status: 'new',
    createdAt: serverTimestamp()
  });
};

export const getInquiries = (homestayId: string, callback: (inquiries: Inquiry[]) => void) => {
  const q = query(collection(db, 'homestays', homestayId, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
  });
};

export const updateInquiryStatus = async (homestayId: string, inquiryId: string, status: string) => {
  await updateDoc(doc(db, 'homestays', homestayId, 'inquiries', inquiryId), { status });
};
