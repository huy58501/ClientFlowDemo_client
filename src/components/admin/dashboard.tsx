'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronUp, FiFolder, FiGrid } from 'react-icons/fi';
import Sidebar from '../UI/Sidebar';

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
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/get-users`, {
        headers: {
          credentials: 'include',
        },
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

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: FiGrid,
    },
    {
      label: 'Projects',
      href: '/admin/projects',
      icon: FiFolder,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900">
      {/* Mobile Header */}
      <Sidebar title="Admin Dashboard" menuItems={menuItems} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">User Login History</h2>
            <p className="text-gray-400 mt-1">View and manage user login activities across the platform</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Username</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Created At</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Last Login</th>
                    <th className="text-left p-4 text-gray-400 font-medium">IP Address</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Device Info</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="p-4">
                          <a 
                            href={`/${user.username}/dashboard`}
                            className="text-white font-medium hover:text-blue-400 transition-colors duration-200"
                          >
                            {user.username}
                          </a>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{user.role}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {user.loginHistory && user.loginHistory.length > 0
                            ? new Date(user.loginHistory[0].login_time).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td className="p-4 text-gray-300">
                          {user.loginHistory && user.loginHistory.length > 0
                            ? user.loginHistory[0].ip
                            : 'N/A'}
                        </td>
                        <td className="p-4 text-gray-300">
                          <div className="max-w-xs truncate">
                            {user.loginHistory && user.loginHistory.length > 0
                              ? user.loginHistory[0].device
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleLoginHistory(user.id)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors duration-200"
                            >
                              {expandedUserId === user.id ? (
                                <>
                                  Hide
                                  <FiChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  View
                                  <FiChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Login History Panel */}
                      {expandedUserId === user.id && (
                        <tr>
                          <td colSpan={7} className="p-0">
                            <div className="bg-slate-800/50 border-t border-white/10 p-4">
                              <h4 className="text-white font-medium mb-3">Login History for {user.username}</h4>

                              {user.loginHistory && user.loginHistory.length > 0 ? (
                                <div className="space-y-3">
                                  {user.loginHistory.map((login, index) => (
                                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                          <p className="text-gray-400 text-sm">Login Time</p>
                                          <p className="text-white font-medium">
                                            {new Date(login.login_time).toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-sm">IP Address</p>
                                          <p className="text-white font-medium">{login.ip}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-400 text-sm">Device</p>
                                          <p className="text-white font-medium truncate">{login.device}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-400">
                                  No login history available for this user.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10">&lt;</button>
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10">&gt;</button>
              </div>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full sm:w-auto bg-white/5 border border-white/10 text-gray-400 rounded-lg px-3 py-1"
              >
                <option value="10">10 rows</option>
                <option value="20">20 rows</option>
                <option value="50">50 rows</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
