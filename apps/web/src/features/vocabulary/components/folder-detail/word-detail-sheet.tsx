'use client';

import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  IconButton,
  ScrollArea,
  Sheet,
  SheetClose,
  SheetContent,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal, type PortalProps } from '@lumen/uikit/portal';

import { useReviewFlashcard } from '@/features/study/hooks';
import {
  SaveToFolderSheet,
  type SaveToFolderData,
} from '@/features/vocabulary/components/dialogs/save-to-folder-sheet';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { FlashcardRating } from '@/services/study';
import {
  PronunciationAccent,
  WordRelationType,
  vocabularyService,
  type VocabularyWord,
  type WordRelation,
} from '@/services/vocabulary';
import { usePronunciation } from '@/shared/hooks';
import { Locale } from '@/shared/types';
import {
  getSecondaryI18nText,
  i18nText,
  normalizePartOfSpeech,
} from '@/shared/utils';

function renderHighlightedSentence(sentence: string, term: string) {
  if (!sentence || !term) return sentence;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = sentence.split(regex);
  if (parts.length === 1) return sentence;

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="font-bold text-primary">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function RelationBadge({
  relation,
  onClick,
}: {
  relation: WordRelation;
  onClick: (rel: WordRelation) => void;
}) {
  const isInteractive = Boolean(relation.targetWordId);

  if (!isInteractive) {
    return (
      <Badge variant="subtle" size="sm">
        {relation.targetTerm}
      </Badge>
    );
  }

  return (
    <Button
      variant="secondary"
      size="xs"
      onClick={() => onClick(relation)}
      className="h-6 px-2 text-xs font-medium gap-1 rounded-md"
    >
      <span>{relation.targetTerm}</span>
      <span className="text-[10px] opacity-70">↗</span>
    </Button>
  );
}

export function WordDetailSheet({
  isOpen,
  onDismiss,
  data: initialWord,
}: PortalProps<VocabularyWord>) {
  const t = useTranslations('Vocabulary.Folders');
  const locale = useLocale();
  const { playPronunciation } = usePronunciation();
  const { mutate: reviewFlashcard, isPending } = useReviewFlashcard();
  const [presentSaveToFolder] = usePortal<SaveToFolderData>(SaveToFolderSheet);

  const [historyStack, setHistoryStack] = useState<VocabularyWord[]>([]);
  const [localLevel, setLocalLevel] = useState<number | null>(null);
  const [localStep, setLocalStep] = useState<number | null>(null);
  const [localIsWilted, setLocalIsWilted] = useState<boolean | null>(null);

  useEffect(() => {
    if (initialWord) {
      setHistoryStack([initialWord]);
    }
  }, [initialWord?.id, initialWord?.flashcardId, initialWord]);

  const activeWord = historyStack[historyStack.length - 1] || initialWord;

  useEffect(() => {
    setLocalLevel(null);
    setLocalStep(null);
    setLocalIsWilted(null);
  }, [activeWord?.id, activeWord?.flashcardId]);

  const currentLevel =
    localLevel !== null ? localLevel : (activeWord?.level ?? 0);
  const currentStep =
    localStep !== null ? localStep : (activeWord?.learningStep ?? 0);
  const currentIsWilted =
    localIsWilted !== null ? localIsWilted : (activeWord?.isWilted ?? false);

  const flashcardId = activeWord?.flashcardId ?? activeWord?.id ?? '';
  const hasPassedFirstLevel = currentLevel >= 1;

  const handleMarkKnown = () => {
    setLocalLevel(6);
    setLocalStep(6);
    setLocalIsWilted(false);

    reviewFlashcard({
      flashcardId,
      quality: FlashcardRating.FAST_TRACK_KNOWN,
      isFastTrackKnown: true,
    });
  };

  const handleMarkUnknown = () => {
    setLocalLevel(0);
    setLocalStep(0);
    setLocalIsWilted(false);

    reviewFlashcard({
      flashcardId,
      quality: FlashcardRating.WRONG,
      isCorrect: false,
      isResetToUnlearned: true,
    });
  };

  const handleNavigateRelation = async (relation: WordRelation) => {
    if (!relation.targetWordId) return;
    try {
      const res = await vocabularyService.getWord(relation.targetWordId);
      if (res?.data) {
        setHistoryStack((prev) => [...prev, res.data]);
      }
    } catch {
      // Automatic service level error toast
    }
  };

  const handleBack = () => {
    setHistoryStack((prev) =>
      prev.length > 1 ? prev.slice(0, prev.length - 1) : prev,
    );
  };

  const wordLevelRelated = (activeWord?.relations || [])
    .filter(
      (rel) =>
        rel.relationType === WordRelationType.RELATED || !rel.definitionId,
    )
    .slice(0, 8);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss?.();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="w-full max-w-lg mx-auto rounded-t-3xl max-h-[88dvh] sm:max-h-[85vh] gap-0 p-0 border-t border-border/60 shadow-2xl"
      >
        <ScrollArea className="overflow-y-auto max-h-[88dvh] sm:max-h-[85vh]">
          <div className="flex items-center gap-3.5 px-6 pt-6 pb-2">
            {historyStack.length > 1 && (
              <IconButton
                type="button"
                className="shrink-0 mr-1"
                onClick={handleBack}
                title={t('backToPreviousWord')}
              >
                <Icons name="arrow-left" className="h-4 w-4" />
              </IconButton>
            )}
            <MasteryFlowerBadge
              level={currentLevel}
              learningStep={currentStep}
              isWilted={currentIsWilted}
              size={48}
            />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">
              {activeWord?.term ?? ''}
            </h2>
            {activeWord?.cefrLevel && (
              <Badge variant="subtle" size="sm" className="uppercase">
                {activeWord.cefrLevel}
              </Badge>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <IconButton
                type="button"
                className="shrink-0"
                onClick={() =>
                  presentSaveToFolder({
                    wordId: activeWord?.wordId || activeWord?.id || '',
                    term: activeWord?.term,
                  })
                }
                title={t('saveToFolder')}
              >
                <Icons name="folder-plus" className="h-4 w-4" />
              </IconButton>
              <SheetClose />
            </div>
          </div>

          {activeWord && (
            <div className="flex justify-between gap-4 px-6 pt-2 pb-4">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    playPronunciation({
                      term: activeWord.term,
                      audioUrl: activeWord.audioUrl ?? undefined,
                      audioUsUrl: activeWord.audioUsUrl ?? undefined,
                      accent: PronunciationAccent.US,
                    })
                  }
                  className="justify-start gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Icons
                    name="volume-2"
                    className="h-4 w-4 text-primary shrink-0"
                  />
                  <span className="font-bold text-xs text-foreground/80">
                    US
                  </span>
                  <span className="font-sans text-sm">
                    {activeWord.phoneticUs || activeWord.phonetic || ''}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    playPronunciation({
                      term: activeWord.term,
                      audioUkUrl: activeWord.audioUkUrl ?? undefined,
                      accent: PronunciationAccent.UK,
                    })
                  }
                  className="justify-start gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Icons
                    name="volume-2"
                    className="h-4 w-4 text-sky-500 shrink-0"
                  />
                  <span className="font-bold text-xs text-foreground/80">
                    UK
                  </span>
                  <span className="font-sans text-sm">
                    {activeWord.phoneticUk || activeWord.phonetic || ''}
                  </span>
                </Button>
              </div>

              <div>
                {hasPassedFirstLevel ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkUnknown}
                    disabled={isPending}
                  >
                    {t('markUnknown')}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMarkKnown}
                    disabled={isPending}
                  >
                    {t('markKnown')}
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeWord?.imageUrl && (
            <div className="flex justify-center px-6 my-3">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-xs border border-border/40">
                <Image
                  src={activeWord.imageUrl}
                  alt={activeWord.term}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="px-6 pb-8 space-y-6">
            {activeWord?.definitions.map((def) => {
              const primaryText = i18nText(def.definition, locale);
              const secondaryText = getSecondaryI18nText(
                def.definition,
                locale,
              );

              const partOfSpeech = normalizePartOfSpeech(def.partOfSpeech);

              const synonyms = (def.relations || [])
                .filter((r) => r.relationType === WordRelationType.SYNONYM)
                .slice(0, 8);
              const antonyms = (def.relations || [])
                .filter((r) => r.relationType === WordRelationType.ANTONYM)
                .slice(0, 8);

              return (
                <div key={def.id} className="space-y-2">
                  {partOfSpeech && (
                    <p className="text-xs font-semibold italic text-muted-foreground uppercase tracking-wide">
                      {partOfSpeech}
                    </p>
                  )}

                  {primaryText && (
                    <p className="text-base font-bold text-primary leading-snug">
                      {primaryText}
                    </p>
                  )}

                  {secondaryText && secondaryText !== primaryText && (
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {secondaryText}
                    </p>
                  )}

                  {synonyms.length > 0 && (
                    <div className="pt-1.5 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t('synonyms')}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {synonyms.map((rel) => (
                          <RelationBadge
                            key={rel.id}
                            relation={rel}
                            onClick={handleNavigateRelation}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {antonyms.length > 0 && (
                    <div className="pt-1.5 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t('antonyms')}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {antonyms.map((rel) => (
                          <RelationBadge
                            key={rel.id}
                            relation={rel}
                            onClick={handleNavigateRelation}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {def.examples.length > 0 && (
                    <div className="mt-3 space-y-2.5">
                      <p className="text-xs font-medium italic text-muted-foreground">
                        {t('examples')}:
                      </p>
                      {Array.from(
                        new Map(
                          def.examples.map((ex) => [
                            i18nText(ex.sentence, Locale.EN)
                              .toLowerCase()
                              .trim(),
                            ex,
                          ]),
                        ).values(),
                      ).map((example) => {
                        const sentenceEn = i18nText(
                          example.sentence,
                          Locale.EN,
                        );
                        const nativeSentence = i18nText(
                          example.sentence,
                          locale,
                        );

                        return (
                          <div key={example.id} className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground leading-normal">
                              {renderHighlightedSentence(
                                sentenceEn,
                                activeWord.term,
                              )}
                            </p>
                            {nativeSentence &&
                              nativeSentence.toLowerCase().trim() !==
                                sentenceEn.toLowerCase().trim() && (
                                <p className="text-sm text-muted-foreground leading-normal">
                                  {nativeSentence}
                                </p>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {wordLevelRelated.length > 0 && (
              <div className="pt-4 border-t border-border/40 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t('relatedWords')}:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {wordLevelRelated.map((rel) => (
                    <RelationBadge
                      key={rel.id}
                      relation={rel}
                      onClick={handleNavigateRelation}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
