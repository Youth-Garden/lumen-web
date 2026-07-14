'use client';

import { BarChart, BarChartData } from '@/shared/components/charts/bar-chart';
import { useMemo } from 'react';

export interface XpProgressChartProps {
  data: { date: string; xp: number }[];
}

export function XpProgressChart({ data }: XpProgressChartProps) {
  // Format dates for display
  const formattedData: BarChartData[] = useMemo(() => {
    return data.map((item) => {
      const d = new Date(item.date);
      return {
        ...item,
        name: d.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., 'Mon', 'Tue'
        value: item.xp,
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        No learning data available for the last 7 days.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full pt-4">
      <BarChart
        data={formattedData}
        tooltipFormatter={(value: number) => [value, 'XP']}
      />
    </div>
  );
}
