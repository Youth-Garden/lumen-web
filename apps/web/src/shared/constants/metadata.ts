import type { Metadata } from 'next';
import { RouteEnum } from './route';

export interface RouteMetadataConfig {
  title?: string;
  description?: string;
}

export const DEFAULT_PAGE_TITLE = 'Lumen';
export const DEFAULT_PAGE_DESCRIPTION =
  'Lumen - Vocabulary & Language Learning Platform';

export const DEFAULT_ROOT_METADATA: Metadata = {
  title: DEFAULT_PAGE_TITLE,
  description: DEFAULT_PAGE_DESCRIPTION,
};

export const ROUTE_METADATA_MAP: Partial<
  Record<RouteEnum, RouteMetadataConfig>
> = {
  [RouteEnum.DASHBOARD]: {
    title: 'Overview',
    description:
      'Track your daily learning progress, reviews, and vocabulary mastery.',
  },
  [RouteEnum.VOCABULARY]: {
    title: 'Vocabulary',
    description: 'Explore folders, organize words, and master language terms.',
  },
  [RouteEnum.FOLDER_DETAIL]: {
    title: 'Folder Details',
    description: 'Manage flashcards and practice vocabulary in this folder.',
  },
  [RouteEnum.STUDY]: {
    title: 'Study Session',
    description: 'Interactive flashcards and smart spaced repetition practice.',
  },
  [RouteEnum.SETTINGS]: {
    title: 'Settings',
    description: 'Manage your preferences, audio accents, and study goals.',
  },
  [RouteEnum.LOGIN]: {
    title: 'Login',
    description: 'Log in to your Lumen account.',
  },
  [RouteEnum.WELCOME]: {
    title: 'Welcome',
    description: 'Get started with Lumen language learning.',
  },
  [RouteEnum.QUIZ]: {
    title: 'Quiz',
    description: 'Test your vocabulary and knowledge retention.',
  },
  [RouteEnum.TOEIC]: {
    title: 'TOEIC Practice',
    description: 'Practice TOEIC questions and mock exams.',
  },
  [RouteEnum.READING]: {
    title: 'Reading',
    description: 'Practice reading comprehension with bilingual translations.',
  },
  [RouteEnum.DICTATION]: {
    title: 'Dictation',
    description: 'Improve your listening skills with dictation exercises.',
  },
  [RouteEnum.SPEAKING]: {
    title: 'Speaking',
    description: 'Practice pronunciation and speaking exercises.',
  },
  [RouteEnum.GRAMMAR]: {
    title: 'Grammar',
    description: 'Master English grammar points and structures.',
  },
  [RouteEnum.PROFILE]: {
    title: 'Profile',
    description: 'View and manage your Lumen profile.',
  },
};

export function getRouteMetadata(
  route?: RouteEnum,
  customOverride?: Partial<Metadata>,
): Metadata {
  if (!route || !ROUTE_METADATA_MAP[route]) {
    return {
      title: DEFAULT_PAGE_TITLE,
      description: DEFAULT_PAGE_DESCRIPTION,
      ...customOverride,
    };
  }

  const config = ROUTE_METADATA_MAP[route];

  return {
    title: config?.title ?? DEFAULT_PAGE_TITLE,
    description: config?.description ?? DEFAULT_PAGE_DESCRIPTION,
    ...customOverride,
  };
}
