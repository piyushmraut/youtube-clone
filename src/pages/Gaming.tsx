import { useState, useEffect } from 'react';
import type { VideoType } from '../types';
import { getGamingVideos } from '../api/videoService';
import { useAuth } from '../context/AuthContext';
import VideoGrid from '../components/VideoGrid';
import Loading from '../components/Loading';
import { Gamepad2 } from 'lucide-react';

const Gaming = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        const videosData = await getGamingVideos(token);
        setVideos(videosData);
      } catch (err) {
        console.error('Error fetching gaming videos:', err);
        setError('Failed to load gaming videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  if (loading) {
    return <Loading message="Fetching gaming videos..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Gaming Videos</h1>
      </div>

      <VideoGrid 
        videos={videos} 
        emptyMessage="No gaming videos available" 
      />
    </div>
  );
};

export default Gaming;


