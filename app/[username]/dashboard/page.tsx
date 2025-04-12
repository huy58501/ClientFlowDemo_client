'use client';

import useAuth from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const authStatus = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthorized') {
      router.push('/');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (authStatus === 'unauthorized') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Add your dashboard content here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to your dashboard</h2>
          <p className="text-gray-600">This is your personal dashboard page.</p>
        </div>
      </div>
    </div>
  );
} 