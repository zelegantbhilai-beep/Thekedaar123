
export interface Worker {
  id: number;
  name: string;
  profession: string;
  photo: string;
  phone: string;
  experience: string;
  area: string;
  rating: number;
  totalReviews: number;
  additionalServices: string[];
  description: string;
  hourlyRate: number;
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  portfolio: string[];
  password?: string; // Optional for login
  walletBalance?: number; // For partners
  isOnline?: boolean; // For partners
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  images?: string[];
  workerId?: number; // Added to link review to worker in global list
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Booking {
  id: string;
  workerId: number;
  workerName: string;
  date: string;
  time: string;
  service: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  amount: number;
}

export type UserRole = 'ADMIN' | 'WORKER' | 'CONSUMER';

export interface Consumer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Blocked';
  password?: string;
}

export interface JobRequest {
  id: string;
  customerName: string;
  customerAddress: string;
  serviceType: string;
  date: string;
  time: string;
  amount: number;
  status: 'NEW' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  distance: string;
}

export interface Feedback {
  id: string;
  userName: string;
  message: string;
  date: string;
  type: 'Suggestion' | 'Complaint' | 'Appreciation';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
