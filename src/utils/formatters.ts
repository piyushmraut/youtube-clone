/**
 * Formats a date string to a relative time ago format (e.g., "2 years ago")
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'year' : 'years'} ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'month' : 'months'} ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'day' : 'days'} ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'hour' : 'hours'} ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  return 'Just now';
};

/**
 * Format number of views to a more readable format (e.g., 1.2M, 450K)
 */
export const formatViewCount = (viewString: string): string => {
  const count = parseInt(viewString, 10);
  
  if (isNaN(count)) {
    return '0 views';
  }
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  }
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  
  return `${count} views`;
};

/**
 * Parses a timestamp string (e.g., "1:23", "0:45") into seconds
 */
export const parseTimestamp = (timestamp: string): number | null => {
  const parts = timestamp.split(':').reverse();
  
  // Validate format (should be either "ss" or "mm:ss")
  if (parts.length > 2 || parts.some(part => !/^\d+$/.test(part))) {
    return null;
  }

  try {
    let seconds = 0;
    if (parts.length >= 1) seconds += parseInt(parts[0], 10);
    if (parts.length >= 2) seconds += parseInt(parts[1], 10) * 60;
    return seconds;
  } catch {
    return null;
  }
};