export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'host' | 'guest';
}

export interface VerificationChecklist {
  cleanliness: boolean;
  privacy: boolean;
  localExperience: boolean;
  essentialAmenities: boolean;
}

export interface SecretSpot {
  name: string;
  description: string;
  type: 'waterfall' | 'viewpoint' | 'trail' | 'temple' | 'other';
}

export interface Homestay {
  id: string;
  hostId: string;
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
  photos: string[];
  verificationChecklist: VerificationChecklist;
  secretSpots: SecretSpot[];
}

export interface DailyMenu {
  id: string;
  homestayId: string;
  date: string;
  dinnerSpecial: string;
  price: number;
  photos: string[];
}

export interface Inquiry {
  id: string;
  homestayId: string;
  guestName: string;
  guestMessage: string;
  guestPhone: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: any;
}
