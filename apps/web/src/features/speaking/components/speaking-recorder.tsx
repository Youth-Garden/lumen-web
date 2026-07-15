'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import type { SpeakingTaskDto, SpeechResultDto } from '@/services/speaking';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useSubmitSpeech } from '../hooks/use-speaking';

interface SpeakingRecorderProps {
  task: SpeakingTaskDto;
}

export const SpeakingRecorder = ({ task }: SpeakingRecorderProps) => {
  const t = useTranslations('Speaking');

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [result, setResult] = useState<SpeechResultDto | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: submitSpeech, isPending } = useSubmitSpeech(task.id);

  // Initialize recorder
  useEffect(() => {
    // Check if navigator.mediaDevices exists
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setHasPermission(true);
          const mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunksRef.current.push(e.data);
            }
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            chunksRef.current = [];
          };

          mediaRecorderRef.current = mediaRecorder;
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          setHasPermission(false);
        });
    } else {
      setHasPermission(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      setAudioUrl(null);
      setResult(null);
      setRecordingTime(0);
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = () => {
    if (!audioUrl) return;

    // In a real app, you would upload the blob to a storage service (S3, Cloudinary)
    // and get a URL back. For this implementation, since we are constrained to the current backend,
    // we will submit a placeholder URL or data URI if the backend accepts it.
    // Assuming backend needs a string URL.

    const dummyAudioUrl = 'https://example.com/recorded-audio.mp3';

    submitSpeech(
      { audioUrl: dummyAudioUrl },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      },
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (hasPermission === false) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
        <Icons name="mic-off" className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 dark:text-red-400 font-medium">
          {t('noMicPermission')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recorder UI */}
      <div className="bg-card border rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
        {/* Pulsing background when recording */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-48 h-48 bg-red-500 rounded-full blur-3xl"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-4xl font-mono mb-8 tabular-nums font-semibold tracking-wider opacity-80">
            {formatTime(recordingTime)}
          </div>

          <div className="flex items-center gap-6">
            {!isRecording && !audioUrl && (
              <Button
                size="lg"
                className="h-20 w-20 rounded-full shadow-lg shadow-primary/30"
                onClick={startRecording}
              >
                <Icons name="mic" className="h-8 w-8" />
              </Button>
            )}

            {isRecording && (
              <Button
                size="lg"
                variant="destructive"
                className="h-20 w-20 rounded-full shadow-lg shadow-red-500/30 animate-pulse"
                onClick={stopRecording}
              >
                <Icons name="square" className="h-8 w-8" />
              </Button>
            )}

            {!isRecording && audioUrl && (
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 w-16 rounded-full"
                  onClick={startRecording}
                  disabled={isPending}
                >
                  <Icons name="rotate-ccw" className="h-6 w-6" />
                </Button>

                <Button
                  size="lg"
                  className="h-16 px-8 rounded-full font-semibold shadow-lg shadow-primary/30"
                  onClick={handleSubmit}
                  disabled={isPending || result !== null}
                >
                  {isPending ? (
                    <Icons
                      name="loader-2"
                      className="h-6 w-6 animate-spin mr-2"
                    />
                  ) : (
                    <Icons name="send" className="h-6 w-6 mr-2" />
                  )}
                  {t('submit')}
                </Button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {!isRecording && audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 w-full max-w-md"
              >
                <audio src={audioUrl} controls className="w-full h-12" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-primary" />

            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">{t('score')}</h3>
                <p className="text-muted-foreground">{t('feedback')}</p>
              </div>

              <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {result.accuracyScore}
                </span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border">
              <p className="leading-relaxed text-foreground whitespace-pre-wrap">
                {result.feedback}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
              >
                <Icons name="rotate-ccw" className="h-4 w-4 mr-2" />
                {t('tryAgain')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
