export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rewardPoints: number;
  phone?: string;
  savedAddresses: Address[];
  orderHistoryIds: string[];
}
