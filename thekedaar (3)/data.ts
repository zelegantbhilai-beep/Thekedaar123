
import { Category, Worker, Review } from './types';

export const CATEGORIES: Category[] = [
  { id: 'plumber', name: 'Plumber', icon: '🔧', description: 'Water & Drainage' },
  { id: 'electrician', name: 'Electrician', icon: '⚡', description: 'Wiring & Repairs' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', description: 'Furniture & Wood' },
  { id: 'painter', name: 'Painter', icon: '🎨', description: 'Interior & Exterior' },
  { id: 'mason', name: 'Mason', icon: '🧱', description: 'Construction Work' },
  { id: 'cleaner', name: 'Cleaner', icon: '🧹', description: 'Home Cleaning' },
  { id: 'ac_repair', name: 'AC Repair', icon: '❄️', description: 'Cooling & Service' },
  { id: 'pest_control', name: 'Pest Control', icon: '🐜', description: 'Insects & Rodents' },
];

// Empty workers list as requested
export const WORKERS: Record<string, Worker[]> = {};

// Empty reviews list as requested
export const REVIEWS: Record<number, Review[]> = {};
