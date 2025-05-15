import { Bookmark } from 'lucide-react';
import { useVideos } from '../context/VideosContext';
import VideoGrid from '../components/VideoGrid';

const SavedVideos = () => {
  const { savedVideos } = useVideos();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Saved Videos</h1>
      </div>

      <VideoGrid 
        videos={savedVideos} 
        variant="horizontal"
        emptyMessage="No saved videos yet" 
      />
    </div>
  );
};

export default SavedVideos;