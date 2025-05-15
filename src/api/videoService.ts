import axios from 'axios';
import type { ApiResponse, VideoType, VideoDetailResponse } from '../types';

const API_BASE_URL = 'https://apis.ccbp.in';

const getAuthHeader = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getVideos = async (token: string, searchTerm: string = ''): Promise<VideoType[]> => {
  try {
    const response = await axios.get<ApiResponse<VideoType>>(
      `${API_BASE_URL}/videos/all?search=${searchTerm}`,
      { headers: getAuthHeader(token) }
    );
    return response.data.videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getTrendingVideos = async (token: string): Promise<VideoType[]> => {
  try {
    const response = await axios.get<ApiResponse<VideoType>>(
      `${API_BASE_URL}/videos/trending`,
      { headers: getAuthHeader(token) }
    );
    return response.data.videos;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
};

export const getGamingVideos = async (token: string): Promise<VideoType[]> => {
  try {
    const response = await axios.get<ApiResponse<VideoType>>(
      `${API_BASE_URL}/videos/gaming`,
      { headers: getAuthHeader(token) }
    );
    return response.data.videos;
  } catch (error) {
    console.error('Error fetching gaming videos:', error);
    throw error;
  }
};

export const getVideoDetails = async (token: string, videoId: string) => {
  try {
    const response = await axios.get<VideoDetailResponse>(
      `${API_BASE_URL}/videos/${videoId}`,
      { headers: getAuthHeader(token) }
    );
    return response.data.video_details;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};