
import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Worker } from '../types';

interface BookingModalProps {
  worker: Worker;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ worker, onClose, onConfirm }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    // Simulate API delay
    setTimeout(() => {
      onConfirm(date, time);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-transparent dark:border-gray-700">
        {step === 1 ? (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Book Service</h3>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md overflow-hidden">
                  {worker.photo.startsWith('data:') || worker.photo.startsWith('http') ? (
                     <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
                  ) : (
                     worker.photo
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">{worker.name}</p>
                  <p className="opacity-90">{worker.profession}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Preferred Time
                </label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                >
                  <option value="" className="dark:bg-gray-700">Select a time slot</option>
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!date || !time}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Booking Confirmed!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your professional will arrive on time.</p>
            <div className="w-8 h-8 border-4 border-orange-200 dark:border-orange-900 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-4">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};
