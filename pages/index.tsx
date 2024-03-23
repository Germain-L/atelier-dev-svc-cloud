import { useRouter } from 'next/router';
import { refreshAuthentication } from '../utils/auth';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await refreshAuthentication();
      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
};

export default HomePage;