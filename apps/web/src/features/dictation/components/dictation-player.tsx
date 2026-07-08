'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { materialService, DictationSubmissionDto } from '@/services/material/material.service';
import { materialKeys } from '@/services/material/material.keys';
import { Button, Input, Card, CardContent } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { toast } from 'sonner';

export const DictationPlayer = ({ materialId }: { materialId: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: materialResponse, isLoading } = useQuery({
    queryKey: materialKeys.detail(materialId),
    queryFn: () => materialService.getMaterialById(materialId),
  });

  const submitMutation = useMutation({
    mutationFn: (data: DictationSubmissionDto) => materialService.submitDictation(data),
    onSuccess: (result) => {
      setIsSubmitted(true);
      toast.success(`You scored ${result.data?.score}%!`);
    },
    onError: () => {
      toast.error('Failed to submit dictation. Please try again.');
    }
  });

  const material = materialResponse?.data;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!activeTranscriptId || !material) return;
      const activeSegment = material.transcripts.find(t => t.id === activeTranscriptId);
      if (activeSegment && audio.currentTime >= activeSegment.endTime) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [activeTranscriptId, material]);

  if (isLoading) return <div className="p-8 text-center">Loading audio...</div>;
  if (!material) return <div className="p-8 text-center text-red-500">Material not found.</div>;

  const handlePlaySegment = (transcriptId: string, startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setIsPlaying(true);
      setActiveTranscriptId(transcriptId);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const answers = Object.entries(inputs).map(([transcriptId, userInput]) => ({
      transcriptId,
      userInput
    }));

    if (answers.length === 0) {
      toast.error('Please type at least one answer before submitting.');
      return;
    }

    submitMutation.mutate({
      materialId,
      answers
    });
  };

  const results = submitMutation.data?.data?.results || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Audio Player Card */}
      <Card className="sticky top-4 z-10 shadow-lg border-primary/20">
        <CardContent className="p-6">
          <audio 
            ref={audioRef} 
            src={material.sourceUrl || 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg'} 
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            controls 
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{material.title}</h3>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending || isSubmitted} className="min-w-[120px]">
              {submitMutation.isPending ? 'Checking...' : isSubmitted ? `Score: ${submitMutation.data?.data?.score}%` : 'Check Answers'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transcripts List */}
      <div className="space-y-6 pb-20">
        {material.transcripts.sort((a, b) => a.order - b.order).map((transcript, index) => {
          const result = results.find(r => r.transcriptId === transcript.id);
          const isActive = activeTranscriptId === transcript.id && isPlaying;
          
          return (
            <div key={transcript.id} className={`p-4 rounded-xl border transition-all ${isActive ? 'border-primary shadow-md bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 shrink-0">
                  <Button 
                    variant={isActive ? "default" : "secondary"} 
                    size="icon" 
                    className="rounded-full w-10 h-10"
                    onClick={() => isActive ? handlePause() : handlePlaySegment(transcript.id, transcript.startTime)}
                  >
                    {isActive ? <Icons name="pause" className="w-5 h-5" /> : <Icons name="play" className="w-5 h-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-primary"
                    onClick={() => handlePlaySegment(transcript.id, transcript.startTime)}
                  >
                    <Icons name="rotate-ccw" className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Sentence {index + 1}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {transcript.startTime}s - {transcript.endTime}s
                    </span>
                  </div>
                  
                  <Input 
                    value={inputs[transcript.id] || ''}
                    onChange={(e) => handleInputChange(transcript.id, e.target.value)}
                    placeholder="Type what you hear..."
                    disabled={isSubmitted}
                    className={`text-lg py-6 ${result ? (result.isCorrect ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500') : ''}`}
                  />
                  
                  {isSubmitted && result && (
                    <div className={`p-3 rounded-lg text-sm ${result.isCorrect ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
                      <div className="flex items-start gap-2">
                        {result.isCorrect ? <Icons name="check-circle" className="w-5 h-5 shrink-0 mt-0.5" /> : <Icons name="x-circle" className="w-5 h-5 shrink-0 mt-0.5" />}
                        <div>
                          {!result.isCorrect && (
                            <p className="font-semibold mb-1">Correct Answer:</p>
                          )}
                          <p>{result.correctAnswer}</p>
                          <p className="text-muted-foreground mt-2 italic">Translation: {transcript.textVi}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
