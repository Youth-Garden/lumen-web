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
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeCategory === undefined ? 'default' : 'outline'}
          size="sm"
          className="h-8 rounded-full"
          onClick={() => handleCategoryClick(undefined)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <motion.div
            key={cat.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant={activeCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              className="h-8 rounded-full"
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.labelKey}
            </Button>
          </motion.div>
        ))}

        {/* Level filter toggle */}
        {showLevelFilter && onCefrLevelChange && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 ml-auto gap-1 text-muted-foreground"
            onClick={() => setIsLevelFilterOpen((prev) => !prev)}
          >
            <Icons name="filter" className="h-3.5 w-3.5" />
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
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 px-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-1">
                CEFR:
              </span>
              <Button
                variant={activeCefrLevel === undefined ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 rounded-full text-xs"
                onClick={() => handleCefrClick(undefined)}
              >
                All Levels
              </Button>
              {Object.values(CefrLevelEnum).map((level) => (
                <Button
                  key={level}
                  variant={activeCefrLevel === level ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 rounded-full text-xs"
                  onClick={() => handleCefrClick(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
