import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';

interface NavbarProps {
  title: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 text-white p-4">
          <Sidebar onLogout={onLogout} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-slate-950 text-white p-6 shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <Sidebar onLogout={onLogout} />
      </div>
    </>
  );
};

export default Navbar; 