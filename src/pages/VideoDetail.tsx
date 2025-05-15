// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import ReactPlayer from 'react-player';
// import { getVideoDetails, getVideos } from '../api/videoService';
// import type { VideoDetailType, VideoType } from '../types';
// import { useAuth } from '../context/AuthContext';
// import { useVideos } from '../context/VideosContext';
// import VideoCard from '../components/VideoCard';
// import Loading from '../components/Loading';
// import { Bookmark, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
// import { formatTimeAgo, formatViewCount } from '../utils/formatters';

// const VideoDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [video, setVideo] = useState<VideoDetailType | null>(null);
//   const [relatedVideos, setRelatedVideos] = useState<VideoType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { token } = useAuth();
//   const { addToSavedVideos, removeFromSavedVideos, isVideoSaved } = useVideos();
  
//   useEffect(() => {
//     const fetchVideoDetails = async () => {
//       if (!token || !id) return;
      
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch video details
//         const videoData = await getVideoDetails(token, id);
//         setVideo(videoData);
        
//         // Fetch related videos (using regular videos endpoint as a substitute)
//         const allVideos = await getVideos(token);
//         // Filter out the current video and limit to 10 videos
//         const related = allVideos
//           .filter(v => v.id !== id)
//           .slice(0, 10);
//         setRelatedVideos(related);
//       } catch (err) {
//         console.error('Error fetching video details:', err);
//         setError('Failed to load video. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideoDetails();
//     // Scroll to top when video changes
//     window.scrollTo(0, 0);
//   }, [token, id]);

//   const handleSaveVideo = () => {
//     if (!video) return;
    
//     if (isVideoSaved(video.id)) {
//       removeFromSavedVideos(video.id);
//     } else {
//       addToSavedVideos(video);
//     }
//   };

//   if (loading) {
//     return <Loading message="Loading video..." />;
//   }

//   if (error || !video) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <p className="text-xl text-red-500">{error || 'Video not found'}</p>
//         <button 
//           onClick={() => window.location.reload()}
//           className="btn btn-primary mt-4"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const videoSaved = isVideoSaved(video.id);

//   return (
//     <div className="flex flex-col lg:flex-row gap-6">
//       <div className="lg:w-2/3">
//         {/* Video Player */}
//         <div className="w-full aspect-video bg-black overflow-hidden rounded-xl">
//           <ReactPlayer
//             url={video.video_url}
//             width="100%"
//             height="100%"
//             controls
//             playing
//           />
//         </div>
        
//         {/* Video Info */}
//         <div className="mt-4">
//           <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
          
//           <div className="flex flex-wrap justify-between items-center mt-4">
//             <div className="flex items-center text-light-400 text-sm">
//               <span>{formatViewCount(video.view_count)}</span>
//               <span className="mx-2">•</span>
//               <span>{formatTimeAgo(video.published_at)}</span>
//             </div>
            
//             <div className="flex items-center gap-4 mt-4 sm:mt-0">
//               <button className="flex items-center gap-2 hover:text-light-100">
//                 <ThumbsUp size={20} />
//                 <span>Like</span>
//               </button>
              
//               <button className="flex items-center gap-2 hover:text-light-100">
//                 <ThumbsDown size={20} />
//                 <span>Dislike</span>
//               </button>
              
//               <button 
//                 className={`flex items-center gap-2 ${videoSaved ? 'text-primary-500' : 'hover:text-light-100'}`}
//                 onClick={handleSaveVideo}
//               >
//                 <Bookmark size={20} />
//                 <span>{videoSaved ? 'Saved' : 'Save'}</span>
//               </button>
              
//               <button className="flex items-center gap-2 hover:text-light-100">
//                 <Share2 size={20} />
//                 <span>Share</span>
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Channel Info */}
//         <div className="mt-6 pt-6 border-t border-dark-100">
//           <div className="flex items-start gap-4">
//             <img 
//               src={video.channel.profile_image_url} 
//               alt={video.channel.name}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <div>
//               <h3 className="font-medium">{video.channel.name}</h3>
//               <p className="text-light-400 text-sm mt-1">{video.channel.subscriber_count} subscribers</p>
//             </div>
//           </div>
          
//           <p className="mt-4 text-light-200 whitespace-pre-line">{video.description}</p>
//         </div>
//       </div>
      
//       {/* Related Videos */}
//       <div className="lg:w-1/3">
//         <h3 className="text-lg font-medium mb-4">Related Videos</h3>
//         <div className="space-y-4">
//           {relatedVideos.map((video) => (
//             <VideoCard key={video.id} video={video} variant="small" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoDetail;

