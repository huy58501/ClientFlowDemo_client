'use client';
import React from 'react';
import Link from 'next/link';
import { FiGrid, FiFolder, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  onLogout: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, className = '' }) => {
  return (
    <nav className={`space-y-2 ${className}`}>
      <Link 
        href="/admin/dashboard" 
        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
      >
        <FiGrid className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link 
        href="/admin/projects" 
        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <FiFolder className="w-5 h-5" />
        <span>Projects</span>
      </Link>
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors w-full text-left"
      >
        <FiLogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Sidebar; 