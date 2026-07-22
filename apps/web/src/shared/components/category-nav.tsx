'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { CefrLevelEnum } from '@/shared/types';

export interface CategoryDef {
  value: string;
  labelKey: string;
  icon?: string;
}

interface CategoryNavProps {
  categories: CategoryDef[];
  searchPlaceholder?: string;
  filterByLevelLabel?: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string | undefined) => void;
  onCefrLevelChange?: (level: string | undefined) => void;
  showLevelFilter?: boolean;
}

export function CategoryNav({
  categories,
  searchPlaceholder = 'Search...',
  filterByLevelLabel = 'Filter by Level',
  onSearchChange,
  onCategoryChange,
  onCefrLevelChange,
  showLevelFilter = true,
}: CategoryNavProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [activeCefrLevel, setActiveCefrLevel] = useState<string | undefined>(undefined);
  const [isLevelFilterOpen, setIsLevelFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleCategoryClick = (categoryValue: string | undefined) => {
    setActiveCategory(categoryValue);
    onCategoryChange(categoryValue);
  };

  const handleCefrClick = (level: string | undefined) => {
    setActiveCefrLevel(level);
    if (onCefrLevelChange) onCefrLevelChange(level);
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search box */}
      <div className="relative max-w-md">
        <Icons
          name="search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="pl-10 pr-9 rounded-full bg-card/60 backdrop-blur-sm border-border/80 focus-visible:border-primary/50 focus-visible:ring-primary/20 shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Icons name="close" className="h-3.5 w-3.5" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryClick(undefined)}
          className={`relative h-8 px-4 text-xs font-semibold rounded-full transition-all duration-200 ${
            activeCategory === undefined
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <motion.button
              key={cat.value}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => handleCategoryClick(cat.value)}
              className={`relative h-8 px-4 text-xs font-semibold rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
              }`}
            >
              {cat.labelKey}
            </motion.button>
          );
        })}

        {/* Level filter toggle */}
        {showLevelFilter && onCefrLevelChange && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 ml-auto gap-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full px-3"
            onClick={() => setIsLevelFilterOpen((prev) => !prev)}
          >
            <Icons name="filter" className="h-3.5 w-3.5 text-primary" />
            {filterByLevelLabel}
            <Icons
              name={isLevelFilterOpen ? 'chevron-up' : 'chevron-down'}
              className="h-3 w-3"
            />
          </Button>
        )}
      </div>

      {/* Collapsible level filter */}
      <AnimatePresence>
        {isLevelFilterOpen && showLevelFilter && onCefrLevelChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-1 px-3 rounded-2xl bg-muted/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mr-1.5">
                CEFR:
              </span>
              <button
                type="button"
                onClick={() => handleCefrClick(undefined)}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-all ${
                  activeCefrLevel === undefined
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                All Levels
              </button>
              {Object.values(CefrLevelEnum).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleCefrClick(level)}
                  className={`h-7 px-3 rounded-full text-xs font-medium transition-all ${
                    activeCefrLevel === level
                      ? 'bg-primary/15 text-primary font-semibold ring-1 ring-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
