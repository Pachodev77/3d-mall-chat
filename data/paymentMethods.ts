export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  minAmount: number;
  processingTime: string;
  accountInfo?: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'https://images.pexels.com/photos/825262/pexels-photo-825262.jpeg',
    minAmount: 5,
    processingTime: '24-48 hours',
    accountInfo: 'alex.johnson@example.com',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: 'https://images.pexels.com/photos/259132/pexels-photo-259132.jpeg',
    minAmount: 10,
    processingTime: '3-5 business days',
    accountInfo: '••••••••5678',
  },
  {
    id: 'crypto',
    name: 'Bitcoin',
    icon: 'https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg',
    minAmount: 20,
    processingTime: '1-24 hours',
  },
  {
    id: 'giftcard',
    name: 'Amazon Gift Card',
    icon: 'https://images.pexels.com/photos/6830761/pexels-photo-6830761.jpeg',
    minAmount: 5,
    processingTime: 'Instant',
  },
];