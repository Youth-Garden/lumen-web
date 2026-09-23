let lastPlayTime = 0;
let lastAudioInstance: HTMLAudioElement | null = null;

export const playAudio = (url: string) => {
  if (!url) return;
  const now = Date.now();
  if (now - lastPlayTime < 300) return;
  lastPlayTime = now;

  if (lastAudioInstance) {
    lastAudioInstance.pause();
    lastAudioInstance.currentTime = 0;
  }

  const audio = new Audio(url);
  lastAudioInstance = audio;
  audio.play().catch((err) => {
    if ((err as Error)?.name !== 'AbortError') {
      console.error(err);
    }
  });
};
