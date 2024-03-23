import React from 'react';
import Header from './Header'; // Assuming you have a Header component

interface LayoutProps {
  children: React.ReactNode; // This type is suitable for any valid React child
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="bg-gray-100">
        <Header />
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;