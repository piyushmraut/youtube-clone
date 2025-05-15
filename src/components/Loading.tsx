import { Youtube } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Youtube className="text-primary-600 animate-pulse" size={40} />
      <p className="mt-4 text-light-400">{message}</p>
    </div>
  );
};

export default Loading;