import { lazy } from 'react';

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
  'arrow-left': lazy(() => import('./svgs').then((mod) => ({ default: mod.ArrowLeftIcon }))),
  'bell': lazy(() => import('./svgs').then((mod) => ({ default: mod.BellIcon }))),
  'book-open': lazy(() => import('./svgs').then((mod) => ({ default: mod.BookOpenIcon }))),
  'clock': lazy(() => import('./svgs').then((mod) => ({ default: mod.ClockIcon }))),
  'command': lazy(() => import('./svgs').then((mod) => ({ default: mod.CommandIcon }))),
  'flame': lazy(() => import('./svgs').then((mod) => ({ default: mod.FlameIcon }))),
  'headphones': lazy(() => import('./svgs').then((mod) => ({ default: mod.HeadphonesIcon }))),
  'loader-2': lazy(() => import('./svgs').then((mod) => ({ default: mod.Loader2Icon }))),
  'plus': lazy(() => import('./svgs').then((mod) => ({ default: mod.PlusIcon }))),
  'settings': lazy(() => import('./svgs').then((mod) => ({ default: mod.SettingsIcon }))),
  'shield': lazy(() => import('./svgs').then((mod) => ({ default: mod.ShieldIcon }))),
  'trash-2': lazy(() => import('./svgs').then((mod) => ({ default: mod.Trash2Icon }))),
  'trophy': lazy(() => import('./svgs').then((mod) => ({ default: mod.TrophyIcon }))),
  'user': lazy(() => import('./svgs').then((mod) => ({ default: mod.UserIcon }))),
  'volume-2': lazy(() => import('./svgs').then((mod) => ({ default: mod.Volume2Icon }))),
  'layout-dashboard': lazy(() => import('./svgs').then((mod) => ({ default: mod.LayoutDashboardIcon }))),
  'users': lazy(() => import('./svgs').then((mod) => ({ default: mod.UsersIcon }))),
  'pie-chart': lazy(() => import('./svgs').then((mod) => ({ default: mod.PieChartIcon }))),
  'credit-card': lazy(() => import('./svgs').then((mod) => ({ default: mod.CreditCardIcon }))),
  'log-out': lazy(() => import('./svgs').then((mod) => ({ default: mod.LogOutIcon }))),
  'book': lazy(() => import('./svgs').then((mod) => ({ default: mod.BookIcon }))),
  'layers': lazy(() => import('./svgs').then((mod) => ({ default: mod.LayersIcon }))),
  'brain': lazy(() => import('./svgs').then((mod) => ({ default: mod.BrainIcon }))),
  'file-question': lazy(() => import('./svgs').then((mod) => ({ default: mod.FileQuestionIcon }))),
  'newspaper': lazy(() => import('./svgs').then((mod) => ({ default: mod.NewspaperIcon }))),
  'mic': lazy(() => import('./svgs').then((mod) => ({ default: mod.MicIcon }))),
  'file-text': lazy(() => import('./svgs').then((mod) => ({ default: mod.FileTextIcon }))),
  'book-marked': lazy(() => import('./svgs').then((mod) => ({ default: mod.BookMarkedIcon }))),
  'pause': lazy(() => import('./svgs').then((mod) => ({ default: mod.PauseIcon }))),
  'play': lazy(() => import('./svgs').then((mod) => ({ default: mod.PlayIcon }))),
  'rotate-ccw': lazy(() => import('./svgs').then((mod) => ({ default: mod.RotateCcwIcon }))),
  'x-circle': lazy(() => import('./svgs').then((mod) => ({ default: mod.XCircleIcon }))),
  'arrow-right': lazy(() => import('./svgs').then((mod) => ({ default: mod.ArrowRightIcon }))),
  'zap': lazy(() => import('./svgs').then((mod) => ({ default: mod.ZapIcon }))),
  'tag': lazy(() => import('./svgs').then((mod) => ({ default: mod.TagIcon }))),
  'languages': lazy(() => import('./svgs').then((mod) => ({ default: mod.LanguagesIcon }))),
  'bar-chart': lazy(() => import('./svgs').then((mod) => ({ default: mod.BarChartIcon }))),
  'flag': lazy(() => import('./svgs').then((mod) => ({ default: mod.FlagIcon }))),
  'filter': lazy(() => import('./svgs').then((mod) => ({ default: mod.FilterIcon }))),
  'save': lazy(() => import('./svgs').then((mod) => ({ default: mod.SaveIcon }))),
} as const;

export type IconName = keyof typeof registry;
