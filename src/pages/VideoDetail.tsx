import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { getVideoDetails, getVideos } from "../api/videoService";
import type { VideoDetailType, VideoType, CommentType } from "../types";
import { useAuth } from "../context/AuthContext";
import { useVideos } from "../context/VideosContext";
import VideoCard from "../components/VideoCard";
import Loading from "../components/Loading";
import {
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Share2,
  MessageSquare,
  Edit,
  Trash2,
  Reply,
} from "lucide-react";
import { formatTimeAgo, formatViewCount } from "../utils/formatters";
import { useTheme } from "../context/ThemeContext";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoDetailType | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const {
    addToSavedVideos,
    removeFromSavedVideos,
    isVideoSaved,
    toggleLikeVideo,
    toggleDislikeVideo,
    isVideoLiked,
    isVideoDisliked,
  } = useVideos();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!token || !id) return;

      try {
        setLoading(true);
        setError(null);

        const videoData = await getVideoDetails(token, id);
        setVideo({
          ...videoData,
          likes: videoData.likes || 0,
          dislikes: videoData.dislikes || 0,
        });

        const allVideos = await getVideos(token);
        const related = allVideos.filter((v) => v.id !== id).slice(0, 10);
        setRelatedVideos(related);

        setComments([
          {
            id: "1",
            author: "John Doe",
            authorProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
            text: "This video is amazing! Learned so much from it.",
            likes: 42,
            timestamp: "2023-05-15T10:30:00Z",
            replies: [
              {
                id: "1-1",
                author: "Jane Smith",
                authorProfileImage: "https://randomuser.me/api/portraits/women/1.jpg",
                text: "I agree! The explanations were very clear.",
                likes: 5,
                timestamp: "2023-05-15T11:15:00Z",
              },
            ],
          },
          {
            id: "2",
            author: "Alex Johnson",
            authorProfileImage: "https://randomuser.me/api/portraits/men/2.jpg",
            text: "Could you make a follow-up video on this topic?",
            likes: 18,
            timestamp: "2023-05-16T08:45:00Z",
          },
        ]);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Failed to load video. Please try again later.");
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
    if (!video) return;
    toggleLikeVideo(video);

    // Update video likes count optimistically
    setVideo((prev) => {
      if (!prev) return null;

      const wasLiked = isVideoLiked(video.id);
      const wasDisliked = isVideoDisliked(video.id);

      let likesChange = 0;
      let dislikesChange = 0;

      if (wasLiked) {
        likesChange = -1;
      } else {
        likesChange = 1;
        if (wasDisliked) {
          dislikesChange = -1;
        }
      }

      return {
        ...prev,
        likes: (prev.likes || 0) + likesChange,
        dislikes: (prev.dislikes || 0) + dislikesChange,
      };
    });
  };

  const handleDislike = () => {
    if (!video) return;
    toggleDislikeVideo(video);

    // Update video dislikes count optimistically
    setVideo((prev) => {
      if (!prev) return null;

      const wasDisliked = isVideoDisliked(video.id);
      const wasLiked = isVideoLiked(video.id);

      let dislikesChange = 0;
      let likesChange = 0;

      if (wasDisliked) {
        dislikesChange = -1;
      } else {
        dislikesChange = 1;
        if (wasLiked) {
          likesChange = -1;
        }
      }

      return {
        ...prev,
        dislikes: (prev.dislikes || 0) + dislikesChange,
        likes: (prev.likes || 0) + likesChange,
      };
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: CommentType = {
      id: Date.now().toString(),
      author: "You",
      authorProfileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      text: newComment,
      likes: 0,
      timestamp: new Date().toISOString(),
      isEditable: true,
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: CommentType = {
      id: `${commentId}-${Date.now()}`,
      author: "You",
      authorProfileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      text: replyText,
      likes: 0,
      timestamp: new Date().toISOString(),
      isEditable: true,
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleEditComment = (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditCommentText(comment.text);
    }
  };

  const handleUpdateComment = () => {
    if (!editingCommentId || !editCommentText.trim()) return;

    setComments((prev) =>
      updateCommentText(prev, editingCommentId, editCommentText)
    );
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => removeComment(prev, commentId));
  };

  const findComment = (
    comments: CommentType[],
    id: string
  ): CommentType | null => {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findComment(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateCommentText = (
    comments: CommentType[],
    id: string,
    newText: string
  ): CommentType[] => {
    return comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, text: newText };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentText(comment.replies, id, newText),
        };
      }
      return comment;
    });
  };

  const removeComment = (
    comments: CommentType[],
    id: string
  ): CommentType[] => {
    return comments.reduce<CommentType[]>((acc, comment) => {
      if (comment.id === id) return acc;

      if (comment.replies) {
        return [
          ...acc,
          {
            ...comment,
            replies: removeComment(comment.replies, id),
          },
        ];
      }

      return [...acc, comment];
    }, []);
  };



  if (loading) {
    return <Loading message="Loading video..." />;
  }

  if (error || !video) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-10 ${
          isDarkMode ? "bg-dark-200" : "bg-light-100"
        }`}
      >
        <p className="text-xl text-red-500">{error || "Video not found"}</p>
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
    <div
      className={`flex flex-col lg:flex-row gap-6 ${
        isDarkMode ? "bg-dark-200" : "bg-light-100"
      }`}
    >
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
          <h1
            className={`text-xl md:text-2xl font-bold ${
              isDarkMode ? "text-light-100" : "text-dark-300"
            }`}
          >
            {video.title}
          </h1>

          <div className="flex flex-wrap justify-between items-center mt-4">
            <div
              className={`flex items-center text-sm ${
                isDarkMode ? "text-light-400" : "text-dark-400"
              }`}
            >
              <span>{formatViewCount(video.view_count)}</span>
              <span className="mx-2">•</span>
              <span>
                {formatViewCount((video.likes || 0).toString())} likes
              </span>
              <span className="mx-2">•</span>
              <span>{formatTimeAgo(video.published_at)}</span>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button
                className={`flex items-center gap-2 ${
                  isVideoLiked(video.id)
                    ? "text-primary-600"
                    : isDarkMode
                    ? "text-light-400 hover:text-light-100"
                    : "text-dark-400 hover:text-dark-300"
                }`}
                onClick={handleLike}
              >
                <ThumbsUp size={20} />
                <span>{isVideoLiked(video.id) ? "Liked" : "Like"}</span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  isVideoDisliked(video.id)
                    ? "text-primary-600"
                    : isDarkMode
                    ? "text-light-400 hover:text-light-100"
                    : "text-dark-400 hover:text-dark-300"
                }`}
                onClick={handleDislike}
              >
                <ThumbsDown size={20} />
                <span>Dislike</span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  videoSaved
                    ? "text-primary-600"
                    : isDarkMode
                    ? "text-light-400 hover:text-light-100"
                    : "text-dark-400 hover:text-dark-300"
                }`}
                onClick={handleSaveVideo}
              >
                <Bookmark size={20} />
                <span>{videoSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "text-light-400 hover:text-light-100"
                    : "text-dark-400 hover:text-dark-300"
                }`}
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Info */}
        <div
          className={`mt-6 pt-6 ${
            isDarkMode
              ? "border-t border-dark-100"
              : "border-t border-light-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <img
              src={video.channel.profile_image_url}
              alt={video.channel.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3
                className={`font-medium ${
                  isDarkMode ? "text-light-100" : "text-dark-300"
                }`}
              >
                {video.channel.name}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-light-400" : "text-dark-400"
                }`}
              >
                {video.channel.subscriber_count} subscribers
              </p>
            </div>
          </div>

          <p
            className={`mt-4 whitespace-pre-line ${
              isDarkMode ? "text-light-200" : "text-dark-300"
            }`}
          >
            {video.description}
          </p>
        </div>

        {/* Comments Section */}
        <div
          className={`mt-8 ${isDarkMode ? "text-light-100" : "text-dark-300"}`}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} />
            <h3 className="text-xl font-medium">
              Comments ({comments.length})
            </h3>
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
                  className={`w-full px-4 py-2 rounded-full outline-none ${
                    isDarkMode
                      ? "bg-dark-100 text-light-100 placeholder-light-400"
                      : "bg-light-200 text-dark-300 placeholder-dark-400"
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className={`px-4 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-primary-600 hover:bg-primary-700"
                    : "bg-primary-500 hover:bg-primary-600"
                } text-white`}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.authorProfileImage}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div
                    className={`flex items-center gap-2 ${
                      isDarkMode ? "text-light-100" : "text-dark-300"
                    }`}
                  >
                    <span className="font-medium">{comment.author}</span>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-light-400" : "text-dark-400"
                      }`}
                    >
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md outline-none ${
                          isDarkMode
                            ? "bg-dark-100 text-light-100"
                            : "bg-light-200 text-dark-300"
                        }`}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleUpdateComment}
                          className={`px-3 py-1 rounded-md ${
                            isDarkMode
                              ? "bg-primary-600 hover:bg-primary-700"
                              : "bg-primary-500 hover:bg-primary-600"
                          } text-white text-sm`}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className={`px-3 py-1 rounded-md ${
                            isDarkMode
                              ? "bg-dark-100 hover:bg-dark-300"
                              : "bg-light-200 hover:bg-light-300"
                          } text-sm`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`mt-1 ${
                        isDarkMode ? "text-light-200" : "text-dark-400"
                      }`}
                    >
                      {comment.text}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    {/* <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 ${
                        isDarkMode
                          ? "text-light-400 hover:text-light-100"
                          : "text-dark-400 hover:text-dark-300"
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm">{comment.likes}</span>
                    </button> */}

                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
                        )
                      }
                      className={`flex items-center gap-1 text-sm ${
                        isDarkMode
                          ? "text-light-400 hover:text-light-100"
                          : "text-dark-400 hover:text-dark-300"
                      }`}
                    >
                      <Reply size={16} />
                      <span>Reply</span>
                    </button>

                    {comment.isEditable && (
                      <>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className={`flex items-center gap-1 text-sm ${
                            isDarkMode
                              ? "text-light-400 hover:text-light-100"
                              : "text-dark-400 hover:text-dark-300"
                          }`}
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className={`flex items-center gap-1 text-sm ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-500 hover:text-red-600"
                          }`}
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 pl-4 border-l-2 border-dark-100">
                      <div className="flex gap-3 mt-2">
                        <img
                          src="https://randomuser.me/api/portraits/men/3.jpg"
                          alt="Your profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className={`w-full px-3 py-1 rounded-md outline-none ${
                              isDarkMode
                                ? "bg-dark-100 text-light-100"
                                : "bg-light-200 text-dark-300"
                            }`}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              className={`px-3 py-1 rounded-md ${
                                isDarkMode
                                  ? "bg-primary-600 hover:bg-primary-700"
                                  : "bg-primary-500 hover:bg-primary-600"
                              } text-white text-sm`}
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className={`px-3 py-1 rounded-md ${
                                isDarkMode
                                  ? "bg-dark-100 hover:bg-dark-300"
                                  : "bg-light-200 hover:bg-light-300"
                              } text-sm`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-dark-100 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <img
                            src={reply.authorProfileImage}
                            alt={reply.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div
                              className={`flex items-center gap-2 ${
                                isDarkMode ? "text-light-100" : "text-dark-300"
                              }`}
                            >
                              <span className="font-medium text-sm">
                                {reply.author}
                              </span>
                              <span
                                className={`text-xs ${
                                  isDarkMode
                                    ? "text-light-400"
                                    : "text-dark-400"
                                }`}
                              >
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>

                            {editingCommentId === reply.id ? (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  className={`w-full px-3 py-1 rounded-md outline-none ${
                                    isDarkMode
                                      ? "bg-dark-100 text-light-100"
                                      : "bg-light-200 text-dark-300"
                                  }`}
                                  autoFocus
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={handleUpdateComment}
                                    className={`px-3 py-1 rounded-md ${
                                      isDarkMode
                                        ? "bg-primary-600 hover:bg-primary-700"
                                        : "bg-primary-500 hover:bg-primary-600"
                                    } text-white text-sm`}
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className={`px-3 py-1 rounded-md ${
                                      isDarkMode
                                        ? "bg-dark-100 hover:bg-dark-300"
                                        : "bg-light-200 hover:bg-light-300"
                                    } text-sm`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p
                                className={`mt-1 text-sm ${
                                  isDarkMode
                                    ? "text-light-200"
                                    : "text-dark-400"
                                }`}
                              >
                                {reply.text}
                              </p>
                            )}

                            <div className="flex items-center gap-4 mt-2">
                              {/* <button
                                onClick={() => handleCommentLike(reply.id)}
                                className={`flex items-center gap-1 ${
                                  isDarkMode
                                    ? "text-light-400 hover:text-light-100"
                                    : "text-dark-400 hover:text-dark-300"
                                }`}
                              >
                                <ThumbsUp size={14} />
                                <span className="text-xs">{reply.likes}</span>
                              </button> */}

                              {reply.isEditable && (
                                <>
                                  <button
                                    onClick={() => handleEditComment(reply.id)}
                                    className={`flex items-center gap-1 text-xs ${
                                      isDarkMode
                                        ? "text-light-400 hover:text-light-100"
                                        : "text-dark-400 hover:text-dark-300"
                                    }`}
                                  >
                                    <Edit size={14} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(reply.id)
                                    }
                                    className={`flex items-center gap-1 text-xs ${
                                      isDarkMode
                                        ? "text-red-400 hover:text-red-300"
                                        : "text-red-500 hover:text-red-600"
                                    }`}
                                  >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}
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
        <h3
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? "text-light-100" : "text-dark-300"
          }`}
        >
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
