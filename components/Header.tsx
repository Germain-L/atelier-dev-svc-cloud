import { useEffect, useState } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for authentication token in local storage or cookie
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Remove the token from local storage or cookie
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Update the login state
    setIsLoggedIn(false);
    // Redirect to home page or show a message
    window.location.href = '/';
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">MyApp</div>
        <div>
          <a href="/" className="mr-4 hover:text-gray-300">Home</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
          ) : (
            <a href="/login" className="hover:text-gray-300">Login</a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
