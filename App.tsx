import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GuestForm from './components/GuestForm';
import GuestList from './components/GuestList';
import About from './components/About';
import Home from './components/Home';
import ParticlesBackground from './components/ParticlesBackground';
import { GuestEntry, ViewState } from './types';

const App: React.FC = () => {
  // Set default view to HOME
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  // Load guests from local storage on mount
  useEffect(() => {
    const savedGuests = localStorage.getItem('sdn3_guests');
    if (savedGuests) {
      setGuests(JSON.parse(savedGuests));
    }
  }, []);

  // Save guests to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem('sdn3_guests', JSON.stringify(guests));
  }, [guests]);

  const handleAddGuest = async (entry: GuestEntry) => {
    setIsSubmitting(true);
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGuests(prev => [entry, ...prev]);
    setLastMessage(entry.aiSummary || "Terima kasih telah berkunjung!");
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setView(ViewState.LIST);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans relative">
      
      {/* Background Animation */}
      <ParticlesBackground />

      {/* Main Content Wrapper - z-10 ensures it sits ON TOP of particles */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header sekarang menangani Navigasi */}
        <Header currentView={view} onNavigate={setView} />

        <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
          
          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {view === ViewState.HOME && (
              <Home onNavigate={setView} />
            )}
            {view === ViewState.FORM && (
              <GuestForm onSubmit={handleAddGuest} isSubmitting={isSubmitting} />
            )}
            {view === ViewState.LIST && (
              <GuestList guests={guests} />
            )}
            {view === ViewState.ABOUT && (
              <About />
            )}
          </div>
        </main>

        <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm mt-auto">
          <p>&copy; {new Date().getFullYear()} SD Negeri 3 Karau Kuala. All rights reserved.</p>
          <p className="mt-1 text-xs">Dikembangkan dengan Teknologi AI Google Gemini</p>
        </footer>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Terima Kasih!</h3>
            <p className="text-gray-600 mb-6">{lastMessage}</p>
            <button 
              onClick={closeSuccessModal}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Lihat Daftar Tamu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;