// src/components/Navbar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, X, Youtube, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

  const toggleMobileSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className={`sticky top-0 z-10 shadow-md ${isDarkMode ? 'bg-dark-300' : 'bg-light-100'}`}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-full mr-2 md:mr-4 ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
          
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Youtube className="text-primary-600" size={32} />
            <span className={`ml-2 text-xl font-bold hidden sm:block ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
              YouTube
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center max-w-xl w-full mx-4"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className={`w-full px-4 py-2 border focus:border-primary-600 rounded-l-full outline-none ${isDarkMode ? 'bg-dark-100 border-dark-100 text-light-100 placeholder-light-400' : 'bg-light-200 border-light-300 text-dark-300 placeholder-dark-400'}`}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2 rounded-r-full border ${isDarkMode ? 'bg-dark-100 border-dark-100 hover:bg-dark-300' : 'bg-light-200 border-light-300 hover:bg-light-300'}`}
          >
            <Search size={20} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
        </form>

        {/* Mobile Search Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMobileSearch}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
            aria-label="Toggle search"
          >
            {isSearchOpen ? (
              <X size={24} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
            ) : (
              <Search size={24} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-light-100" />
            ) : (
              <Moon size={20} className="text-dark-300" />
            )}
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            className={`hidden md:block px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-dark-100 hover:bg-dark-300 text-light-100' : 'bg-light-200 hover:bg-light-300 text-dark-300'}`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Form */}
      {isSearchOpen && (
        <form 
          onSubmit={handleSearch}
          className={`flex items-center p-2 md:hidden ${isDarkMode ? 'bg-dark-300' : 'bg-light-100'}`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className={`flex-1 px-4 py-2 border focus:border-primary-600 rounded-l-md outline-none ${isDarkMode ? 'bg-dark-100 border-dark-100 text-light-100 placeholder-light-400' : 'bg-light-200 border-light-300 text-dark-300 placeholder-dark-400'}`}
            autoFocus
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-r-md border ${isDarkMode ? 'bg-dark-100 border-dark-100 hover:bg-dark-300' : 'bg-light-200 border-light-300 hover:bg-light-300'}`}
          >
            <Search size={20} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
        </form>
      )}
    </header>
  );
};

export default Navbar;