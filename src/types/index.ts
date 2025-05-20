// src/types/index.ts
export interface VideoType {
  id: string;
  title: string;
  thumbnail_url: string;
  channel: {
    name: string;
    profile_image_url: string;
  };
  view_count: string;
  published_at: string;
  video_url?: string;
  description?: string;
  likes?: number;
  dislikes?: number;
}

export interface Channel {
  name: string;
  profile_image_url: string;
  subscriber_count: string;
}

export interface VideoDetailType extends VideoType {
  video_url: string;
  description: string;
  channel: Channel;
  likes?: number;
  dislikes?: number;
}

export interface ApiResponse<T> {
  total: number;
  videos: T[];
}

export interface VideoDetailResponse {
  video_details: VideoDetailType;
}

export interface CommentType {
  id: string;
  author: string;
  authorProfileImage: string;
  text: string;
  likes: number;
  timestamp: string;
  isEditable?: boolean;
  replies?: CommentType[];
}

export interface LikeStatus {
  liked: boolean;
  disliked: boolean;
}

export interface UserInteraction {
  likedVideos: string[];
  dislikedVideos: string[];
  likedComments: string[];
}

