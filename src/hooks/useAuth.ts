import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
    const usernameFromPath = window.location.pathname.split('/')[1];
    if (usernameFromPath) {
        try {
          const response = await fetch(`/api/check-login-auth?username=${usernameFromPath}`, {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            setAuthStatus('authorized');
          } else {
            setAuthStatus('unauthorized');
            router.push('/');
          }
        } catch (error) {
          console.error('Error during authentication check:', error);
          setAuthStatus('unauthorized');
          router.push('/');
        }
      } else {
        console.warn('Username mismatch or missing, redirecting to login.');
        setAuthStatus('unauthorized');
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  return authStatus;
};

export default useAuth;
