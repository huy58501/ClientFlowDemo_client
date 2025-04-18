'use client';

import { use } from 'react';
import BookInventory from '@/components/clients/client/BookInventory';
import NotFound from '@/components/UI/NotFound';
import LoadingModal from '@/components/UI/LoadingModal';
import useAuth from '@/hooks/useAuth';

type PageParams = {
  username: string;
};

export default function BookInventoryPage({ params }: { params: Promise<PageParams> }) {
  const { username } = use(params);
  const checkAuth = useAuth();

  if (checkAuth.authStatus === 'loading') return <LoadingModal />;
  if (checkAuth.authStatus === 'unauthorized' || !checkAuth.auth) return <NotFound />;

  const isAdmin = checkAuth.auth.role === 'admin';
  const isSelf = checkAuth.auth.username === username;

  if (!isAdmin && !isSelf) return <NotFound />;

  if (username === 'client') {
    return <BookInventory />;
  }

  return <NotFound />;
}
