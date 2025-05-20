// src/pages/Settings.tsx
import { Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Language</h2>
          <select className="w-full p-2 rounded-md bg-white dark:bg-dark-300 border border-light-300 dark:border-dark-100">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
          </select>
        </div>

        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;