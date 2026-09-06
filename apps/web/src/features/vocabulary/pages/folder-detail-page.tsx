'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useVocabularyFolderDetail } from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { useGoBack, usePronunciation } from '@/shared/hooks';
import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { StudyView } from '../components/study/study-view';

interface FolderDetailPageProps {
  folderId?: string;
}

export function FolderDetailPage({
  folderId: propFolderId,
}: FolderDetailPageProps = {}) {
  const t = useTranslations('Vocabulary.Folders');
  const params = useParams();
  const routeId = typeof params?.id === 'string' ? params.id : '';
  const folderId = propFolderId || routeId;

  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: folderDetail, isLoading } = useVocabularyFolderDetail(folderId);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const { playPronunciation } = usePronunciation();

  useEffect(() => {
    if (folderId) {
      localStorage.setItem('lumen_active_folder_id', folderId);
      localStorage.setItem('lumen_selected_folder_id', folderId);
    }
  }, [folderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (!folderDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full text-destructive">
        <Icons name="danger" className="h-10 w-10 mb-4" />
        <p className="text-base font-semibold">Folder not found</p>
        <Button className="mt-4 rounded-xl" onClick={goBack}>
          Back to Folders
        </Button>
      </div>
    );
  }

  const flashcards = folderDetail.flashcards || [];

  return (
    <div className="flex flex-col space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Button
            variant="subtle"
            size="sm"
            onClick={goBack}
            className="gap-1.5 -ml-2.5 w-fit mb-2 text-muted-foreground"
          >
            <Icons name="arrow-left" className="h-4 w-4" />
            <span>Back to Folders</span>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {folderDetail.name}
            </h1>
            {folderDetail.category && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {folderDetail.category}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            className="rounded-xl font-bold shadow-sm flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={flashcards.length === 0}
            onClick={() => setIsStudyModalOpen(true)}
          >
            <Icons name="play" className="h-4 w-4 fill-current" />
            <span>Study Folder</span>
          </Button>
        </div>
      </div>

      {/* Word List Section */}
      <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span>Vocabulary Words</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {flashcards.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {t('noFolders')}
            </div>
          ) : (
            <div className="space-y-3">
              {flashcards.map((flashcard) => {
                const primaryDefinition = flashcard.definitions?.[0];
                const meaningVi = primaryDefinition?.definition?.vi || '';
                const explainEn = primaryDefinition?.definition?.en || '';
                const examples = primaryDefinition?.examples || [];

                return (
                  <div
                    key={flashcard.id}
                    className="rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start justify-between gap-5"
                  >
                    {/* Left: Term info & details */}
                    <div className="flex-1 min-w-0">
                      {/* Term row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black uppercase tracking-wide text-foreground">
                          {flashcard.term}
                        </span>
                        {primaryDefinition?.partOfSpeech && (
                          <span className="text-sm text-muted-foreground font-medium">
                            ({primaryDefinition.partOfSpeech})
                          </span>
                        )}
                        {flashcard.phonetic && (
                          <span className="text-sm text-muted-foreground font-mono">
                            {flashcard.phonetic}
                          </span>
                        )}
                        {/* US Audio Button */}
                        <Button
                          variant="subtle"
                          size="sm"
                          className="h-6 px-2 gap-1 rounded-lg text-xs font-bold"
                          onClick={() =>
                            playPronunciation({
                              term: flashcard.term,
                              audioUrl: flashcard.audioUrl || undefined,
                              audioUsUrl: flashcard.audioUsUrl || undefined,
                              accent: PronunciationAccent.US,
                            })
                          }
                          title="Listen US"
                        >
                          <Icons name="volume-2" className="h-3 w-3 text-primary" />
                          <span>US</span>
                        </Button>

                        {/* UK Audio Button */}
                        <Button
                          variant="subtle"
                          size="sm"
                          className="h-6 px-2 gap-1 rounded-lg text-xs font-bold"
                          onClick={() =>
                            playPronunciation({
                              term: flashcard.term,
                              audioUkUrl: flashcard.audioUkUrl || undefined,
                              accent: PronunciationAccent.UK,
                            })
                          }
                          title="Listen UK"
                        >
                          <Icons name="volume-2" className="h-3 w-3 text-primary" />
                          <span>UK</span>
                        </Button>
                      </div>

                      {/* Definition */}
                      {(explainEn || meaningVi) && (
                        <div className="mt-2.5 text-sm">
                          <span className="font-semibold text-foreground">{t('definitionLabel')} </span>
                          <span className="text-muted-foreground">
                            {[explainEn, meaningVi].filter(Boolean).join('. ')}
                          </span>
                        </div>
                      )}

                      {/* Examples */}
                      {examples.length > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-foreground">{t('examplesLabel')}</span>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            {examples.map((example) => (
                              <li key={example.id} className="text-muted-foreground leading-relaxed">
                                {example.sentence?.en && (
                                  <span className="text-foreground">{example.sentence.en}</span>
                                )}
                                {example.sentence?.vi && (
                                  <span className="block ml-5 text-muted-foreground text-xs mt-0.5">
                                    {example.sentence.vi}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Word Image */}
                    {flashcard.imageUrl && (
                      <div className="relative shrink-0 self-center sm:self-start w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden border border-border/60 bg-muted/40 shadow-xs">
                        <Image
                          src={flashcard.imageUrl}
                          alt={flashcard.term}
                          fill
                          sizes="(max-width: 640px) 100vw, 144px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {isStudyModalOpen && (
        <StudyView
          cards={flashcards}
          isOpen={isStudyModalOpen}
          onClose={() => setIsStudyModalOpen(false)}
          folderName={folderDetail.name}
        />
      )}
    </div>
  );
}
