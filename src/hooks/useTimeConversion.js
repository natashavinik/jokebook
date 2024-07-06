function useTimeConversion(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return { minutes, seconds: remainingSeconds };
}

export default useTimeConversion;
