import React, { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import type { VideoType } from '../types';

interface VideosContextType {
  savedVideos: VideoType[];
  addToSavedVideos: (video: VideoType) => void;
  removeFromSavedVideos: (id: string) => void;
  isVideoSaved: (id: string) => boolean;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

interface VideosProviderProps {
  children: ReactNode;
}

export const VideosProvider: React.FC<VideosProviderProps> = ({ children }) => {
  const [savedVideos, setSavedVideos] = useState<VideoType[]>(() => {
    const saved = localStorage.getItem('saved_videos');
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to sync saved videos with localStorage
  useEffect(() => {
    localStorage.setItem('saved_videos', JSON.stringify(savedVideos));
  }, [savedVideos]);

  const addToSavedVideos = (video: VideoType) => {
    setSavedVideos((prev) => {
      // Check if already exists
      if (prev.some((v) => v.id === video.id)) {
        return prev;
      }
      return [...prev, video];
    });
  };

  const removeFromSavedVideos = (id: string) => {
    setSavedVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const isVideoSaved = (id: string) => {
    return savedVideos.some((video) => video.id === id);
  };

  const contextValue: VideosContextType = {
    savedVideos,
    addToSavedVideos,
    removeFromSavedVideos,
    isVideoSaved,
  };

  return (
    <VideosContext.Provider value={contextValue}>
      {children}
    </VideosContext.Provider>
  );
};

export const useVideos = (): VideosContextType => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideosProvider');
  }
  return context;
};