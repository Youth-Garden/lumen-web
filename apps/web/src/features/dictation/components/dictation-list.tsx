'use client';

import { useState, useMemo } from 'react';
import { useDictationMaterials } from '@/features/dictation/hooks/use-dictation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { CategoryNav, type CategoryDef } from '@/shared/components/category-nav';

export const DictationList = () => {
  const t = useTranslations('Dictation');
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const { data: materialsResponse, isLoading } = useDictationMaterials();
  const allMaterials = useMemo(() => materialsResponse?.data ?? [], [materialsResponse?.data]);

  const categories: CategoryDef[] = useMemo(() => {
    const tagSet = new Set<string>();
    allMaterials.forEach((material) => {
      material.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).map((tag) => ({ value: tag, labelKey: tag }));
  }, [allMaterials]);

  const filteredMaterials = useMemo(() => {
    return allMaterials.filter((material) => {
      const matchesSearch =
        !search ||
        material.title.toLowerCase().includes(search.toLowerCase()) ||
        (material.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !activeCategory || material.tags?.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [allMaterials, search, activeCategory]);

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {allMaterials.length > 0 && (
        <CategoryNav
          categories={categories}
          searchPlaceholder={t('dailyDictation.searchPlaceholder')}
          onSearchChange={setSearch}
          onCategoryChange={setActiveCategory}
          showLevelFilter={false}
        />
      )}

      {filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
          <Icons name="headphones" className="h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground font-medium">
            {allMaterials.length === 0
              ? t('dailyDictation.noLessons')
              : 'No lessons match your filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:shadow-lg transition-all group cursor-pointer border rounded-2xl"
              onClick={() =>
                router.push(
                  formatUrl(RouteEnum.DICTATION_EXERCISE, { id: material.id }),
                )
              }
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/5 text-primary border-primary/20">
                    {material.tags?.[0] ?? 'General'}
                  </span>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {material.level ?? 'A1'}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {material.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {material.description ?? 'Practice your listening and spelling skills with this audio.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center gap-1">
                      <Icons name="headphones" className="w-4 h-4" />
                      <span>Audio</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons name="clock" className="w-4 h-4" />
                      <span>~5 mins</span>
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-primary/90" onClick={(e) => {
                    e.stopPropagation();
                    router.push(formatUrl(RouteEnum.DICTATION_EXERCISE, { id: material.id }));
                  }}>
                    {t('dailyDictation.startPracticing')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
