import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendValue: number;
  icon: string;
}

export function MetricCard({
  title,
  value,
  trend,
  trendValue,
  icon,
}: MetricCardProps) {
  const isPositive = trendValue >= 0;

  return (
    <Card className="hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icons name={icon as any} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span
            className={cn(
              'font-medium mr-1',
              isPositive ? 'text-emerald-500' : 'text-destructive',
            )}
          >
            {isPositive ? '+' : ''}
            {trendValue}%
          </span>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
