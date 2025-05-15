import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { VideoType } from '../types';
import { getVideos } from '../api/videoService';
import { useAuth } from '../context/AuthContext';
import VideoGrid from '../components/VideoGrid';
import Loading from '../components/Loading';

const Home = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { token } = useAuth();
  
  // Extract search term from URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        const videosData = await getVideos(token, searchTerm);
        setVideos(videosData);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token, searchTerm]);

  if (loading) {
    return <Loading message="Fetching videos..." />;
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {searchTerm ? `Search results for "${searchTerm}"` : 'Home'}
        </h1>
      </div>

      <VideoGrid 
        videos={videos} 
        emptyMessage={searchTerm ? `No videos found for "${searchTerm}"` : 'No videos available'} 
      />
    </div>
  );
};

export default Home;    