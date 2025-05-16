import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, X, Youtube, Sun, Moon, Mic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
        navigate(`/?search=${transcript}`);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

  const toggleMobileSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    navigate('/');
  };

  const handleToggleSidebar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Toggling sidebar'); // Debug log
    toggleSidebar();
  };

  return (
    <header className={`sticky top-0 z-10 shadow-md ${isDarkMode ? 'bg-dark-300' : 'bg-light-100'}`}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button 
            onClick={handleToggleSidebar}
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
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDarkMode ? 'hover:bg-dark-300' : 'hover:bg-light-300'}`}
                aria-label="Clear search"
              >
                <X size={18} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`px-6 py-2 rounded-r-full border ${isDarkMode ? 'bg-dark-100 border-dark-100 hover:bg-dark-300' : 'bg-light-200 border-light-300 hover:bg-light-300'}`}
          >
            <Search size={20} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`ml-2 p-2 rounded-full ${isListening ? 'bg-primary-600 text-white' : isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
            aria-label="Voice search"
          >
            <Mic size={20} className={isListening ? 'text-white' : isDarkMode ? 'text-light-100' : 'text-dark-300'} />
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
          
        </div>
      </div>

      {/* Mobile Search Form */}
      {isSearchOpen && (
        <form 
          onSubmit={handleSearch}
          className={`flex items-center p-2 md:hidden ${isDarkMode ? 'bg-dark-300' : 'bg-light-100'}`}
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className={`w-full px-4 py-2 border focus:border-primary-600 rounded-l-md outline-none ${isDarkMode ? 'bg-dark-100 border-dark-100 text-light-100 placeholder-light-400' : 'bg-light-200 border-light-300 text-dark-300 placeholder-dark-400'}`}
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDarkMode ? 'hover:bg-dark-300' : 'hover:bg-light-300'}`}
                aria-label="Clear search"
              >
                <X size={18} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-r-md border ${isDarkMode ? 'bg-dark-100 border-dark-100 hover:bg-dark-300' : 'bg-light-200 border-light-300 hover:bg-light-300'}`}
          >
            <Search size={20} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`ml-2 p-2 rounded-full ${isListening ? 'bg-primary-600 text-white' : isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
            aria-label="Voice search"
          >
            <Mic size={20} className={isListening ? 'text-white' : isDarkMode ? 'text-light-100' : 'text-dark-300'} />
          </button>
        </form>
      )}
    </header>
  );
};

export default Navbar;