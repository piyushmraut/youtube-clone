import { Link } from 'react-router-dom';
import { Youtube } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-200 flex flex-col items-center justify-center p-4">
      <Youtube className="text-primary-600" size={64} />
      <h1 className="text-4xl font-bold mt-6">404</h1>
      <p className="text-xl mt-2">Page Not Found</p>
      <p className="text-light-400 mt-4 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="btn btn-primary mt-8"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;