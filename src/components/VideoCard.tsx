// src/components/VideoCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VideoType } from '../types';
import { formatTimeAgo } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

interface VideoCardProps {
  video: VideoType;
  variant?: 'grid' | 'horizontal' | 'small';
}

const VideoCard = ({ video, variant = 'grid' }: VideoCardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const handleClick = () => {
    navigate(`/video/${video.id}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const renderGridCard = () => (
    <div 
      className={`video-card cursor-pointer ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`} 
      onClick={handleClick}
    >
      <div className="relative">
        {isLoading && (
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-dark-100' : 'bg-light-200'} animate-pulse-slow`}></div>
        )}
        <img 
          src={video.thumbnail_url} 
          alt={video.title}
          className="video-thumbnail"
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex gap-3 mt-3">
        <div className="shrink-0 w-9 h-9">
          {video.channel?.profile_image_url && (
            <img 
              src={video.channel.profile_image_url} 
              alt={video.channel.name || 'Channel'}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className={`font-medium line-clamp-2 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>{video.title}</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>{video.channel?.name || 'Unknown Channel'}</p>
          <div className={`flex items-center text-xs mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
            <span>{video.view_count} views</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(video.published_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHorizontalCard = () => (
    <div 
      className={`flex gap-4 cursor-pointer rounded-xl p-2 ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`} 
      onClick={handleClick}
    >
      <div className="relative shrink-0 w-40 md:w-64">
        {isLoading && (
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-dark-100' : 'bg-light-200'} animate-pulse-slow rounded-xl`}></div>
        )}
        <img 
          src={video.thumbnail_url} 
          alt={video.title}
          className="w-full rounded-xl aspect-video object-cover"
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium line-clamp-2 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>{video.title}</h3>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>{video.channel?.name || 'Unknown Channel'}</p>
        <div className={`flex items-center text-xs mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
          <span>{video.view_count} views</span>
          <span className="mx-1">•</span>
          <span>{formatTimeAgo(video.published_at)}</span>
        </div>
      </div>
    </div>
  );

  const renderSmallCard = () => (
    <div 
      className={`flex gap-2 cursor-pointer rounded-xl p-2 ${isDarkMode ? 'hover:bg-dark-100' : 'hover:bg-light-200'}`} 
      onClick={handleClick}
    >
      <div className="relative shrink-0 w-32">
        {isLoading && (
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-dark-100' : 'bg-light-200'} animate-pulse-slow rounded-xl`}></div>
        )}
        <img 
          src={video.thumbnail_url} 
          alt={video.title}
          className="w-full rounded-xl aspect-video object-cover"
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium text-sm line-clamp-2 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>{video.title}</h3>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>{video.channel?.name || 'Unknown Channel'}</p>
        <div className={`flex items-center text-xs mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
          <span>{video.view_count} views</span>
        </div>
      </div>
    </div>
  );

  if (variant === 'horizontal') return renderHorizontalCard();
  if (variant === 'small') return renderSmallCard();
  return renderGridCard();
};

export default VideoCard;