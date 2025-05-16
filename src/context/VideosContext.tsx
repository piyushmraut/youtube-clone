// src/context/VideosContext.tsx
import React, { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import type { VideoType, UserInteraction } from '../types';

interface VideosContextType {
  savedVideos: VideoType[];
  likedVideos: VideoType[];
  addToSavedVideos: (video: VideoType) => void;
  removeFromSavedVideos: (id: string) => void;
  isVideoSaved: (id: string) => boolean;
  toggleLikeVideo: (video: VideoType) => void;
  toggleDislikeVideo: (video: VideoType) => void;
  isVideoLiked: (id: string) => boolean;
  isVideoDisliked: (id: string) => boolean;
  getLikedVideos: () => VideoType[];
  toggleLikeComment: (commentId: string) => void;
  isCommentLiked: (commentId: string) => boolean;
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

  const [userInteractions, setUserInteractions] = useState<UserInteraction>(() => {
  const interactions = localStorage.getItem('user_interactions');
  return interactions ? JSON.parse(interactions) : { 
    likedVideos: [], 
    dislikedVideos: [],
    likedComments: [] 
  };
});

  useEffect(() => {
    localStorage.setItem('saved_videos', JSON.stringify(savedVideos));
    localStorage.setItem('user_interactions', JSON.stringify(userInteractions));
  }, [savedVideos, userInteractions]);

  const addToSavedVideos = (video: VideoType) => {
    setSavedVideos((prev) => {
      if (prev.some((v) => v.id === video.id)) {
        return prev;
      }
      return [...prev, video];
    });
  };

  const toggleLikeComment = (commentId: string) => {
  setUserInteractions(prev => {
    if (prev.likedComments.includes(commentId)) {
      return {
        ...prev,
        likedComments: prev.likedComments.filter(id => id !== commentId)
      };
    } else {
      return {
        ...prev,
        likedComments: [...prev.likedComments, commentId]
      };
    }
  });
};

const isCommentLiked = (commentId: string) => {
  return (userInteractions.likedComments || []).includes(commentId);
};

  const removeFromSavedVideos = (id: string) => {
    setSavedVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const isVideoSaved = (id: string) => {
    return savedVideos.some((video) => video.id === id);
  };

  const toggleLikeVideo = (video: VideoType) => {
    setUserInteractions(prev => {
      const isLiked = prev.likedVideos.includes(video.id);
      const isDisliked = prev.dislikedVideos.includes(video.id);
      
      if (isLiked) {
        return {
          ...prev,
          likedVideos: prev.likedVideos.filter(id => id !== video.id)
        };
      } else {
        // Remove from disliked if it was disliked
        const newDisliked = isDisliked 
          ? prev.dislikedVideos.filter(id => id !== video.id)
          : prev.dislikedVideos;
          
        return {
          ...prev,
          likedVideos: [...prev.likedVideos, video.id],
          dislikedVideos: newDisliked
        };
      }
    });
  };

  const toggleDislikeVideo = (video: VideoType) => {
    setUserInteractions(prev => {
      const isDisliked = prev.dislikedVideos.includes(video.id);
      const isLiked = prev.likedVideos.includes(video.id);
      
      if (isDisliked) {
        return {
          ...prev,
          dislikedVideos: prev.dislikedVideos.filter(id => id !== video.id)
        };
      } else {
        // Remove from liked if it was liked
        const newLiked = isLiked 
          ? prev.likedVideos.filter(id => id !== video.id)
          : prev.likedVideos;
          
        return {
          ...prev,
          dislikedVideos: [...prev.dislikedVideos, video.id],
          likedVideos: newLiked
        };
      }
    });
  };

  const isVideoLiked = (id: string) => {
    return userInteractions.likedVideos.includes(id);
  };

  const isVideoDisliked = (id: string) => {
    return userInteractions.dislikedVideos.includes(id);
  };

  const getLikedVideos = () => {
    return savedVideos.filter(video => userInteractions.likedVideos.includes(video.id));
  };

  const contextValue: VideosContextType = {
    savedVideos,
    likedVideos: getLikedVideos(),
    addToSavedVideos,
    removeFromSavedVideos,
    isVideoSaved,
    toggleLikeVideo,
    toggleDislikeVideo,
    isVideoLiked,
    isVideoDisliked,
    getLikedVideos,
    toggleLikeComment,
    isCommentLiked
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