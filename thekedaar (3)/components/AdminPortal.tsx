
import React, { useState, useRef } from 'react';
import { 
  Users, Calendar, MessageSquare, DollarSign, 
  Search, Edit2, Trash2, Save, X, LogOut,
  BarChart3, CheckCircle, AlertCircle, Plus, Settings, Phone, Mail, Ban, Briefcase,
  Menu, Download, Bell, Send, LayoutGrid, ThumbsUp, Key, Upload
} from 'lucide-react';
import { Worker, Booking, Consumer, Category, Review, Feedback } from '../types';

interface AdminPortalProps {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  consumers: Consumer[];
  setConsumers: React.Dispatch<React.SetStateAction<Consumer[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  feedbacks: Feedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
  onLogout: () => void;
}

// Mock Data for "All Chats Report" - Cleared as requested
const MOCK_CHAT_LOGS: any[] = [];

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  workers, setWorkers, bookings, setBookings, consumers, setConsumers, categories, setCategories, onLogout,
  reviews, setReviews, feedbacks, setFeedbacks
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'workers' | 'users' | 'chats' | 'settings' | 'services' | 'feedbacks'>('dashboard');
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for adding/editing service/category
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newService, setNewService] = useState({ name: '', icon: '🔧', description: '' });

  // -- HANDLERS --

  const handleDeleteWorker = (id: number) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      setWorkers(workers.filter(w => w.id !== id));
    }
  };

  const handleVerifyWorker = (id: number) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, verified: true } : w));
  };

  const handleSaveWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorker) return;

    if (isAddingNew) {
      setWorkers([...workers, { ...editingWorker, id: Date.now() }]);
    } else {
      setWorkers(workers.map(w => w.id === editingWorker.id ? editingWorker : w));
    }
    setEditingWorker(null);
    setIsAddingNew(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingWorker) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingWorker({ ...editingWorker, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const startEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setIsAddingNew(false);
  };

  const startAdd = () => {
    setEditingWorker({
      id: 0,
      name: '',
      profession: categories[0]?.name || 'Plumber',
      photo: '👷',
      phone: '+91 ',
      experience: '',
      area: '',
      rating: 5.0,
      totalReviews: 0,
      additionalServices: [],
      description: '',
      hourlyRate: 300,
      verified: true,
      responseTime: '1 hour',
      completedJobs: 0,
      portfolio: [],
      password: ''
    });
    setIsAddingNew(true);
  };

  const toggleUserStatus = (id: string) => {
    setConsumers(consumers.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' } : c
    ));
  };

  const handleExportCSV = (type: string) => {
    alert(`Exporting ${type} data to CSV... (Simulation)`);
  };

  const handleBroadcastSend = () => {
    alert(`Message sent to ${consumers.length} users: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewService({
      name: category.name,
      icon: category.icon,
      description: category.description
    });
    setShowAddServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(c => c.id === editingCategory.id ? {
        ...c,
        name: newService.name,
        icon: newService.icon,
        description: newService.description
      } : c));
      setEditingCategory(null);
    } else {
      // Add new category
      const id = newService.name.toLowerCase().replace(/\s+/g, '_');
      const newCategory: Category = {
        id,
        name: newService.name,
        icon: newService.icon,
        description: newService.description
      };
      setCategories([...categories, newCategory]);
    }
    
    setShowAddServiceModal(false);
    setNewService({ name: '', icon: '🔧', description: '' });
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Delete this service category? Existing workers with this profession will remain unchanged.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleDeleteFeedback = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback entry?')) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  // -- RENDERERS --

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">Total Users</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{consumers.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Users className="w-6 h-6"/></div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-700 dark:text-green-400 font-bold">
            <BarChart3 className="w-4 h-4 mr-1" /> +0% from last month
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{bookings.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><DollarSign className="w-6 h-6"/></div>
          </div>
           <div className="mt-4 flex items-center text-sm text-green-700 dark:text-green-400 font-bold">
            <BarChart3 className="w-4 h-4 mr-1" /> +0% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">Active Bookings</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{bookings.filter(b => b.status === 'CONFIRMED').length}</h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><Calendar className="w-6 h-6"/></div>
          </div>
           <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
            Updated recently
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">Pending Approvals</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{workers.filter(w => !w.verified).length}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><AlertCircle className="w-6 h-6"/></div>
          </div>
           <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400 font-bold">
            Requires Action
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg border-b dark:border-gray-700 pb-2">Recent Activity</h3>
          <div className="space-y-4">
             {consumers.slice(0, 3).map((u, i) => (
               <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                 <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">{u.name.charAt(0)}</div>
                 <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">New user registered: {u.name}</p>
                   <p className="text-xs text-gray-600 dark:text-gray-400">{u.joinDate}</p>
                 </div>
               </div>
             ))}
             {consumers.length === 0 && <p className="text-gray-500 italic">No recent activity.</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg border-b dark:border-gray-700 pb-2">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-gray-800 dark:text-gray-200 font-medium">Server Status</span>
              <span className="text-green-700 dark:text-green-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Online</span>
            </div>
            <div className="flex justify-between text-sm items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-gray-800 dark:text-gray-200 font-medium">Database</span>
              <span className="text-green-700 dark:text-green-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Connected</span>
            </div>
            <div className="flex justify-between text-sm items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-gray-800 dark:text-gray-200 font-medium">AI Model API</span>
              <span className="text-green-700 dark:text-green-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkerManagement = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Management</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage professionals, verify accounts, and edit details.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => handleExportCSV('workers')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold shadow-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button 
              onClick={startAdd}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Worker
            </button>
         </div>
       </div>

       {/* Verification Queue Widget */}
       {workers.some(w => !w.verified) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-300">Pending Verifications</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">There are {workers.filter(w => !w.verified).length} workers waiting for approval.</p>
              </div>
            </div>
          </div>
       )}

       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-xs uppercase text-gray-800 dark:text-gray-200 font-extrabold tracking-wider">
                 <th className="p-4">Name</th>
                 <th className="p-4">Profession</th>
                 <th className="p-4">Credentials</th>
                 <th className="p-4">Rating</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
               {workers.map(worker => (
                 <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                   <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="text-3xl bg-gray-100 dark:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                        {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                          <img src={worker.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          worker.photo
                        )}
                      </span> 
                      {worker.name}
                   </td>
                   <td className="p-4">
                     <span className="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm">{worker.profession}</span>
                   </td>
                   <td className="p-4">
                     <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-gray-500 uppercase w-8">ID:</span>
                           <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-800 dark:text-white">{worker.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-gray-500 uppercase w-8">Pass:</span>
                           <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-800 dark:text-white flex items-center gap-1">
                             <Key className="w-3 h-3 text-gray-400" />
                             {worker.password || '123'}
                           </span>
                        </div>
                     </div>
                   </td>
                   <td className="p-4 flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                     <span className="text-orange-500">★</span> {worker.rating}
                   </td>
                   <td className="p-4">
                      {worker.verified ? (
                        <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleVerifyWorker(worker.id)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-bold shadow-sm transition-colors"
                        >
                          Verify Now
                        </button>
                      )}
                   </td>
                   <td className="p-4 text-right space-x-2">
                     <button onClick={() => startEdit(worker)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-500" title="Edit Worker"><Edit2 className="w-4 h-4"/></button>
                     <button onClick={() => handleDeleteWorker(worker.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-500" title="Delete Worker"><Trash2 className="w-4 h-4"/></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services Management</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Add, edit, or remove professional categories.</p>
         </div>
         <button 
           onClick={() => { setEditingCategory(null); setNewService({ name: '', icon: '🔧', description: '' }); setShowAddServiceModal(true); }}
           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-md"
         >
           <Plus className="w-4 h-4" /> Add New Profession
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative group">
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => startEditCategory(cat)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                title="Edit Service"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteService(cat.id)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                title="Delete Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cat.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 min-h-[40px] pr-12">{cat.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500">
              <span>ID: {cat.id}</span>
              <span>{workers.filter(w => w.profession === cat.name).length} Professionals</span>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => { setEditingCategory(null); setNewService({ name: '', icon: '🔧', description: '' }); setShowAddServiceModal(true); }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all min-h-[200px]"
        >
          <Plus className="w-10 h-10 mb-2" />
          <span className="font-bold">Add Service Category</span>
        </button>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registered Users</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Database of all consumer logins and phone numbers.</p>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bold shadow-md"
            >
              <Send className="w-4 h-4" /> Broadcast
            </button>
         </div>
       </div>

       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[600px]">
             <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
               <tr className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                 <th className="p-4">User Details</th>
                 <th className="p-4">Phone (Login ID)</th>
                 <th className="p-4">Status</th>
                 <th className="p-4">Join Date</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
               {consumers.map(user => (
                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-600 shadow-sm">
                         {user.name.charAt(0)}
                       </div>
                       <div>
                         <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.email}</div>
                       </div>
                     </div>
                   </td>
                   <td className="p-4 font-mono text-gray-900 dark:text-gray-300 font-medium">{user.phone}</td>
                   <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                       user.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                     }`}>
                       {user.status}
                     </span>
                   </td>
                   <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{user.joinDate}</td>
                   <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors border ${user.status === 'Active' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-100 dark:border-red-800' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-100 dark:border-green-800'}`}
                        title={user.status === 'Active' ? 'Block User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? <Ban className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                      </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Booking History</h2>
        <button 
          onClick={() => handleExportCSV('bookings')}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"/>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No bookings in the system yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
             <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
               <tr className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                 <th className="p-4">ID</th>
                 <th className="p-4">Service Details</th>
                 <th className="p-4">Assigned Worker</th>
                 <th className="p-4">Date/Time</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-mono text-xs text-gray-500 dark:text-gray-400 font-bold">#{b.id.slice(-6)}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white">{b.service}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Amount: ₹{b.amount}</div>
                  </td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 font-bold">{b.workerName}</td>
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-bold">{b.date}</div>
                    <div className="text-xs">{b.time}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      b.status === 'CONFIRMED' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                      b.status === 'CANCELLED' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {b.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
             </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderFeedbacks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedbacks & Reviews</h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Feedback Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-800 dark:text-gray-200">Platform Feedback</h3>
             <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">{feedbacks.length} items</span>
          </div>
          {feedbacks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500">
              No general feedback received.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {feedbacks.map(f => (
                <div key={f.id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-bold text-gray-900 dark:text-white">{f.userName}</span>
                     <span className="text-xs text-gray-400">{f.date}</span>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{f.message}</p>
                   <div className="flex justify-between items-center mt-2">
                     <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">{f.type}</span>
                     <button onClick={() => handleDeleteFeedback(f.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worker Reviews Column */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-800 dark:text-gray-200">Worker Reviews</h3>
             <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">{reviews.length} reviews</span>
          </div>
          {reviews.length === 0 ? (
             <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500">
               No worker reviews yet.
             </div>
          ) : (
             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[500px] overflow-y-auto">
                {reviews.map(r => {
                  const worker = workers.find(w => w.id === r.workerId);
                  return (
                    <div key={r.id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                       <div className="flex justify-between items-start mb-1">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white">{r.customerName}</span>
                            <span className="text-xs text-gray-400">for {worker?.name || 'Unknown'}</span>
                         </div>
                         <div className="flex items-center text-orange-500 font-bold text-sm">
                            <span className="mr-1">{r.rating}</span>★
                         </div>
                       </div>
                       <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{r.comment}"</p>
                       <div className="flex justify-end mt-2">
                          <button onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1 hover:underline">
                             <Trash2 className="w-3 h-3"/> Delete Review
                          </button>
                       </div>
                    </div>
                  );
                })}
             </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
        <div>
           <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2 text-lg">Platform Configuration</h3>
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Platform Fee (%)</label>
               <input type="number" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700" defaultValue="10" />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Tax Rate (%)</label>
               <input type="number" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700" defaultValue="18" />
             </div>
           </div>
        </div>
        
        <div>
           <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2 text-lg">Admin Credentials</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Admin Username</label>
               <input type="text" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono" value="Thekedaar" readOnly />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Change Password</label>
               <input type="password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400" placeholder="Enter new password" />
             </div>
             <button className="bg-gray-900 dark:bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-900 transition-colors shadow-lg">
               Update Credentials
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans relative transition-colors">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on Mobile, Static on Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 dark:bg-black text-white flex flex-col transition-transform duration-300 shadow-2xl
        md:relative md:translate-x-0 md:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                T
              </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight">Thekedaar</h1>
               <p className="text-xs text-gray-400 font-medium tracking-wide">ADMIN PANEL</p>
             </div>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'bookings', label: 'All Bookings', icon: Calendar },
            { id: 'users', label: 'Users & Logins', icon: Users },
            { id: 'workers', label: 'Worker Details', icon: Briefcase },
            { id: 'services', label: 'Services', icon: LayoutGrid },
            { id: 'chats', label: 'Chat Reports', icon: MessageSquare },
            { id: 'feedbacks', label: 'Feedbacks & Reviews', icon: ThumbsUp },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-3 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Logout System
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col h-screen transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-30 transition-colors">
           <div className="flex items-center gap-4">
             <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
             >
               <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize hidden sm:flex items-center gap-2">
               {activeTab.replace('-', ' ')}
             </h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative">
               <Bell className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
             </div>
             <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Admin</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Super User</p>
               </div>
               <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold border border-orange-200 shadow-sm">A</div>
             </div>
           </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'workers' && renderWorkerManagement()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'chats' && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Chats Report</h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[600px]">
                       <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                         <tr>
                           <th className="p-4 text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">User</th>
                           <th className="p-4 text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Last Message Snippet</th>
                           <th className="p-4 text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Time</th>
                           <th className="p-4 text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Status</th>
                           <th className="p-4 text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         {MOCK_CHAT_LOGS.length > 0 ? (
                           MOCK_CHAT_LOGS.map(log => (
                             <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                               <td className="p-4 font-bold text-gray-800 dark:text-white">{log.user}</td>
                               <td className="p-4 text-gray-600 dark:text-gray-400 truncate max-w-xs font-medium">{log.lastMessage}</td>
                               <td className="p-4 text-gray-500 dark:text-gray-400 text-sm font-medium">{log.time}</td>
                               <td className="p-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                   log.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                   log.status === 'Flagged' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                 }`}>
                                   {log.status}
                                 </span>
                               </td>
                               <td className="p-4">
                                 <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-3 py-1 rounded-lg text-sm font-bold transition-colors">View Log</button>
                               </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">No chat reports available.</td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
          )}
          {activeTab === 'feedbacks' && renderFeedbacks()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBroadcastModal(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200 border dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Broadcast Message</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Send a notification to all {consumers.length} registered users.</p>
            
            <textarea
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white mb-4 placeholder-gray-400"
              rows={4}
              placeholder="Type your message here..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            ></textarea>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowBroadcastModal(false)}
                className="flex-1 py-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBroadcastSend}
                disabled={!broadcastMessage.trim()}
                className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddServiceModal(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200 border dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingCategory ? 'Edit Profession' : 'Add New Profession'}
            </h3>
            
            <form onSubmit={handleSaveService} className="space-y-4">
               <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Service Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Gardener"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={newService.name} 
                    onChange={e => setNewService({...newService, name: e.target.value})} 
                  />
               </div>
               <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Emoji Icon</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. 🌱"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-2xl" 
                    value={newService.icon} 
                    onChange={e => setNewService({...newService, icon: e.target.value})} 
                  />
               </div>
               <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Description</label>
                  <input 
                    type="text" 
                    placeholder="Short description..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={newService.description} 
                    onChange={e => setNewService({...newService, description: e.target.value})} 
                  />
               </div>
               
               <button 
                 type="submit"
                 className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors mt-2"
               >
                 {editingCategory ? 'Update Service' : 'Create Service'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {editingWorker && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 border dark:border-gray-700">
             <button onClick={() => setEditingWorker(null)} className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"><X className="w-5 h-5"/></button>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-4">{isAddingNew ? 'Add New Worker' : 'Edit Worker Details'}</h3>
             
             <form onSubmit={handleSaveWorker} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Profile Photo</label>
                   <div className="flex items-center gap-4">
                     <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        {editingWorker.photo.startsWith('data:') || editingWorker.photo.startsWith('http') ? (
                           <img src={editingWorker.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                           editingWorker.photo
                        )}
                     </div>
                     <div>
                       <input 
                          type="file" 
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          className="hidden" 
                       />
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600"
                       >
                         <Upload className="w-4 h-4" /> Upload New Photo
                       </button>
                     </div>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter worker name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    value={editingWorker.name} 
                    onChange={e => setEditingWorker({...editingWorker, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Profession</label>
                  <select 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none font-medium" 
                    value={editingWorker.profession} 
                    onChange={e => setEditingWorker({...editingWorker, profession: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                {/* Hourly Rate Input Removed */}
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Area</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Bhilai"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    value={editingWorker.area} 
                    onChange={e => setEditingWorker({...editingWorker, area: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Phone</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="+91..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    value={editingWorker.phone} 
                    onChange={e => setEditingWorker({...editingWorker, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Password</label>
                  <input 
                    type="text" 
                    placeholder="Login Password"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    value={editingWorker.password || ''} 
                    onChange={e => setEditingWorker({...editingWorker, password: e.target.value})} 
                  />
                  <p className="text-xs text-gray-500 mt-1">Default: 123</p>
                </div>
                <div>
                   <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Experience</label>
                   <input 
                    required 
                    type="text" 
                    placeholder="e.g. 5 years"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    value={editingWorker.experience} 
                    onChange={e => setEditingWorker({...editingWorker, experience: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-1">Description</label>
                  <textarea 
                    placeholder="Brief description about the professional..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-medium" 
                    rows={3} 
                    value={editingWorker.description} 
                    onChange={e => setEditingWorker({...editingWorker, description: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingWorker(null)} 
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 dark:shadow-none text-lg">
                    <Save className="w-5 h-5 inline mr-2" /> Save Details
                  </button>
                </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};
