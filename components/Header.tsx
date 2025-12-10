
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, PlusCircle, List, Info } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek untuk mendeteksi scroll agar header berubah transparansinya
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  // Komponen Nav Item (Desktop)
  const DesktopNavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavClick(view)}
        className={`relative flex items-center space-x-2 px-5 py-2 rounded-full transition-all duration-300 ease-in-out font-medium text-sm
          ${isActive 
            ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm border border-white/20' 
            : 'text-red-100 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
      >
        <Icon size={16} className={isActive ? 'text-white' : 'text-red-200'} />
        <span>{label}</span>
      </button>
    );
  };

  // Komponen Nav Item (Mobile)
  const MobileNavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavClick(view)}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-red-800/50 text-white font-semibold border-l-4 border-white' 
            : 'text-red-100 hover:bg-red-800/30'
          }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    // Header dengan efek Glassmorphism
    // Warna background berubah sedikit saat discroll
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-white/10
        ${isScrolled 
          ? 'bg-red-700/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-red-700/95 backdrop-blur-sm shadow-md py-3 md:py-4'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* Judul Sekolah */}
          <div 
            className="flex flex-col cursor-pointer group" 
            onClick={() => handleNavClick(ViewState.HOME)}
          >
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none group-hover:text-red-100 transition-colors">
              SDN 3 KARAU KUALA
            </h1>
            <span className="text-red-200 text-xs font-medium tracking-wider mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
              BUKU TAMU DIGITAL
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <DesktopNavItem view={ViewState.HOME} label="Beranda" icon={Home} />
            <DesktopNavItem view={ViewState.FORM} label="Isi Buku Tamu" icon={PlusCircle} />
            <DesktopNavItem view={ViewState.LIST} label="Data Tamu" icon={List} />
            <DesktopNavItem view={ViewState.ABOUT} label="Tentang" icon={Info} />
          </nav>

          {/* Mobile Menu Button (Hamburger) */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown (Smooth Expand) */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-red-900/40 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-inner space-y-1">
            <MobileNavItem view={ViewState.HOME} label="Beranda" icon={Home} />
            <MobileNavItem view={ViewState.FORM} label="Isi Buku Tamu" icon={PlusCircle} />
            <MobileNavItem view={ViewState.LIST} label="Data Tamu" icon={List} />
            <MobileNavItem view={ViewState.ABOUT} label="Tentang Sekolah" icon={Info} />
            
            <div className="pt-3 pb-2 text-center border-t border-white/10 mt-2">
               <p className="text-xs text-red-200/70 font-light tracking-wide">
                 Jl. Pendidikan No. 123, Karau Kuala
               </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
