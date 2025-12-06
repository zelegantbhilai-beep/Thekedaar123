
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Calendar, User, LogOut, Lock, Briefcase, Shield, Search, ArrowRight, Eye, EyeOff, CheckCircle, MessageCircle } from 'lucide-react';
import { Worker, Booking, UserRole, Consumer, Category, Review, Feedback } from './types';
import { WORKERS, CATEGORIES as INITIAL_CATEGORIES, REVIEWS as INITIAL_REVIEWS_DATA } from './data';
import { HomeView, CategoryView, ProfileView, BookingsView, ChatsView } from './components/Views';
import { BookingModal } from './components/BookingModal';
import { AIChat } from './components/AIChat';
import { AdminPortal } from './components/AdminPortal';
import { WorkerPortal } from './components/WorkerPortal';

type ViewState = 'home' | 'category' | 'profile' | 'bookings' | 'chats';

const STORAGE_KEYS = {
  WORKERS: 'thekedaar_workers',
  SESSION: 'thekedaar_session',
  CONSUMERS: 'thekedaar_consumers',
  BOOKINGS: 'thekedaar_bookings',
  CATEGORIES: 'thekedaar_categories',
  REVIEWS: 'thekedaar_reviews',
  FEEDBACKS: 'thekedaar_feedbacks'
};

// Mock Initial Consumers - Cleared as requested
const INITIAL_CONSUMERS: Consumer[] = [];

