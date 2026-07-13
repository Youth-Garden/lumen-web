'use client';

import React from 'react';
import { useDictationMaterials } from '@/features/dictation/hooks/use-dictation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@/shared/utils';

export const DictationList = () => {
  const router = useRouter();

  const { data: materialsResponse, isLoading } = useDictationMaterials();

  if (isLoading) {
    return <div className="p-8 text-center">Loading dictation lessons...</div>;
  }

  const materials = materialsResponse?.data || [];

  if (!materials.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No dictation lessons available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <Card
          key={material.id}
          className="hover:shadow-lg transition-all group"
        >
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/5 text-primary">
                {material.tags?.[0] || 'General'}
              </span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {material.level || 'A1'}
              </span>
            </div>
            <CardTitle className="line-clamp-2">{material.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {material.description ||
                'Practice your listening and spelling skills with this audio.'}
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
              <Button
                onClick={() =>
                  router.push(formatUrl(RouteEnum.DICTATION_EXERCISE, { id: material.id }))
                }
                className="w-full group-hover:bg-primary/90"
              >
                Start Practicing
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
