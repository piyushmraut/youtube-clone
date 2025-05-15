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
}

export interface ApiResponse<T> {
  total: number;
  videos: T[];
}

export interface VideoDetailResponse {
  video_details: VideoDetailType;
}

// src/types/index.ts
export interface CommentType {
  id: string;
  author: string;
  authorProfileImage: string;
  text: string;
  likes: number;
  timestamp: string;
  replies?: CommentType[];
}

export interface LikeStatus {
  liked: boolean;
  disliked: boolean;
}