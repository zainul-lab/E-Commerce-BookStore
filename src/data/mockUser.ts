import { User } from '../types/user';

export const INITIAL_USER: User = {
  id: 'usr-901',
  name: 'Sophia Montgomery',
  email: 'sophia.montgomery@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  rewardPoints: 1250, // Worth $12.50 discount
  phone: '+1 (555) 234-5678',
  savedAddresses: [
    {
      id: 'addr-1',
      fullName: 'Sophia Montgomery',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
      isDefault: true,
      type: 'home',
    },
    {
      id: 'addr-2',
      fullName: 'Sophia Montgomery (Office)',
      phone: '+1 (555) 987-6543',
      street: '100 Innovation Way, Suite 800',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
      isDefault: false,
      type: 'work',
    },
  ],
  orderHistoryIds: ['ORD-882194', 'ORD-764312'],
};
