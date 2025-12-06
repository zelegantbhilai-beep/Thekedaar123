
import React, { useMemo, useState } from 'react';
import { Search, MapPin, ArrowLeft, Star, Clock, Award, TrendingUp, SlidersHorizontal, Shield, MessageCircle, Calendar, Check, Briefcase, Image as ImageIcon, Send, ThumbsUp } from 'lucide-react';
import { Category, Worker, Booking, Feedback, Review } from '../types';

/* ---------------- HOME VIEW ---------------- */
interface HomeViewProps {
  onCategorySelect: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  location: string;
  setLocation: (loc: string) => void;
  workers: Worker[];
  categories: Category[];
  onSendFeedback: (feedback: Feedback) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onCategorySelect, searchTerm, setSearchTerm, location, setLocation, workers, categories, onSendFeedback }) => {
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackName, setFeedbackName] = useState('');

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim() || !feedbackName.trim()) return;
    
    onSendFeedback({
      id: Date.now().toString(),
      userName: feedbackName,
      message: feedbackMsg,
      date: new Date().toLocaleDateString(),
      type: 'Suggestion'
    });
    setFeedbackMsg('');
    setFeedbackName('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">What help do you need today?</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search 'Plumber' or 'Cleaning'..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
              <select 
                className="w-full md:w-auto pl-12 pr-10 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none font-medium text-gray-700 dark:text-white shadow-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>Bhilai, Chhattisgarh</option>
                <option>Supela, Bhilai</option>
                <option>Nehru Nagar, Bhilai</option>
                <option>Durg, Chhattisgarh</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Popular Services</h2>
          <span className="text-orange-600 dark:text-orange-400 text-sm font-medium cursor-pointer hover:underline">View All</span>
        </div>
        
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900 group text-left relative overflow-hidden"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-bl-full group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{cat.icon}</div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No services found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold">{workers.filter(w => w.verified).length}+</div>
              <div className="text-sm opacity-90 font-medium">Verified Pros</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-none">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-sm opacity-90 font-medium">Happy Customers</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm opacity-90 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Support Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">We Value Your Feedback</h2>
            <p className="text-gray-400 mb-6">Help us improve Thekedaar. Share your suggestions, complaints, or appreciation directly with our admin team.</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Direct to Admin</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Quick Response</span>
            </div>
          </div>
          <form onSubmit={submitFeedback} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4">
             <div>
               <input 
                 type="text" 
                 placeholder="Your Name" 
                 required
                 className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                 value={feedbackName}
                 onChange={(e) => setFeedbackName(e.target.value)}
               />
             </div>
             <div>
               <textarea 
                 placeholder="Write your feedback here..." 
                 rows={3}
                 required
                 className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                 value={feedbackMsg}
                 onChange={(e) => setFeedbackMsg(e.target.value)}
               ></textarea>
             </div>
             <button type="submit" className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
               <Send className="w-4 h-4" /> Send Feedback
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ---------------- CATEGORY VIEW ---------------- */
interface CategoryViewProps {
  category: string;
  workers: Worker[];
  onBack: () => void;
  onWorkerSelect: (worker: Worker) => void;
  categories: Category[];
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, workers, onBack, onWorkerSelect, categories }) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({ minRating: 0, verified: false });

  const categoryDetails = categories.find(c => c.id === category);

  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      if (worker.rating < filters.minRating) return false;
      if (filters.verified && !worker.verified) return false;
      return true;
    });
  }, [workers, filters]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-[72px] z-30 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              {categoryDetails?.icon} {categoryDetails?.name}s
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{filteredWorkers.length} professionals available</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium border ${
            showFilters ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {showFilters && <span className="ml-1 text-xs bg-white text-orange-600 px-1.5 py-0.5 rounded-full">2</span>}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
              <select 
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-xl w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input 
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">Verified Pros Only</span>
                <Shield className="w-4 h-4 text-blue-500 ml-auto" />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker, idx) => (
            <div 
              key={worker.id}
              onClick={() => onWorkerSelect(worker)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex gap-5">
                <div className="text-6xl bg-gray-50 dark:bg-gray-700 rounded-2xl w-24 h-24 flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors overflow-hidden">
                  {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                    <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
                  ) : (
                    worker.photo
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{worker.name}</h3>
                        {worker.verified && <Shield className="w-5 h-5 text-blue-500 fill-blue-50" />}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {worker.area}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-2 md:mt-0">
                      <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg border border-green-100 dark:border-green-800">
                        <Star className="w-4 h-4 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
                        <span className="font-bold text-green-700 dark:text-green-300">{worker.rating}</span>
                        <span className="text-xs text-green-600 dark:text-green-400">({worker.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{worker.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                     <div className="flex flex-wrap gap-2">
                      {worker.additionalServices.slice(0, 2).map((service, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                          {service}
                        </span>
                      ))}
                      {worker.additionalServices.length > 2 && (
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                          +{worker.additionalServices.length - 2} more
                        </span>
                      )}
                    </div>
                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {worker.responseTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No professionals found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- PROFILE VIEW ---------------- */
interface ProfileViewProps {
  worker: Worker;
  onBack: () => void;
  onBook: () => void;
  allReviews: Review[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ worker, onBack, onBook, allReviews }) => {
  const reviews = allReviews.filter(r => r.workerId === worker.id);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow text-gray-700 dark:text-gray-200 font-medium transition-all w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500"></div>
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-3xl shadow-lg flex items-center justify-center text-7xl border-4 border-white dark:border-gray-800 overflow-hidden">
              {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
              ) : (
                worker.photo
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{worker.name}</h1>
                {worker.verified && (
                  <Shield className="w-6 h-6 text-blue-500 fill-blue-50" />
                )}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{worker.profession}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {worker.area}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Responds in {worker.responseTime}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
               <button 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border-2 border-green-500 text-green-600 dark:text-green-400 font-bold py-3 px-6 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                onClick={() => window.open(`https://wa.me/919977926749?text=Hi, I am interested in booking ${worker.name} for ${worker.profession} services.`, '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>
              <button 
                onClick={onBook}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg shadow-gray-200 dark:shadow-none transition-all hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col */}
        <div className="md:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About {worker.name.split(' ')[0]}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{worker.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {worker.additionalServices.map((service, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          {worker.portfolio && worker.portfolio.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                Recent Work
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {worker.portfolio.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-5xl border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                  >
                     {item.startsWith('http') || item.startsWith('data:') ? (
                        <img src={item} alt={`Portfolio ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     ) : (
                        <>
                          <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{item}</span>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Customer Reviews</h3>
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="font-bold text-orange-700 dark:text-orange-400">{worker.rating}</span>
                <span className="text-orange-600/70 dark:text-orange-400/70 text-sm">({worker.totalReviews})</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-200 text-xs">
                        {review.customerName.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{review.customerName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200 dark:text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet.</p>}
            </div>
          </div>
        </div>

        {/* Right Col (Stats) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Performance</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Award className="w-5 h-5"/></div>
                   <span className="font-medium text-gray-600 dark:text-gray-300">Experience</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{worker.experience}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
                   <span className="font-medium text-gray-600 dark:text-gray-300">Jobs Done</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{worker.completedJobs}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><Clock className="w-5 h-5"/></div>
                   <span className="font-medium text-gray-600 dark:text-gray-300">Response</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{worker.responseTime}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- BOOKINGS VIEW ---------------- */
interface BookingsViewProps {
  bookings: Booking[];
  onGoHome: () => void;
  onLeaveReview: (bookingId: string, workerId: number, rating: number, comment: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ bookings, onGoHome, onLeaveReview }) => {
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (booking: Booking) => {
    onLeaveReview(booking.id, booking.workerId, rating, comment);
    setReviewingBookingId(null);
    setRating(5);
    setComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 text-orange-200 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
             <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't booked any services yet. Start exploring!</p>
          <button
            onClick={onGoHome}
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 hover:shadow-lg transition-all"
          >
            Find Professionals
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">{booking.service}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{booking.workerName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><Clock className="w-4 h-4"/> {booking.date} • {booking.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end w-full md:w-auto justify-between border-t border-gray-100 dark:border-gray-700 md:border-0 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {booking.status}
                </div>
                {/* Review Feature */}
                {booking.status === 'CONFIRMED' && reviewingBookingId !== booking.id && (
                  <button 
                    onClick={() => setReviewingBookingId(booking.id)}
                    className="text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center gap-1"
                  >
                    <Star className="w-4 h-4" /> Review Service
                  </button>
                )}
              </div>

              {/* Inline Review Form */}
              {reviewingBookingId === booking.id && (
                <div className="w-full md:w-auto md:ml-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 animate-in fade-in zoom-in-95">
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-2">Rate your experience</h4>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} type="button">
                        <Star className={`w-6 h-6 ${rating >= star ? 'text-orange-400 fill-orange-400' : 'text-gray-300 dark:text-gray-500'}`} />
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe your experience..." 
                    className="w-full p-2 mb-3 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setReviewingBookingId(null)}
                      className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSubmitReview(booking)}
                      className="flex-1 py-1.5 text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 rounded-lg shadow-sm"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ChatsView: React.FC = () => {
    return (
       <div className="space-y-6 animate-in fade-in duration-500">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Chats</h2>
         <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No active conversations yet.</p>
         </div>
       </div>
    )
}
