import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useMemo } from 'react';
import { Icons } from './index';
import { registry } from './registry';

const allIconNames = Object.keys(registry).sort();

const meta = {
  title: 'UI/Icons',
  component: Icons,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    name: 'vocabulary',
    size: 24,
  },
  argTypes: {
    name: {
      control: 'select',
      options: allIconNames,
      description: 'Name of the icon in the registry',
    },
    size: {
      control: { type: 'range', min: 12, max: 96, step: 4 },
      description: 'Icon pixel size',
    },
    color: {
      control: 'color',
      description: 'Custom color for the icon',
    },
  },
} satisfies Meta<typeof Icons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  name: 'All Icons',
  args: {
    name: 'vocabulary',
  },
  render: () => {
    const [search, setSearch] = useState('');
    const [iconSize, setIconSize] = useState(24);
    const [copiedName, setCopiedName] = useState<string | null>(null);

    const filteredIcons = useMemo(() => {
      const q = search.trim().toLowerCase();
      if (!q) return allIconNames;
      return allIconNames.filter((name) => name.toLowerCase().includes(q));
    }, [search]);

    const handleCopy = (name: string) => {
      navigator.clipboard.writeText(`<Icons name="${name}" />`);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 1600);
    };

    return (
      <div className="space-y-6 w-full max-w-6xl mx-auto p-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Lumen Icons Registry
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All {allIconNames.length} registered system icons. Click any icon
              to copy JSX code.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full h-9 pl-3 pr-8 rounded-xl bg-card border border-border/60 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Size Slider */}
            <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground">
              <span>Size:</span>
              <input
                type="range"
                min="16"
                max="48"
                step="4"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-20 cursor-pointer accent-primary"
              />
              <span className="w-8 text-foreground font-mono text-right">
                {iconSize}px
              </span>
            </div>
          </div>
        </div>

        {/* Count Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong>{filteredIcons.length}</strong> of{' '}
            {allIconNames.length} icons
          </span>
          {copiedName && (
            <span className="text-primary font-semibold animate-pulse">
              ✓ Copied JSX: &lt;Icons name=&quot;{copiedName}&quot; /&gt;
            </span>
          )}
        </div>

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredIcons.map((name) => {
              const isCopied = copiedName === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCopy(name)}
                  className={`group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-card border transition-all duration-200 cursor-pointer text-center outline-none ${
                    isCopied
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : 'border-border/40 hover:border-border/80 hover:bg-muted/30 hover:shadow-xs'
                  }`}
                  title={`Click to copy <Icons name="${name}" />`}
                >
                  <div
                    className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110 text-foreground group-hover:text-primary"
                    style={{ height: Math.max(iconSize, 36) }}
                  >
                    <Icons name={name} size={iconSize} />
                  </div>

                  <span className="mt-2 text-[11px] font-mono text-muted-foreground group-hover:text-foreground line-clamp-1 w-full truncate">
                    {name}
                  </span>

                  {isCopied && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
                      Copied!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No icons matching &quot;{search}&quot;
          </div>
        )}
      </div>
    );
  },
};

export const SingleIcon: Story = {
  name: 'Single Icon',
  args: {
    name: 'vocabulary',
    size: 48,
  },
};

export const PlantStages: Story = {
  name: 'Plant Stages',
  args: {
    name: 'plant-growth',
  },
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Plant Growth Stages (FSRS / Spaced Repetition)
        </h3>
        <p className="text-xs text-muted-foreground">
          Visual progression of vocabulary memory maturity across Spaced
          Repetition stages.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 p-6 rounded-3xl bg-card border border-border/40">
        {[0, 1, 2, 3, 4, 5].map((stg) => (
          <div key={stg} className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-muted/40">
              <Icons name="plant-growth" stage={stg} size={36} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              Stage {stg}
            </span>
          </div>
        ))}

        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
            <Icons name="plant-growth" isWilted size={36} />
          </div>
          <span className="text-xs font-semibold text-rose-500">
            Wilted
          </span>
        </div>
      </div>
    </div>
  ),
};

export const SocialAndFlags: Story = {
  name: 'Social & Flags',
  args: {
    name: 'google',
  },
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Brand, Social & Country Flags
        </h3>
        <p className="text-xs text-muted-foreground">
          Custom SVG icons for third-party platforms and language country flags.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-6 rounded-3xl bg-card border border-border/40">
        {(['google', 'github', 'twitter', 'youtube', 'flag-vn', 'flag-us', 'flag-jp'] as const).map(
          (name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/30 border border-border/30 min-w-[80px]"
            >
              <Icons name={name} size={32} />
              <span className="text-xs font-mono text-muted-foreground">
                {name}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  ),
};
