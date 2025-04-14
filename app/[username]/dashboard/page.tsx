'use client';

import { use, useEffect, useState } from 'react';
import TesterDashboard from '@/components/clients/tester/dashboard';
import ClientDashboard from '@/components/clients/client/dashboard';
import AdminDashboard from '@/components/admin/dashboard';
import NotFound from '@/components/UI/NotFound';
import LoadingModal from '@/components/UI/LoadingModal';
import useAuth from '@/hooks/useAuth';

type PageParams = {
  username: string;
};

export default function DashboardPage({ params }: { params: Promise<PageParams> }) {
  const { username } = use(params);
  const checkAuth = useAuth();

  if (checkAuth.authStatus === 'loading') return <LoadingModal />;
  if (checkAuth.authStatus === 'unauthorized' || !checkAuth.auth) return <NotFound />;

  const isAdmin = checkAuth.auth.role === 'admin';
  const isSelf = checkAuth.auth.username === username;

  if (!isAdmin && !isSelf) return <NotFound />;

  switch (username) {
    case 'admin':
      return <AdminDashboard />;
    case 'client':
      return <ClientDashboard />;
    case 'tester':
      return <TesterDashboard />;
    default:
      return <NotFound />;
  }
}
