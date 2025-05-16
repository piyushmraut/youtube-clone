// src/pages/Favorites.tsx
import { Heart } from 'lucide-react';
import { useVideos } from '../context/VideosContext';
import VideoGrid from '../components/VideoGrid';

const Favorites = () => {
  const { likedVideos } = useVideos();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Favorite Videos</h1>
      </div>

      <VideoGrid 
        videos={likedVideos} 
        variant="horizontal"
        emptyMessage="No favorite videos yet" 
      />
    </div>
  );
};

export default Favorites;