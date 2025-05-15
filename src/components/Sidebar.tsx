// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, Gamepad2, Bookmark, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/trending", icon: <TrendingUp size={20} />, label: "Trending" },
    { to: "/gaming", icon: <Gamepad2 size={20} />, label: "Gaming" },
    {
      to: "/saved-videos",
      icon: <Bookmark size={20} />,
      label: "Saved Videos",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 pt-16 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:z-0 md:w-56 md:shrink-0 ${isDarkMode ? 'bg-dark-300' : 'bg-light-100'}`}
      >
        {/* Close button - mobile only */}
        <button
          onClick={closeSidebar}
          className={`absolute top-4 right-4 p-1 rounded-full md:hidden ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`}
        >
          <X size={20} className={isDarkMode ? 'text-light-100' : 'text-dark-300'} />
        </button>

        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.to) 
                      ? isDarkMode 
                        ? 'bg-dark-100 font-medium text-light-100' 
                        : 'bg-light-200 font-medium text-dark-300'
                      : isDarkMode 
                        ? 'text-light-100 hover:bg-dark-100' 
                        : 'text-dark-300 hover:bg-light-200'
                  }`}
                  onClick={closeSidebar}
                >
                  {React.cloneElement(link.icon, {
                    className: isActive(link.to) 
                      ? isDarkMode 
                        ? 'text-light-100' 
                        : 'text-dark-300'
                      : isDarkMode 
                        ? 'text-light-400' 
                        : 'text-dark-400'
                  })}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;