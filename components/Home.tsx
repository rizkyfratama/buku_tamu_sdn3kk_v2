
import React from 'react';
import { PenTool, School, Clock, MapPin, ChevronRight, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 to-red-900 rounded-2xl shadow-xl text-white p-8 md:p-12 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Selamat Datang</h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Portal Buku Tamu Digital SD Negeri 3 Karau Kuala. <br/>
            Melayani dengan sepenuh hati, mencatat dengan teknologi.
          </p>
          
          <button 
            onClick={() => onNavigate(ViewState.FORM)}
            className="mt-8 bg-white text-red-700 hover:bg-red-50 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center mx-auto"
          >
            <PenTool className="mr-2" size={20} />
            Mulai Isi Buku Tamu
          </button>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Isi Buku Tamu (Quick Access) */}
        <div 
          onClick={() => onNavigate(ViewState.FORM)}
          className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-xl hover:border-red-200 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-600 transition-colors duration-300">
              <PenTool size={28} className="text-red-600 group-hover:text-white transition-colors" />
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-red-500" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">Tamu Baru</h3>
          <p className="text-gray-500 text-sm mt-2">
            Klik di sini untuk mengisi data kunjungan, foto, dan tanda tangan digital.
          </p>
        </div>

        {/* Card 2: Tentang Sekolah */}
        <div 
          onClick={() => onNavigate(ViewState.ABOUT)}
          className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
             <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
              <BookOpen size={28} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">Profil Sekolah</h3>
          <p className="text-gray-500 text-sm mt-2">
            Kenali lebih dekat SD Negeri 3 Karau Kuala, visi misi, dan budaya kami.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Informasi Layanan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Clock className="text-red-500 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-700">Jam Operasional</p>
              <p className="text-sm text-gray-600">Senin - Kamis: 07.00 - 14.00 WIB</p>
              <p className="text-sm text-gray-600">Jumat - Sabtu: 07.00 - 11.30 WIB</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="text-red-500 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-700">Lokasi</p>
              <p className="text-sm text-gray-600">Jl. Pendidikan No. 123, Karau Kuala</p>
              <p className="text-sm text-gray-600">Kalimantan Tengah</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
