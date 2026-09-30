'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { StudySessionMode } from '@/features/study/types/study.types';
import {
  ConfirmDeleteFolderDialog,
  type ConfirmDeleteFolderData,
} from '@/features/vocabulary/components/dialogs/confirm-delete-folder-dialog';
import {
  useFolderTopics,
  useFolderWordsInfinite,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { dueWordToVocabularyWord, studyService } from '@/services/study';
import { vocabularyService, type VocabularyWord } from '@/services/vocabulary';
import { NotFoundView } from '@/shared/components/not-found-view';
import { RouteEnum } from '@/shared/constants';
import { useGoBack, useLocale, useSetBreadcrumb } from '@/shared/hooks';
import { i18nText } from '@/shared/utils';
import { formatUrl } from '@lumen/shared-api';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal, usePortalWithoutBackdrop } from '@lumen/uikit/portal';

import { FolderTopicGrid } from '../components/folder-detail/folder-topic-grid';
import { TopicWordsList } from '../components/folder-detail/topic-words-list';

interface FolderDetailPageProps {
  folderId?: string;
}

export function FolderDetailPage({
  folderId: propFolderId,
}: FolderDetailPageProps = {}) {
  const t = useTranslations('Vocabulary.Folders');
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const routeId = typeof params?.id === 'string' ? params.id : '';
  const folderId = propFolderId || routeId;

  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: folderDetail, isLoading: isLoadingFolder } =
    useVocabularyFolderDetail(folderId);
  const { data: topics = [], isLoading: isLoadingTopics } =
    useFolderTopics(folderId);

  const isCustomFolder = folderDetail ? !folderDetail.isSystem : false;
  const hasTopics = topics.length > 0;

  const {
    data: wordsInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingWords,
  } = useFolderWordsInfinite(folderId, undefined, {
    enabled: Boolean(folderId) && (!hasTopics || isCustomFolder),
  });
  const words = useMemo(
    () => wordsInfiniteData?.pages.flatMap((page) => page.items) ?? [],
    [wordsInfiniteData?.pages],
  );

  const folderDisplayName = i18nText(folderDetail?.name, locale);

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: t('title'), href: RouteEnum.VOCABULARY },
        {
          label: folderDisplayName || '',
          isLoading: isLoadingFolder && !folderDetail,
        },
      ],
      [t, folderDisplayName, isLoadingFolder, folderDetail],
    ),
  );

  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);
  const [presentDeleteConfirm] = usePortal<ConfirmDeleteFolderData>(
    ConfirmDeleteFolderDialog,
  );

  const handleDeleteFolder = () => {
    if (!folderDetail) return;
    presentDeleteConfirm({
      folderId: folderDetail.id,
      folderName: folderDisplayName,
      onSuccess: () => {
        router.push(RouteEnum.VOCABULARY);
      },
    });
  };

  const handleTopicClick = (topicIdentifier: string) => {
    if (!topicIdentifier || !topicIdentifier.trim()) return;
    router.push(
      formatUrl(RouteEnum.FOLDER_TOPIC_DETAIL, {
        id: folderId,
        topic: encodeURIComponent(topicIdentifier.trim()),
      }),
    );
  };

  const startStudy = async (mode?: StudySessionMode) => {
    try {
      let studyWords: VocabularyWord[];

      if (mode === StudySessionMode.FLASHCARD) {
        const res = await vocabularyService.getFolderWords(
          folderId,
          undefined,
          1,
          200,
        );
        studyWords = res?.data?.items ?? [];
      } else {
        const includeNew = mode !== StudySessionMode.PRACTICE;
        const res = await studyService.listDueWords({
          folderId,
          includeNew,
          limit: 200,
        });
        studyWords = (res?.data ?? []).map(dueWordToVocabularyWord);
      }

      if (!studyWords.length) {
        toast.info(t('allWordsLearnedInFolder'));
        return;
      }

      presentStudyView({
        cards: studyWords,
        mode,
        folderName: folderDisplayName || t('defaultFolderDescription'),
      });
    } catch {
      // CoreService automatically displays toast.error for API failures
    }
  };

  const isLoading =
    isLoadingFolder ||
    isLoadingTopics ||
    ((!hasTopics || isCustomFolder) && isLoadingWords);

  if (isLoading) {
    return (
      <div className="w-full py-2 pb-36 space-y-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-64 rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md mt-1" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 justify-items-center">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between text-center p-2.5 rounded-2xl w-36 sm:w-40 select-none"
            >
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-muted/30 absolute inset-0" />
                <Skeleton className="w-16 h-16 sm:w-17 sm:h-17 rounded-full" />
              </div>

              <div className="mt-2.5 w-full flex flex-col items-center gap-1.5 px-1">
                <Skeleton className="h-4 w-20 sm:w-24 rounded-md" />
                <Skeleton className="h-3 w-14 sm:w-16 rounded-md" />
              </div>

              <div className="flex items-center justify-center gap-2.5 mt-2.5">
                <Skeleton className="h-3.5 w-10 rounded-full" />
                <Skeleton className="h-3.5 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-full shadow-lg p-1.5 px-3 border border-border/40">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    );
  }

  if (!folderDetail) {
    return <NotFoundView />;
  }

  const categoryText = i18nText(folderDetail.category, locale);
  const descriptionText = i18nText(folderDetail.description, locale);
  const totalWordCount = hasTopics ? folderDetail.wordCount || 0 : words.length;

  return (
    <div className="w-full py-2 pb-36">
      {hasTopics ? (
        <FolderTopicGrid
          folderName={folderDisplayName}
          category={categoryText || undefined}
          description={descriptionText || undefined}
          selectedTopic={null}
          topics={topics}
          onSelectTopic={handleTopicClick}
          onGoBack={goBack}
          onDeleteFolder={isCustomFolder ? handleDeleteFolder : undefined}
        />
      ) : (
        <div className="space-y-8">
          {/* Custom Folder Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {folderDisplayName}
                </h1>
                {categoryText && (
                  <Badge variant="subtle" size="sm">
                    {categoryText}
                  </Badge>
                )}
              </div>

              {isCustomFolder && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex items-center justify-center size-9 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label={t('folderActions')}
                  >
                    <Icons name="more-horizontal" className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDeleteFolder}
                      className="cursor-pointer"
                    >
                      <Icons name="trash-2" className="mr-2 h-4 w-4" />
                      <span>{t('deleteFolder')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {descriptionText || t('defaultFolderDescription')}
            </p>
          </div>

          {words.length > 0 ? (
            <TopicWordsList
              words={words}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onFetchNextPage={fetchNextPage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Icons name="sparkles" className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t('noWordsYet')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('noFoldersYet')}
              </p>
            </div>
          )}
        </div>
      )}

      {totalWordCount > 0 && (
        <StudyBottomActionBar
          onLearnNew={() => startStudy(StudySessionMode.LEARN_NEW)}
          onPractice={() => startStudy(StudySessionMode.PRACTICE)}
          onFlashcard={() => startStudy(StudySessionMode.FLASHCARD)}
        />
      )}
    </div>
  );
}
