import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="text-black p-4 bg-white">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">My App</h1>
        <div>
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-md text-white font-bold"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-row space-x-3">
              <Link href="/auth/login">
                <p className="py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-md text-white font-bold">Login</p>
              </Link>
              <Link href="/auth/register">
                <p className="py-2 px-4 bg-green-500 hover:bg-green-700 rounded-md text-white font-bold">Register</p>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
