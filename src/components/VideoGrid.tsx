import type { VideoType } from '../types';
import VideoCard from './VideoCard';

interface VideoGridProps {
  videos: VideoType[];
  variant?: 'grid' | 'horizontal';
  emptyMessage?: string;
}

const VideoGrid = ({ 
  videos, 
  variant = 'grid',
  emptyMessage = 'No videos found' 
}: VideoGridProps) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl text-light-400">{emptyMessage}</p>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} variant="horizontal" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;