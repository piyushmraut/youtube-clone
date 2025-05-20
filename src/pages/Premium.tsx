// src/pages/Premium.tsx
import { Zap } from 'lucide-react';

const Premium = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Zap className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">YouTube Premium</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-xl text-white">
          <h2 className="text-xl font-bold mb-4">Premium Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Zap className="mt-1" size={16} />
              <span>Ad-free videos and music</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="mt-1" size={16} />
              <span>Background play</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="mt-1" size={16} />
              <span>Downloads for offline viewing</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="mt-1" size={16} />
              <span>YouTube Music Premium included</span>
            </li>
          </ul>
        </div>

        <div className="bg-light-200 dark:bg-dark-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
          <div className="space-y-4">
            <div className="border border-light-300 dark:border-dark-300 p-4 rounded-lg">
              <h3 className="font-medium">Individual</h3>
              <p className="text-sm text-gray-500 dark:text-light-300 mt-1">$11.99/month</p>
            </div>
            <div className="border border-light-300 dark:border-dark-300 p-4 rounded-lg">
              <h3 className="font-medium">Family</h3>
              <p className="text-sm text-gray-500 dark:text-light-300 mt-1">$17.99/month (up to 6 members)</p>
            </div>
            <div className="border border-light-300 dark:border-dark-300 p-4 rounded-lg">
              <h3 className="font-medium">Student</h3>
              <p className="text-sm text-gray-500 dark:text-light-300 mt-1">$6.99/month</p>
            </div>
          </div>
          <button className="btn btn-primary mt-6 w-full">
            Try it free for 1 month
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;