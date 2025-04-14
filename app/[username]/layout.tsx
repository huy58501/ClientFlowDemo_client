'use client';

import { use } from 'react';
import Sidebar from '@/components/UI/Sidebar';
import useAuth from '@/hooks/useAuth';
import LoadingModal from '@/components/UI/LoadingModal';
import NotFound from '@/components/UI/NotFound';

type LayoutParams = {
  username: string;
};

export default function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { username } = use(params);
  const checkAuth = useAuth();

  if (checkAuth.authStatus === 'loading') return <LoadingModal />;
  if (checkAuth.authStatus === 'unauthorized' || !checkAuth.auth) return <NotFound />;

  const isAdmin = checkAuth.auth.role === 'admin';
  const isSelf = checkAuth.auth.username === username;

  if (!isAdmin && !isSelf) return <NotFound />;

  const menuItemsClient = [
    {
      label: 'Dashboard',
      href: `/${username}/dashboard`,
    },
    {
      label: 'Book Inventory',
      href: `/${username}/book-inventory`,
    },
  ];

  // Only show sidebar for client pages
  if (username === 'client') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar title="Client Dashboard" menuItems={menuItemsClient} />
        <main className="flex-1 p-8 md:ml-6 mt-[73px] md:mt-0">{children}</main>
      </div>
    );
  }

  // For other roles (admin, tester), just render the children
  return <>{children}</>;
}
