'use client';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Sidebar from '@/components/UI/Sidebar';
import Navbar from '@/components/UI/Navbar';
import useAuth from '@/hooks/useAuth';
import LoadingModal from '@/components/UI/LoadingModal';

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
  const checkAuth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (!checkAuth || loading) {
    return <LoadingModal />;
  }

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
