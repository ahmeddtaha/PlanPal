export interface ChecklistItem {
  id: string;
  name: string;
  checked: boolean;
}

export type ChecklistCategory = 'Documents' | 'Clothing' | 'Toiletries' | 'Electronics';

export interface DefaultItems {
  [key: string]: ChecklistItem[];
}

export const defaultChecklistItems: DefaultItems = {
  Documents: [
    { id: '1', name: 'Passport', checked: false },
    { id: '2', name: 'Visa', checked: false },
    { id: '3', name: 'Travel Insurance', checked: false },
    { id: '4', name: 'Boarding Pass', checked: false },
    { id: '5', name: 'Hotel Reservations', checked: false },
  ],
  Clothing: [
    { id: '1', name: 'T-Shirts', checked: false },
    { id: '2', name: 'Pants/Shorts', checked: false },
    { id: '3', name: 'Underwear', checked: false },
    { id: '4', name: 'Socks', checked: false },
    { id: '5', name: 'Comfortable Shoes', checked: false },
  ],
  Toiletries: [
    { id: '1', name: 'Toothbrush & Toothpaste', checked: false },
    { id: '2', name: 'Shampoo & Conditioner', checked: false },
    { id: '3', name: 'Deodorant', checked: false },
    { id: '4', name: 'Sunscreen', checked: false },
    { id: '5', name: 'First Aid Kit', checked: false },
  ],
  Electronics: [
    { id: '1', name: 'Phone Charger', checked: false },
    { id: '2', name: 'Power Bank', checked: false },
    { id: '3', name: 'Camera', checked: false },
    { id: '4', name: 'Laptop', checked: false },
    { id: '5', name: 'Universal Adapter', checked: false },
  ],
}; 