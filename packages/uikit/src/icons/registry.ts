import { lazy } from 'react';

export const registry = {
  home: lazy(() => import('./svgs').then((mod) => ({ default: mod.HomeIcon }))),
  cardiology: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CardiologyIcon })),
  ),
  check: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CheckIcon })),
  ),
  close: lazy(() =>
    import('./svgs').then((mod) => ({ default: mod.CloseIcon })),
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
} as const;

export type IconName = keyof typeof registry;
