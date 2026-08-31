export interface SystemDeck {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Exam' | 'Business' | 'Conversation';
  cardCount: number;
  badgeColor: string;
  iconName: string;
  isSystem: true;
}

export const SYSTEM_DECKS: SystemDeck[] = [
  {
    id: 'sys-oxford-3000',
    name: 'Oxford 3000 Core Vocabulary',
    description: 'The 3,000 most important words to learn in English from A1 to B2 level.',
    category: 'Core',
    cardCount: 3000,
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    iconName: 'book',
    isSystem: true,
  },
  {
    id: 'sys-toeic-600',
    name: 'TOEIC 600 Essential Words',
    description: 'High-frequency vocabulary required for achieving 750+ on the TOEIC exam.',
    category: 'Exam',
    cardCount: 600,
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    iconName: 'headphones',
    isSystem: true,
  },
  {
    id: 'sys-ielts-high-freq',
    name: 'IELTS Academic High-Frequency',
    description: 'Band 7.0+ Academic word list with collocations, synonyms, and context sentences.',
    category: 'Exam',
    cardCount: 850,
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    iconName: 'book-open',
    isSystem: true,
  },
  {
    id: 'sys-daily-conversation',
    name: 'Everyday English Expressions',
    description: 'Common idioms, phrasal verbs, and daily conversational phrases.',
    category: 'Conversation',
    cardCount: 450,
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    iconName: 'mic',
    isSystem: true,
  },
];
