'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Sidebar from '../UI/Sidebar';
import Navbar from '../UI/Navbar';

interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
  created_at?: string;
  loginHistory?: {
    ip: string;
    device: string;
    login_time: string;
  }[];
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/get-users`, {
        headers: {
          credentials: 'include',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      setError('Failed to logout');
    }
  };

  const toggleLoginHistory = (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar title="Client Dashboard" onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Your existing main content here */}
      </div>
    </div>
  );
};

export default Dashboard;
