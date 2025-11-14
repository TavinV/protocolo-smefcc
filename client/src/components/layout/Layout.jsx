import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
 
  function toggleMenu(){
    setIsMobileOpen(!isMobileOpen)
  }
 
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuClick={toggleMenu}/>

        {/* Page Content */}
        <main className="overflow-y-auto">
          <div className='flex-1 overflow-y-auto p-4 md:p-6'>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;