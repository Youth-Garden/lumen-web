import { createMaterialIcon } from './material-icon';
import { CommandIcon } from './svgs/command-icon';
import { GoogleIcon } from './svgs/google-icon';
import { MoonIcon } from './svgs/moon-icon';
import { SunIcon } from './svgs/sun-icon';

export const registry = {
  // ── Navigation & Structure ──────────────────────────────────────────
  home: createMaterialIcon('home'),
  'layout-dashboard': createMaterialIcon('dashboard'),
  menu: createMaterialIcon('menu'),
  'panel-left-close': createMaterialIcon('left_panel_close'),
  'panel-left-open': createMaterialIcon('left_panel_open'),
  overview: createMaterialIcon('overview'),

  // ── Actions ─────────────────────────────────────────────────────────
  check: createMaterialIcon('check'),
  'check-circle': createMaterialIcon('check_circle'),
  close: createMaterialIcon('close'),
  'close-circle': createMaterialIcon('cancel'),
  plus: createMaterialIcon('add'),
  'trash-2': createMaterialIcon('delete'),
  edit: createMaterialIcon('edit'),
  save: createMaterialIcon('save'),
  upload: createMaterialIcon('upload'),
  filter: createMaterialIcon('filter_list'),
  search: createMaterialIcon('search'),
  ban: createMaterialIcon('block'),
  'rotate-ccw': createMaterialIcon('undo'),
  'x-circle': createMaterialIcon('cancel'),
  'pen-tool': createMaterialIcon('draw'),
  undo: createMaterialIcon('undo'),
  redo: createMaterialIcon('redo'),
  link: createMaterialIcon('link'),
  image: createMaterialIcon('image'),

  // ── Chevrons & Arrows ────────────────────────────────────────────────
  'chevron-down': createMaterialIcon('keyboard_arrow_down'),
  'chevron-up': createMaterialIcon('keyboard_arrow_up'),
  'chevron-right': createMaterialIcon('keyboard_arrow_right'),
  'chevron-left': createMaterialIcon('keyboard_arrow_left'),
  'arrow-left': createMaterialIcon('arrow_back'),
  'arrow-right': createMaterialIcon('arrow_forward'),

  // ── Status & Feedback ────────────────────────────────────────────────
  info: createMaterialIcon('info'),
  danger: createMaterialIcon('warning'),
  'loader-2': createMaterialIcon('progress_activity'),
  activity: createMaterialIcon('monitor_heart'),
  zap: createMaterialIcon('bolt'),
  flag: createMaterialIcon('flag'),

  // ── Media & Audio ────────────────────────────────────────────────────
  play: createMaterialIcon('play_arrow'),
  pause: createMaterialIcon('pause'),
  square: createMaterialIcon('stop'),
  'volume-2': createMaterialIcon('volume_up'),
  headphones: createMaterialIcon('headphones'),
  mic: createMaterialIcon('mic'),
  'mic-off': createMaterialIcon('mic_off'),

  // ── Notifications & Communication ───────────────────────────────────
  bell: createMaterialIcon('notifications'),
  mail: createMaterialIcon('mail'),
  send: createMaterialIcon('send'),

  // ── Content & Reading ────────────────────────────────────────────────
  'book-open': createMaterialIcon('menu_book'),
  book: createMaterialIcon('book'),
  'book-marked': createMaterialIcon('bookmark'),
  newspaper: createMaterialIcon('newspaper'),
  'file-text': createMaterialIcon('description'),
  'file-question': createMaterialIcon('quiz'),
  layers: createMaterialIcon('layers'),
  tag: createMaterialIcon('label'),
  languages: createMaterialIcon('translate'),

  // ── Charts & Analytics ───────────────────────────────────────────────
  'bar-chart': createMaterialIcon('bar_chart'),
  'pie-chart': createMaterialIcon('pie_chart'),

  // ── Users & Identity ─────────────────────────────────────────────────
  user: createMaterialIcon('person'),
  users: createMaterialIcon('group'),
  shield: createMaterialIcon('security'),
  'shield-check': createMaterialIcon('verified_user'),
  lock: createMaterialIcon('lock'),

  // ── Commerce ─────────────────────────────────────────────────────────
  'credit-card': createMaterialIcon('credit_card'),

  // ── Learning & Education ─────────────────────────────────────────────
  study: createMaterialIcon('school'),
  quiz: createMaterialIcon('quiz'),
  vocabulary: createMaterialIcon('spellcheck'),
  deck: createMaterialIcon('style'),
  brain: createMaterialIcon('neurology'),
  trophy: createMaterialIcon('emoji_events'),
  award: createMaterialIcon('military_tech'),
  flame: createMaterialIcon('local_fire_department'),
  clock: createMaterialIcon('schedule'),
  cardiology: createMaterialIcon('cardiology'),

  // ── Rich Text Editor ─────────────────────────────────────────────────
  bold: createMaterialIcon('format_bold'),
  italic: createMaterialIcon('format_italic'),
  strikethrough: createMaterialIcon('format_strikethrough'),
  'heading-2': createMaterialIcon('format_h2'),
  list: createMaterialIcon('format_list_bulleted'),
  'list-ordered': createMaterialIcon('format_list_numbered'),
  quote: createMaterialIcon('format_quote'),

  // ── Visibility ───────────────────────────────────────────────────────
  eye: createMaterialIcon('visibility'),
  'eye-off': createMaterialIcon('visibility_off'),

  // ── System ───────────────────────────────────────────────────────────
  settings: createMaterialIcon('settings'),
  'log-out': createMaterialIcon('logout'),
  more: createMaterialIcon('more_horiz'),

  // ── Theme ────────────────────────────────────────────────────────────
  sun: SunIcon,
  moon: MoonIcon,

  // ── Brand / Special (keep original SVGs — no Material equivalent) ────
  google: GoogleIcon,
  command: CommandIcon,
} as const;

export type IconName = keyof typeof registry;
