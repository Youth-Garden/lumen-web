/**
 * Formats a duration in seconds into a human-readable string (e.g., '1h 30m 15s', '45m 10s', or '15s').
 * 
 * @param seconds The total number of seconds to format.
 * @returns A formatted string representing the duration.
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};
