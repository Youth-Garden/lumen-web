import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@lumen/uikit/components';

export function StudyChartSkeleton() {
  return (
    <Card
      aria-busy="true"
      className="flex h-full flex-col justify-between overflow-hidden"
    >
      <CardHeader className="flex flex-col justify-between gap-3 pb-2 sm:flex-row sm:items-center">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-8 w-44 rounded-xl self-start sm:self-auto" />
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <Card
          variant="muted"
          size="sm"
          className="grid grid-cols-3 divide-x divide-border/50 py-3 rounded-2xl"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-0 space-y-1 px-3 sm:px-4">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          ))}
        </Card>

        <Skeleton className="h-64 w-full rounded-2xl" />
      </CardContent>
    </Card>
  );
}
