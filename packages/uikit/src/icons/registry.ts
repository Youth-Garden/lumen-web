import { lazy } from 'react';
import { CommandIcon } from './svgs/command-icon';
import { SunIcon } from './svgs/sun-icon';
import { MoonIcon } from './svgs/moon-icon';

export const registry = {
  home: lazy(() => import('./svgs').then((mod) => ({ default: mod.HomeIcon }))),
  cardiology: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CardiologyIcon })),
  ),
  check: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CheckIcon })),
  ),
  'check-circle': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CheckCircleIcon })),
  ),
  close: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CloseIcon })),
  ),
  'close-circle': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CloseCircleIcon })),
  ),
  'chevron-down': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ChevronDownIcon })),
  ),
  'chevron-up': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ChevronUpIcon })),
  ),
  'chevron-right': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ChevronRightIcon })),
  ),
  'chevron-left': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ChevronLeftIcon })),
  ),
  search: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.SearchIcon })),
  ),
  info: lazy(() => import('./svgs').then((mod) => ({ default: mod.InfoIcon }))),
  danger: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.DangerIcon })),
  ),
  more: lazy(() => import('./svgs').then((mod) => ({ default: mod.MoreIcon }))),
  'arrow-left': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ArrowLeftIcon })),
  ),
  bell: lazy(() => import('./svgs').then((mod) => ({ default: mod.BellIcon }))),
  'book-open': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.BookOpenIcon })),
  ),
  clock: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ClockIcon })),
  ),
  command: CommandIcon,
  flame: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.FlameIcon })),
  ),
  headphones: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.HeadphonesIcon })),
  ),
  'loader-2': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.Loader2Icon })),
  ),
  plus: lazy(() => import('./svgs').then((mod) => ({ default: mod.PlusIcon }))),
  settings: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.SettingsIcon })),
  ),
  shield: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ShieldIcon })),
  ),
  'trash-2': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.Trash2Icon })),
  ),
  trophy: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.TrophyIcon })),
  ),
  user: lazy(() => import('./svgs').then((mod) => ({ default: mod.UserIcon }))),
  'volume-2': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.Volume2Icon })),
  ),
  'layout-dashboard': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.LayoutDashboardIcon })),
  ),
  users: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.UsersIcon })),
  ),
  'pie-chart': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.PieChartIcon })),
  ),
  'credit-card': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CreditCardIcon })),
  ),
  'log-out': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.LogOutIcon })),
  ),
  book: lazy(() => import('./svgs').then((mod) => ({ default: mod.BookIcon }))),
  layers: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.LayersIcon })),
  ),
  brain: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.BrainIcon })),
  ),
  'file-question': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.FileQuestionIcon })),
  ),
  newspaper: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.NewspaperIcon })),
  ),
  mic: lazy(() => import('./svgs').then((mod) => ({ default: mod.MicIcon }))),
  'file-text': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.FileTextIcon })),
  ),
  'book-marked': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.BookMarkedIcon })),
  ),
  pause: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.PauseIcon })),
  ),
  play: lazy(() => import('./svgs').then((mod) => ({ default: mod.PlayIcon }))),
  'rotate-ccw': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.RotateCcwIcon })),
  ),
  'x-circle': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.XCircleIcon })),
  ),
  'arrow-right': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ArrowRightIcon })),
  ),
  zap: lazy(() => import('./svgs').then((mod) => ({ default: mod.ZapIcon }))),
  tag: lazy(() => import('./svgs').then((mod) => ({ default: mod.TagIcon }))),
  languages: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.LanguagesIcon })),
  ),
  'bar-chart': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.BarChartIcon })),
  ),
  flag: lazy(() => import('./svgs').then((mod) => ({ default: mod.FlagIcon }))),
  filter: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.FilterIcon })),
  ),
  save: lazy(() => import('./svgs').then((mod) => ({ default: mod.SaveIcon }))),
  edit: lazy(() => import('./svgs').then((mod) => ({ default: mod.EditIcon }))),
  'pen-tool': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.PenToolIcon })),
  ),
  ban: lazy(() => import('./svgs').then((mod) => ({ default: mod.BanIcon }))),
  upload: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.UploadIcon })),
  ),
  'shield-check': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ShieldCheckIcon })),
  ),
  mail: lazy(() => import('./svgs').then((mod) => ({ default: mod.MailIcon }))),
  lock: lazy(() => import('./svgs').then((mod) => ({ default: mod.LockIcon }))),
  activity: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ActivityIcon })),
  ),
  bold: lazy(() => import('./svgs').then((mod) => ({ default: mod.BoldIcon }))),
  italic: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ItalicIcon })),
  ),
  strikethrough: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.StrikethroughIcon })),
  ),
  'heading-2': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.Heading2Icon })),
  ),
  list: lazy(() => import('./svgs').then((mod) => ({ default: mod.ListIcon }))),
  quote: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.QuoteIcon })),
  ),
  link: lazy(() => import('./svgs').then((mod) => ({ default: mod.LinkIcon }))),
  image: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ImageIcon })),
  ),
  undo: lazy(() => import('./svgs').then((mod) => ({ default: mod.UndoIcon }))),
  redo: lazy(() => import('./svgs').then((mod) => ({ default: mod.RedoIcon }))),
  'list-ordered': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.ListOrderedIcon })),
  ),
  menu: lazy(() => import('./svgs').then((mod) => ({ default: mod.MenuIcon }))),
  eye: lazy(() => import('./svgs').then((mod) => ({ default: mod.EyeIcon }))),
  'eye-off': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.EyeOffIcon })),
  ),
  sun: SunIcon,
  moon: MoonIcon,
  'panel-left-close': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.PanelLeftCloseIcon })),
  ),
  'panel-left-open': lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.PanelLeftOpenIcon })),
  ),
  overview: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.OverviewIcon })),
  ),
  study: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.StudyIcon })),
  ),
  quiz: lazy(() => import('./svgs').then((mod) => ({ default: mod.QuizIcon }))),
  vocabulary: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.VocabularyIcon })),
  ),
  deck: lazy(() => import('./svgs').then((mod) => ({ default: mod.DeckIcon }))),
  google: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.GoogleIcon })),
  ),
} as const;

export type IconName = keyof typeof registry;