// src/pages/VideoDetail.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getVideoDetails, getVideos } from '../api/videoService';
import type { VideoDetailType, VideoType, CommentType, LikeStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideosContext';
import VideoCard from '../components/VideoCard';
import Loading from '../components/Loading';
import { Bookmark, ThumbsUp, ThumbsDown, Share2, MessageSquare } from 'lucide-react';
import { formatTimeAgo, formatViewCount } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoDetailType | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    liked: false,
    disliked: false
  });
  const { token } = useAuth();
  const { addToSavedVideos, removeFromSavedVideos, isVideoSaved } = useVideos();
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!token || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch video details
        const videoData = await getVideoDetails(token, id);
        setVideo(videoData);
        
        // Fetch related videos
        const allVideos = await getVideos(token);
        const related = allVideos
          .filter(v => v.id !== id)
          .slice(0, 10);
        setRelatedVideos(related);
        
        // Mock comments (in a real app, this would be an API call)
        setComments([
          {
            id: '1',
            author: 'John Doe',
            authorProfileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
            text: 'This video is amazing! Learned so much from it.',
            likes: 42,
            timestamp: '2023-05-15T10:30:00Z',
            replies: [
              {
                id: '1-1',
                author: 'Jane Smith',
                authorProfileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
                text: 'I agree! The explanations were very clear.',
                likes: 5,
                timestamp: '2023-05-15T11:15:00Z'
              }
            ]
          },
          {
            id: '2',
            author: 'Alex Johnson',
            authorProfileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
            text: 'Could you make a follow-up video on this topic?',
            likes: 18,
            timestamp: '2023-05-16T08:45:00Z'
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
    window.scrollTo(0, 0);
  }, [token, id]);

  const handleSaveVideo = () => {
    if (!video) return;
    
    if (isVideoSaved(video.id)) {
      removeFromSavedVideos(video.id);
    } else {
      addToSavedVideos(video);
    }
  };

  const handleLike = () => {
    setLikeStatus(prev => ({
      liked: !prev.liked,
      disliked: false
    }));
  };

  const handleDislike = () => {
    setLikeStatus(prev => ({
      liked: false,
      disliked: !prev.disliked
    }));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj: CommentType = {
      id: Date.now().toString(),
      author: 'You',
      authorProfileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      text: newComment,
      likes: 0,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      // Handle nested replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, likes: reply.likes + 1 };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  if (loading) {
    return <Loading message="Loading video..." />;
  }

  if (error || !video) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 ${isDarkMode ? 'bg-dark-200' : 'bg-light-100'}`}>
        <p className="text-xl text-red-500">{error || 'Video not found'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  const videoSaved = isVideoSaved(video.id);

  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${isDarkMode ? 'bg-dark-200' : 'bg-light-100'}`}>
      <div className="lg:w-2/3">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black overflow-hidden rounded-xl">
          <ReactPlayer
            url={video.video_url}
            width="100%"
            height="100%"
            controls
            playing
          />
        </div>
        
        {/* Video Info */}
        <div className="mt-4">
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
            {video.title}
          </h1>
          
          <div className="flex flex-wrap justify-between items-center mt-4">
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
              <span>{formatViewCount(video.view_count)}</span>
              <span className="mx-2">•</span>
              <span>{formatTimeAgo(video.published_at)}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button 
                className={`flex items-center gap-2 ${likeStatus.liked ? 'text-primary-600' : isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}
                onClick={handleLike}
              >
                <ThumbsUp size={20} />
                <span>Like</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 ${likeStatus.disliked ? 'text-primary-600' : isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}
                onClick={handleDislike}
              >
                <ThumbsDown size={20} />
                <span>Dislike</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 ${videoSaved ? 'text-primary-600' : isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}
                onClick={handleSaveVideo}
              >
                <Bookmark size={20} />
                <span>{videoSaved ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className={`flex items-center gap-2 ${isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}>
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Channel Info */}
        <div className={`mt-6 pt-6 ${isDarkMode ? 'border-t border-dark-100' : 'border-t border-light-300'}`}>
          <div className="flex items-start gap-4">
            <img 
              src={video.channel.profile_image_url} 
              alt={video.channel.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
                {video.channel.name}
              </h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
                {video.channel.subscriber_count} subscribers
              </p>
            </div>
          </div>
          
          <p className={`mt-4 whitespace-pre-line ${isDarkMode ? 'text-light-200' : 'text-dark-300'}`}>
            {video.description}
          </p>
        </div>
        
        {/* Comments Section */}
        <div className={`mt-8 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} />
            <h3 className="text-xl font-medium">Comments ({comments.length})</h3>
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-3">
              <img 
                src="https://randomuser.me/api/portraits/men/3.jpg" 
                alt="Your profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className={`w-full px-4 py-2 rounded-full outline-none ${isDarkMode ? 'bg-dark-100 text-light-100 placeholder-light-400' : 'bg-light-200 text-dark-300 placeholder-dark-400'}`}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                className={`px-4 py-1 rounded-full ${isDarkMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'} text-white`}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={comment.authorProfileImage} 
                  alt={comment.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className={`flex items-center gap-2 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
                    <span className="font-medium">{comment.author}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p className={`mt-1 ${isDarkMode ? 'text-light-200' : 'text-dark-400'}`}>
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 ${isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button className={`text-sm ${isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}>
                      Reply
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-dark-100 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-3">
                          <img 
                            src={reply.authorProfileImage} 
                            alt={reply.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
                              <span className="font-medium text-sm">{reply.author}</span>
                              <span className={`text-xs ${isDarkMode ? 'text-light-400' : 'text-dark-400'}`}>
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>
                            <p className={`mt-1 text-sm ${isDarkMode ? 'text-light-200' : 'text-dark-400'}`}>
                              {reply.text}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <button 
                                onClick={() => handleCommentLike(reply.id)}
                                className={`flex items-center gap-1 ${isDarkMode ? 'text-light-400 hover:text-light-100' : 'text-dark-400 hover:text-dark-300'}`}
                              >
                                <ThumbsUp size={14} />
                                <span className="text-xs">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Related Videos */}
      <div className="lg:w-1/3">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-light-100' : 'text-dark-300'}`}>
          Related Videos
        </h3>
        <div className="space-y-4">
          {relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} variant="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;