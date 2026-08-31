import * as LucideIcons from 'lucide-react';
import type { ComponentType } from 'react';
import { GoogleIcon } from './svgs/google-icon';
import type { IconProps } from './types';

export const customRegistry: Record<
  string,
  ComponentType<IconProps> | ComponentType<any>
> = {
  // Navigation & Structure
  home: LucideIcons.Home,
  'layout-dashboard': LucideIcons.LayoutDashboard,
  menu: LucideIcons.Menu,
  'panel-left-close': LucideIcons.PanelLeftClose,
  'panel-left-open': LucideIcons.PanelLeftOpen,
  overview: LucideIcons.LayoutDashboard,

  // Actions
  check: LucideIcons.Check,
  'check-circle': LucideIcons.CheckCircle2,
  close: LucideIcons.X,
  'close-circle': LucideIcons.XCircle,
  plus: LucideIcons.Plus,
  'trash-2': LucideIcons.Trash2,
  edit: LucideIcons.Pencil,
  save: LucideIcons.Save,
  upload: LucideIcons.Upload,
  filter: LucideIcons.Filter,
  search: LucideIcons.Search,
  ban: LucideIcons.Ban,
  'rotate-ccw': LucideIcons.RotateCcw,
  'x-circle': LucideIcons.XCircle,
  'pen-tool': LucideIcons.PenTool,
  undo: LucideIcons.Undo,
  redo: LucideIcons.Redo,
  link: LucideIcons.Link,
  image: LucideIcons.Image,

  // Chevrons & Arrows
  'chevron-down': LucideIcons.ChevronDown,
  'chevron-up': LucideIcons.ChevronUp,
  'chevron-right': LucideIcons.ChevronRight,
  'chevron-left': LucideIcons.ChevronLeft,
  'arrow-left': LucideIcons.ArrowLeft,
  'arrow-right': LucideIcons.ArrowRight,

  // Status & Feedback
  info: LucideIcons.Info,
  danger: LucideIcons.AlertTriangle,
  star: LucideIcons.Star,
  'loader-2': LucideIcons.Loader2,
  activity: LucideIcons.Activity,
  zap: LucideIcons.Zap,
  flag: LucideIcons.Flag,

  // Media & Audio
  play: LucideIcons.Play,
  pause: LucideIcons.Pause,
  square: LucideIcons.Square,
  'volume-2': LucideIcons.Volume2,
  headphones: LucideIcons.Headphones,
  mic: LucideIcons.Mic,
  'mic-off': LucideIcons.MicOff,

  // Notifications & Communication
  bell: LucideIcons.Bell,
  mail: LucideIcons.Mail,
  send: LucideIcons.Send,

  // Content & Reading
  'book-open': LucideIcons.BookOpen,
  book: LucideIcons.Book,
  'book-marked': LucideIcons.Bookmark,
  newspaper: LucideIcons.Newspaper,
  'file-text': LucideIcons.FileText,
  'file-question': LucideIcons.FileQuestion,
  layers: LucideIcons.Layers,
  tag: LucideIcons.Tag,
  languages: LucideIcons.Languages,

  // Charts & Analytics
  'bar-chart': LucideIcons.BarChart3,
  'pie-chart': LucideIcons.PieChart,

  // Users & Identity
  user: LucideIcons.User,
  users: LucideIcons.Users,
  shield: LucideIcons.Shield,
  'shield-check': LucideIcons.ShieldCheck,
  lock: LucideIcons.Lock,

  // Commerce
  'credit-card': LucideIcons.CreditCard,

  // Learning & Education
  study: LucideIcons.GraduationCap,
  quiz: LucideIcons.HelpCircle,
  vocabulary: LucideIcons.BookType,
  deck: LucideIcons.Layers,
  brain: LucideIcons.Brain,
  trophy: LucideIcons.Trophy,
  award: LucideIcons.Award,
  flame: LucideIcons.Flame,
  clock: LucideIcons.Clock,
  cardiology: LucideIcons.HeartPulse,

  // Rich Text Editor
  bold: LucideIcons.Bold,
  italic: LucideIcons.Italic,
  strikethrough: LucideIcons.Strikethrough,
  'heading-2': LucideIcons.Heading2,
  list: LucideIcons.List,
  'list-ordered': LucideIcons.ListOrdered,
  quote: LucideIcons.Quote,

  // Visibility
  eye: LucideIcons.Eye,
  'eye-off': LucideIcons.EyeOff,

  // System
  settings: LucideIcons.Settings,
  'log-out': LucideIcons.LogOut,
  more: LucideIcons.MoreHorizontal,

  // Theme & Brand
  sun: LucideIcons.Sun,
  moon: LucideIcons.Moon,
  command: LucideIcons.Command,
  google: GoogleIcon,
};

export function registerIcon(name: string, component: ComponentType<any>) {
  customRegistry[name] = component;
}

export type CustomIconName = keyof typeof customRegistry;
