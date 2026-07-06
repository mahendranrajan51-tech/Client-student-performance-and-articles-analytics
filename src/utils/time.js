export const formatDuration = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  const totalMinutes = totalSeconds > 0 ? Math.ceil(totalSeconds / 60) : 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
