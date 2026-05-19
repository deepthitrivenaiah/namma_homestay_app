export interface Host {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  createdAt: string;
}

export interface MenuItem {
  itemName: string;
  description: string;
}

export interface HomeStay {
  id: string;
  hostId: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  roomPhotos: string[];
  surroundingPhotos: string[];
  foodMenu: MenuItem[];
  createdAt: string;
  updatedAt?: string;
}