export default function App() {
  // Global App State
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('CONSUMER');
  const [currentLoggedInWorker, setCurrentLoggedInWorker] = useState<Worker | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  
  // Initialize workers from localStorage or default data
  const initialWorkers = Object.values(WORKERS).flat();
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const savedWorkers = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return savedWorkers ? JSON.parse(savedWorkers) : initialWorkers;
    } catch (e) {
      console.error("Failed to load workers from storage", e);
      return initialWorkers;
    }
  });

  // Initialize consumers
  const [consumers, setConsumers] = useState<Consumer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSUMERS);
      return saved ? JSON.parse(saved) : INITIAL_CONSUMERS;
    } catch (e) {
      return INITIAL_CONSUMERS;
    }
  });

  // Initialize bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Initialize categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  });

  // Initialize Reviews (Flatten the Record object to array for easier management)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
      
      // Flatten initial data
      const flattened: Review[] = [];
      Object.entries(INITIAL_REVIEWS_DATA).forEach(([workerId, workerReviews]) => {
        workerReviews.forEach(r => {
          flattened.push({ ...r, workerId: Number(workerId) });
        });
      });
      return flattened;
    } catch (e) {
      return [];
    }
  });

  // Initialize Feedbacks
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist state changes
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CONSUMERS, JSON.stringify(consumers)); }, [consumers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks)); }, [feedbacks]);

  // Theme Handling
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Check for active session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (session) {
        const { role, workerId } = JSON.parse(session);
        if (role) {
          setCurrentUserRole(role);
          setShowWelcomeScreen(false);
          
          if (role === 'WORKER' && workerId) {
            const worker = workers.find(w => w.id === workerId);
            if (worker) {
              setCurrentLoggedInWorker(worker);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    }
  }, []); 

  const [view, setView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  
  // UI State
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTarget, setLoginTarget] = useState<'ADMIN' | 'WORKER' | 'CONSUMER'>('ADMIN');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regProfession, setRegProfession] = useState('Plumber');
  const [regPass, setRegPass] = useState('');
  const [regEmail, setRegEmail] = useState(''); // For consumer
  const [regPhoto, setRegPhoto] = useState<string>('👷'); // Default emoji
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  
  // Home View State
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Bhilai, Chhattisgarh');

  // --- Handlers ---

  const saveSession = (role: UserRole, workerId?: number) => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ role, workerId }));
  };

  const handleUpdateWorker = (updatedWorker: Worker) => {
    const updatedList = workers.map(w => w.id === updatedWorker.id ? updatedWorker : w);
    setWorkers(updatedList);
    setCurrentLoggedInWorker(updatedWorker);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Admin Login
    if (loginTarget === 'ADMIN') {
      if (loginId === 'Thekedaar' && loginPass === 'Abc@#123') {
        setCurrentUserRole('ADMIN');
        saveSession('ADMIN');
        setShowLoginModal(false);
        setShowWelcomeScreen(false);
        clearLogin();
      } else {
        setLoginError('Invalid Admin credentials.');
      }
      return;
    }

    // Consumer Login
    if (loginTarget === 'CONSUMER') {
      const consumer = consumers.find(c => c.email.toLowerCase() === loginId.toLowerCase());
      if (consumer) {
        if (consumer.status === 'Blocked') {
          setLoginError('Account Blocked. Contact Support.');
          return;
        }
        setCurrentUserRole('CONSUMER');
        saveSession('CONSUMER');
        setShowLoginModal(false);
        setShowWelcomeScreen(false);
        clearLogin();
      } else {
        setLoginError('Email not found. Please register.');
      }
      return;
    }

    // Worker Login
    if (loginTarget === 'WORKER') {
      const workerMatch = workers.find(w => 
        w.id.toString() === loginId || 
        w.phone.replace(/\s/g, '') === loginId.replace(/\s/g, '')
      );
      
      // Backdoor for demo if 'worker' is typed
      if (loginId.toLowerCase() === 'worker') {
         // Since we cleared mock data, handle case where no worker exists
         if (workers.length > 0) {
            setCurrentUserRole('WORKER');
            setCurrentLoggedInWorker(workers[0]);
            saveSession('WORKER', workers[0].id);
            setShowLoginModal(false);
            setShowWelcomeScreen(false);
            clearLogin();
            return;
         } else {
            setLoginError('No registered workers. Please register.');
            return;
         }
      }

      if (workerMatch) {
        const isPasswordCorrect = workerMatch.password ? workerMatch.password === loginPass : loginPass === '123';
        if (isPasswordCorrect) {
          setCurrentUserRole('WORKER');
          setCurrentLoggedInWorker(workerMatch);
          saveSession('WORKER', workerMatch.id);
          setShowLoginModal(false);
          setShowWelcomeScreen(false);
          clearLogin();
        } else {
          setLoginError('Invalid Password.');
        }
      } else {
        setLoginError('Worker ID or Phone number not found.');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginTarget === 'CONSUMER') {
      const newConsumer: Consumer = {
        id: Date.now().toString(),
        name: regName,
        email: regEmail,
        phone: regPhone,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setConsumers([...consumers, newConsumer]);
      setCurrentUserRole('CONSUMER');
      saveSession('CONSUMER');
      setShowLoginModal(false);
      setShowWelcomeScreen(false);
      clearLogin();
      return;
    }

    if (loginTarget === 'WORKER') {
      const newId = Math.floor(100000 + Math.random() * 900000); // 6 digit ID
      const newWorker: Worker = {
        id: newId,
        name: regName,
        profession: regProfession,
        phone: regPhone,
        password: regPass,
        photo: regPhoto,
        experience: '0 years',
        area: 'Bhilai',
        rating: 5.0,
        totalReviews: 0,
        additionalServices: [],
        description: 'New service partner joined Thekedaar.',
        hourlyRate: 300,
        verified: false,
        responseTime: '1 hour',
        completedJobs: 0,
        portfolio: []
      };
      setWorkers([...workers, newWorker]);
      setGeneratedId(newId.toString());
      setLoginId(newId.toString());
      setLoginPass(regPass);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogin = () => {
    setLoginId('');
    setLoginPass('');
    setLoginError('');
    setIsRegistering(false);
    setGeneratedId(null);
    setRegName('');
    setRegPhone('');
    setRegPass('');
    setRegEmail('');
    setRegPhoto('👷');
  };

  const handleLogout = () => {
    setCurrentUserRole('CONSUMER');
    setCurrentLoggedInWorker(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setView('home');
    setShowWelcomeScreen(true);
    setMenuOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('category');
  };

  const handleWorkerSelect = (worker: Worker) => {
    setSelectedWorker(worker);
    setView('profile');
  };

  const handleBookingConfirm = (date: string, time: string) => {
    if (!selectedWorker) return;
    const newBooking: Booking = {
      id: Date.now().toString(),
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      date,
      time,
      service: selectedWorker.profession,
      status: 'CONFIRMED',
      amount: selectedWorker.hourlyRate
    };
    setBookings([newBooking, ...bookings]);
    setShowBookingModal(false);
    setView('bookings');
  };

  const handleSendFeedback = (feedback: Feedback) => {
    setFeedbacks([feedback, ...feedbacks]);
    alert('Thank you for your feedback!');
  };

  const handleLeaveReview = (bookingId: string, workerId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      customerName: 'Guest User', // Ideally from current consumer session
      rating,
      comment,
      date: new Date().toLocaleDateString(),
      verified: true,
      workerId
    };
    
    setReviews([newReview, ...reviews]);
    
    // Update worker stats
    const updatedWorkers = workers.map(w => {
      if (w.id === workerId) {
        const newTotal = w.totalReviews + 1;
        const newRating = ((w.rating * w.totalReviews) + rating) / newTotal;
        return { ...w, rating: parseFloat(newRating.toFixed(1)), totalReviews: newTotal };
      }
      return w;
    });
    setWorkers(updatedWorkers);
    alert('Review submitted successfully!');
  };

  const getCategoryWorkers = () => {
     if (!selectedCategory) return [];
     const category = categories.find(c => c.id === selectedCategory);
     if (!category) return [];
     return workers.filter(w => w.profession.toLowerCase() === category.name.toLowerCase() || 
                                w.profession.toLowerCase().includes(category.name.toLowerCase()));
  };

  // --- Render Views ---

  if (currentUserRole === 'ADMIN') {
    return (
      <AdminPortal 
        workers={workers} 
        setWorkers={setWorkers} 
        bookings={bookings} 
        setBookings={setBookings}
        consumers={consumers}
        setConsumers={setConsumers}
        categories={categories}
        setCategories={setCategories}
        reviews={reviews}
        setReviews={setReviews}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
        onLogout={handleLogout} 
      />
    );
  }

  if (currentUserRole === 'WORKER') {
    return currentLoggedInWorker 
      ? <WorkerPortal worker={currentLoggedInWorker} onLogout={handleLogout} onUpdateWorker={handleUpdateWorker} />
      : <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white"><button onClick={handleLogout}>Error loading profile. Logout</button></div>;
  }

  if (showWelcomeScreen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        
         {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="absolute top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-orange-500 to-red-600 rounded-b-[3rem] z-0"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 w-full max-w-5xl">
          <div className="text-center text-white mb-12">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-orange-600 font-bold text-4xl shadow-2xl mx-auto mb-6">
              T
            </div>
            <h1 className="text-4xl font-bold mb-2">Welcome to Thekedaar</h1>
            <p className="text-lg opacity-90">Premium Home Services & Solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Option 1: Consumer */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left group border border-transparent hover:border-orange-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Book a Service</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 min-h-[48px]">Find trusted professionals for your home needs instantly.</p>
              <div className="space-y-3">
                <button onClick={() => { setShowWelcomeScreen(false); setCurrentUserRole('CONSUMER'); }} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  Enter as Guest <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <button onClick={() => { setLoginTarget('CONSUMER'); setShowLoginModal(true); }} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 font-medium">
                    Existing User? Login
                  </button>
                </div>
              </div>
            </div>

            {/* Option 2: Worker */}
            <button onClick={() => { setLoginTarget('WORKER'); setShowLoginModal(true); }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left group border border-transparent hover:border-blue-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Service Partner</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 min-h-[48px]">Login to manage your jobs, schedule, and earnings.</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:gap-2 transition-all">
                Partner Login <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            {/* Option 3: Admin */}
            <button onClick={() => { setLoginTarget('ADMIN'); setShowLoginModal(true); }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left group border border-transparent hover:border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Admin Portal</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 min-h-[48px]">System administration, reports, and user management.</p>
              <div className="flex items-center text-gray-700 dark:text-gray-300 font-bold group-hover:gap-2 transition-all">
                Admin Access <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
          
          <p className="text-center text-white/60 mt-12 text-sm">© 2024 Thekedaar Services. All rights reserved.</p>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={() => { setShowLoginModal(false); clearLogin(); }} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {loginTarget === 'ADMIN' ? 'Admin Access' : 
                     loginTarget === 'CONSUMER' ? (isRegistering ? 'Create Account' : 'User Login') :
                     (isRegistering ? 'Partner Registration' : 'Partner Login')}
                  </h2>
                </div>
                
                {loginTarget !== 'ADMIN' && !generatedId && (
                  <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                    <button onClick={() => { setIsRegistering(false); setGeneratedId(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isRegistering ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Login</button>
                    <button onClick={() => setIsRegistering(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isRegistering ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>{loginTarget === 'CONSUMER' ? 'Sign Up' : 'Register New'}</button>
                  </div>
                )}

                {generatedId ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Registration Successful!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Your System Generated ID is:</p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl font-mono text-2xl font-bold text-gray-800 dark:text-white tracking-wider mb-6 border border-gray-200 dark:border-gray-600 border-dashed">{generatedId}</div>
                    <button onClick={() => { setIsRegistering(false); setGeneratedId(null); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">Proceed to Login</button>
                  </div>
                ) : (
                  <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    {isRegistering ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                          <input type="text" required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={regName} onChange={e => setRegName(e.target.value)} />
                        </div>
                        {loginTarget === 'CONSUMER' && (
                           <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone Number</label>
                          <input type="tel" required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                        </div>
                        {loginTarget === 'WORKER' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Profession</label>
                              <select className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={regProfession} onChange={e => setRegProfession(e.target.value)}>
                                 {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Profile Photo (Optional)</label>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white text-sm"
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Create Password</label>
                          <input type="password" required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={regPass} onChange={e => setRegPass(e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{loginTarget === 'ADMIN' ? 'Admin ID' : loginTarget === 'CONSUMER' ? 'Email Address' : 'Worker ID or Phone'}</label>
                          <input type="text" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={loginId} onChange={e => setLoginId(e.target.value)} autoFocus />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                          <input type="password" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                          {loginTarget === 'WORKER' && workers.length > 0 && <p className="text-xs text-gray-400 mt-1">Default for demo accounts: 123</p>}
                        </div>
                      </>
                    )}
                    {loginError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{loginError}</div>
                    )}
                    <button type="submit" className={`w-full font-bold py-3.5 rounded-xl text-white shadow-lg transition-transform active:scale-95 ${loginTarget === 'ADMIN' ? 'bg-gray-900 hover:bg-black dark:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600'}`}>{isRegistering ? 'Register Now' : 'Login'}</button>
                  </form>
                )}
            </div>
          </div>
        )}
        <AIChat />
      </div>
    );
  }

  // --- Consumer View (Main App) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 border-b-2 border-orange-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setSelectedCategory(null); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">T</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">THEKEDAAR</h1>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Find. Book. Done.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">{theme === 'light' ? '🌙' : '☀️'}</button>
            {currentUserRole === 'CONSUMER' ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><LogOut className="w-4 h-4" /> Exit</button>
            ) : (
               <button onClick={() => { setLoginTarget('CONSUMER'); setShowLoginModal(true); }} className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"><User className="w-4 h-4" /> Login</button>
            )}
            <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </header>
      
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold dark:text-white">Menu</h2>
                <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2">
                <button onClick={() => { setView('home'); setMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${view === 'home' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}><Home className="w-5 h-5" /><span className="font-medium">Home</span></button>
                <button onClick={() => { setView('bookings'); setMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${view === 'bookings' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}><Calendar className="w-5 h-5" /><span className="font-medium">My Bookings</span></button>
                <button onClick={() => { setView('chats'); setMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${view === 'chats' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}><MessageCircle className="w-5 h-5" /><span className="font-medium">Chats</span></button>
                <div className="border-t border-gray-100 dark:border-gray-800 my-4 pt-4">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-colors"><LogOut className="w-5 h-5" /><span className="font-medium">Logout / Exit</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'home' && (
          <HomeView 
            onCategorySelect={handleCategorySelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            location={location}
            setLocation={setLocation}
            workers={workers}
            categories={categories}
            onSendFeedback={handleSendFeedback}
          />
        )}
        {view === 'category' && selectedCategory && (
          <CategoryView 
            category={selectedCategory}
            workers={getCategoryWorkers()}
            onBack={() => setView('home')}
            onWorkerSelect={handleWorkerSelect}
            categories={categories}
          />
        )}
        {view === 'profile' && selectedWorker && (
          <ProfileView 
            worker={selectedWorker}
            onBack={() => setView('category')}
            onBook={() => setShowBookingModal(true)}
            allReviews={reviews}
          />
        )}
        {view === 'bookings' && (
          <BookingsView 
            bookings={bookings} 
            onGoHome={() => setView('home')} 
            onLeaveReview={handleLeaveReview} 
          />
        )}
        {view === 'chats' && <ChatsView />}
      </main>

      {showBookingModal && selectedWorker && (
        <BookingModal worker={selectedWorker} onClose={() => setShowBookingModal(false)} onConfirm={handleBookingConfirm} />
      )}
      <AIChat />
    </div>
  );
}
