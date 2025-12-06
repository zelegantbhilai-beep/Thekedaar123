
import React, { useState, useRef } from 'react';
import { Calendar, Clock, LogOut, User, MapPin, CheckCircle, Wallet, Briefcase, Power, DollarSign, Phone, Menu, X, Headphones, ChevronDown, ChevronUp, Send, HelpCircle } from 'lucide-react';
import { Worker, JobRequest } from '../types';

interface WorkerPortalProps {
  worker: Worker;
  onLogout: () => void;
  onUpdateWorker: (updatedWorker: Worker) => void;
}

// Mock Data for Leads - Cleared
const MOCK_LEADS: JobRequest[] = [];

// Mock FAQs
const FAQS = [
  { question: "When do I get paid?", answer: "Payments are processed weekly every Tuesday for the completed jobs of the previous week." },
  { question: "How can I improve my rating?", answer: "Arrive on time, be polite, and ensure the workspace is clean after the job is done." },
  { question: "What if the customer is not home?", answer: "Wait for 15 minutes and try calling them. If no response, you can cancel the job with reason 'Customer Unavailable'." },
];

export const WorkerPortal: React.FC<WorkerPortalProps> = ({ worker, onLogout, onUpdateWorker }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'schedule' | 'wallet' | 'profile' | 'support'>('leads');
  const [isOnline, setIsOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for managing jobs
  const [leads, setLeads] = useState<JobRequest[]>(MOCK_LEADS);
  const [schedule, setSchedule] = useState<JobRequest[]>([]);
  const [completedJobs, setCompletedJobs] = useState<JobRequest[]>([]);
  
  // Stats
  const [earnings, setEarnings] = useState(worker.walletBalance || 0);
  const [jobsDoneCount, setJobsDoneCount] = useState(worker.completedJobs);

  // Support State
  const [supportMsg, setSupportMsg] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleAcceptLead = (lead: JobRequest) => {
    setLeads(leads.filter(l => l.id !== lead.id));
    setSchedule([...schedule, { ...lead, status: 'ACCEPTED' }]);
  };

  const handleRejectLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const handleCompleteJob = (job: JobRequest) => {
    setSchedule(schedule.filter(s => s.id !== job.id));
    setCompletedJobs([...completedJobs, { ...job, status: 'COMPLETED' }]);
    setEarnings(prev => prev + job.amount);
    setJobsDoneCount(prev => prev + 1);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    alert("Support ticket created! We will contact you shortly.");
    setSupportMsg('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateWorker({ ...worker, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans transition-colors relative overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl flex flex-col transition-transform duration-300 border-r border-gray-100 dark:border-gray-700
        md:relative md:translate-x-0 md:shadow-lg
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-blue-200 dark:shadow-none">S</div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-white">Partner App</h1>
              <p className="text-xs text-gray-400">v2.4.0</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info Snippet */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl bg-gray-100 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
               {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                  <img src={worker.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  worker.photo
               )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{worker.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{worker.profession}</p>
            </div>
          </div>
          
          {/* Online Toggle */}
          <div 
            onClick={() => setIsOnline(!isOnline)}
            className={`cursor-pointer rounded-xl p-3 flex items-center justify-between transition-all border ${isOnline ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
          >
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4" />
              <span className="font-bold text-xs">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {[
            { id: 'leads', label: 'New Leads', icon: Briefcase, count: leads.length },
            { id: 'schedule', label: 'My Schedule', icon: Calendar, count: schedule.length },
            { id: 'wallet', label: 'Earnings', icon: Wallet },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'support', label: 'Help Center', icon: Headphones },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" /> {item.label}
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3.5 rounded-xl transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between shadow-sm z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="font-bold text-gray-800 dark:text-white">Partner App</h1>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">New Opportunities</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Jobs matching your profile in your area.</p>
                </div>
                {!isOnline && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 w-full sm:w-auto justify-center border border-yellow-200 dark:border-yellow-800">
                    <Power className="w-4 h-4" /> Go Online to receive leads
                  </div>
                )}
              </header>

              {leads.length === 0 ? (
                 <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">😴</div>
                   <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">No new leads</h3>
                   <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">We'll notify you when a customer needs help.</p>
                 </div>
              ) : (
                <div className="grid gap-4">
                  {leads.map(lead => (
                    <div key={lead.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">New Lead</span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.distance} away</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{lead.serviceType}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{lead.customerAddress}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600"><Calendar className="w-4 h-4 text-orange-500"/> {lead.date}</span>
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600"><Clock className="w-4 h-4 text-orange-500"/> {lead.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-gray-700 pt-4 md:pt-0">
                          <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                            <p className="text-xs text-gray-400 md:mb-1">Est. Earnings</p>
                            <div className="text-2xl font-extrabold text-gray-800 dark:text-white">₹{lead.amount}</div>
                          </div>
                          <div className="flex gap-3 w-full md:w-auto">
                             <button 
                               onClick={() => handleRejectLead(lead.id)}
                               className="flex-1 md:flex-none px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                             >
                               Ignore
                             </button>
                             <button 
                               onClick={() => handleAcceptLead(lead)}
                               className="flex-1 md:flex-none px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-colors text-sm"
                             >
                               Accept
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
               <header className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Schedule</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your active and upcoming jobs.</p>
               </header>

               {schedule.length === 0 ? (
                 <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                   <Briefcase className="w-16 h-16 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">No scheduled jobs</h3>
                   <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Go to the "New Leads" tab to find work.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {schedule.map(job => (
                     <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{job.serviceType}</h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2 text-sm font-medium">
                               <User className="w-4 h-4 text-gray-400" /> {job.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1 text-sm font-medium">
                               <MapPin className="w-4 h-4 text-gray-400" /> {job.customerAddress}
                            </div>
                          </div>
                          <a href={`tel:1234567890`} className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors self-end sm:self-start">
                            <Phone className="w-5 h-5" />
                          </a>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                            <Calendar className="w-4 h-4 text-blue-500" /> {job.date}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 justify-end sm:justify-start">
                            <Clock className="w-4 h-4 text-blue-500" /> {job.time}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                           <div className="flex flex-col">
                             <span className="text-xs text-gray-400 font-medium">Payout</span>
                             <span className="font-extrabold text-xl text-gray-800 dark:text-white">₹{job.amount}</span>
                           </div>
                           <button 
                             onClick={() => handleCompleteJob(job)}
                             className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all text-sm"
                           >
                             <CheckCircle className="w-5 h-5" /> Mark Completed
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {/* WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
               <header className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Earnings & Wallet</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Track your income and payouts.</p>
               </header>

               {/* Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <p className="text-blue-100 text-sm font-medium mb-1 relative z-10">Total Balance</p>
                    <h3 className="text-4xl font-extrabold mb-6 relative z-10">₹{earnings.toLocaleString()}</h3>
                    <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-3 px-4 rounded-xl backdrop-blur-sm transition-colors w-full relative z-10 flex items-center justify-center gap-2">
                      <Wallet className="w-4 h-4" /> Withdraw Funds
                    </button>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Jobs Completed</p>
                      <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">{jobsDoneCount}</h3>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-bold p-3 rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Great performance!
                    </div>
                 </div>
               </div>

               {/* Transaction History */}
               <div>
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                 <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                   {completedJobs.length === 0 ? (
                     <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                       <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                       <p>No recent transactions.</p>
                     </div>
                   ) : (
                     completedJobs.map((job, idx) => (
                       <div key={idx} className="p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                             <DollarSign className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-bold text-gray-800 dark:text-white text-sm">{job.serviceType}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{job.date} • ID: #{job.id.slice(-4)}</p>
                           </div>
                         </div>
                         <div className="text-green-600 dark:text-green-400 font-bold">+₹{job.amount}</div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
                <header className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account settings.</p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                  <div className="flex flex-col items-center mb-8">
                     <div className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-6xl mb-4 border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden">
                        {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                           <img src={worker.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                           worker.photo
                        )}
                     </div>
                     <input 
                       type="file" 
                       accept="image/*"
                       className="hidden" 
                       ref={fileInputRef}
                       onChange={handlePhotoUpload}
                     />
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                     >
                       Change Profile Photo
                     </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</label>
                        <input type="text" value={worker.name} readOnly className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</label>
                        <input type="text" value={worker.phone} readOnly className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Profession</label>
                        <input type="text" value={worker.profession} readOnly className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Service Area</label>
                        <input type="text" value={worker.area} readOnly className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bio</label>
                       <textarea rows={3} value={worker.description} readOnly className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                      <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg">
                        Edit Profile Details
                      </button>
                    </div>
                  </div>
                </div>
             </div>
          )}

          {/* NEW FEATURE: SUPPORT TAB */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
               <header className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help Center</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Get support and answers to your questions.</p>
               </header>

               <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Form */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <Send className="w-5 h-5 text-blue-500" /> Contact Support
                     </h3>
                     <form onSubmit={handleSendSupport} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Subject</label>
                          <select className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option>Payment Issue</option>
                             <option>Technical Problem</option>
                             <option>Account Inquiry</option>
                             <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Message</label>
                          <textarea 
                            required
                            rows={4} 
                            placeholder="Describe your issue in detail..."
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={supportMsg}
                            onChange={(e) => setSupportMsg(e.target.value)}
                          ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none">
                          Submit Ticket
                        </button>
                     </form>
                  </div>

                  {/* FAQs */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <HelpCircle className="w-5 h-5 text-orange-500" /> Frequently Asked Questions
                     </h3>
                     <div className="space-y-3">
                        {FAQS.map((faq, index) => (
                           <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                              <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                              >
                                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{faq.question}</span>
                                 {expandedFaq === index ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                              </button>
                              {expandedFaq === index && (
                                 <div className="p-4 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                                    {faq.answer}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
