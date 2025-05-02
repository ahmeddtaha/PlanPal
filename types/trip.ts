export interface TripPreferences {
  privacyType: 'private' | 'public';
  tripType?: 'solo' | 'friends' | 'couple' | 'family';
  startDate: Date;
  endDate: Date;
  culturePreference?: 'museums' | 'art' | 'temples' | 'crafts' | 'history' | 'architecture';
  naturePreference?: 'hiking' | 'beaches' | 'spa' | 'yoga' | 'wildlife' | 'mountains';
  foodPreference?: 'local' | 'market' | 'fine-dining' | 'street-food' | 'cooking-class' | 'wine-tasting';
  entertainmentPreference?: 'theme-parks' | 'concerts' | 'shopping' | 'nightlife' | 'sports' | 'festivals';
  budgetLevel: 'basic' | 'balanced' | 'luxury';
}

export const PREFERENCE_OPTIONS = {
  culture: [
    { value: 'museums', label: 'Museums', emoji: '🏛️' },
    { value: 'art', label: 'Art Galleries', emoji: '🎨' },
    { value: 'temples', label: 'Temples & Heritage', emoji: '⛩️' },
    { value: 'crafts', label: 'Local Crafts', emoji: '🎭' },
    { value: 'history', label: 'Historical Sites', emoji: '📜' },
    { value: 'architecture', label: 'Architecture', emoji: '🏗️' },
  ],
  nature: [
    { value: 'hiking', label: 'Hiking & Trails', emoji: '🏃‍♂️' },
    { value: 'beaches', label: 'Beaches & Coast', emoji: '🏖️' },
    { value: 'spa', label: 'Spa & Wellness', emoji: '💆‍♀️' },
    { value: 'yoga', label: 'Yoga & Meditation', emoji: '🧘‍♀️' },
    { value: 'wildlife', label: 'Wildlife & Safari', emoji: '🦁' },
    { value: 'mountains', label: 'Mountain Views', emoji: '⛰️' },
  ],
  food: [
    { value: 'local', label: 'Local Cuisine', emoji: '🍜' },
    { value: 'market', label: 'Food Markets', emoji: '🏪' },
    { value: 'fine-dining', label: 'Fine Dining', emoji: '🍽️' },
    { value: 'street-food', label: 'Street Food', emoji: '🍢' },
    { value: 'cooking-class', label: 'Cooking Classes', emoji: '👨‍🍳' },
    { value: 'wine-tasting', label: 'Wine Tasting', emoji: '🍷' },
  ],
  entertainment: [
    { value: 'theme-parks', label: 'Theme Parks', emoji: '🎡' },
    { value: 'concerts', label: 'Concerts & Shows', emoji: '🎭' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🌃' },
    { value: 'sports', label: 'Sports Events', emoji: '⚽' },
    { value: 'festivals', label: 'Local Festivals', emoji: '🎉' },
  ],
} as const;

export const BUDGET_LEVELS = [
  {
    value: 'basic',
    label: 'Basic',
    symbol: '$',
    description: 'Budget-conscious, essential experiences',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    symbol: '$$',
    description: 'Mid-range comfort and experiences',
  },
  {
    value: 'luxury',
    label: 'Luxury',
    symbol: '$$$',
    description: 'Premium accommodations and experiences',
  },
] as const;