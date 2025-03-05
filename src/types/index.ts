export interface FoodEntry {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_item: string;
  initial_weight: number;
  remaining_weight?: number;
  created_at: string;
}

export interface Booking {
  id: string;
  food_entry_id: string;
  person_name: string;
  contact_number: string;
  trust_name: string;
  booking_date: string;
  created_at: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const FOOD_ITEMS = [
  'Rice',
  'Curry',
  'Bread',
  'Vegetables',
  'Fruits',
  'Soup',
  'Pasta',
  'Salad',
  'Dessert',
  'Beverages'
] as const;

export type FoodItem = typeof FOOD_ITEMS[number];