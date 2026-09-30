import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer } from '@/shared/components/chart/chart-container';
import { ChartTooltip } from '@/shared/components/chart/chart-tooltip';
import { CHART_MARGIN, TRANSLATION_NAMESPACE } from '../constants';
import { ChartDayItem, StudyStats } from '../types/weekly-study-chart.types';
import {
  formatDuration,
  getBarOpacity,
} from '../utils/weekly-study-chart.utils';
import { StudyChartTooltip } from './study-chart-tooltip';

interface TargetReferenceLabelProps {
  viewBox?: { x?: number; y?: number; width?: number };
  goal: number;
}

function TargetReferenceLabel({ viewBox, goal }: TargetReferenceLabelProps) {
  if (
    !viewBox ||
    viewBox.x === undefined ||
    viewBox.y === undefined ||
    viewBox.width === undefined
  ) {
    return null;
  }

  const badgeWidth = 44;
  const badgeHeight = 18;
  const posX = viewBox.x + viewBox.width - badgeWidth - 2;
  const posY = viewBox.y - badgeHeight / 2;

  return (
    <g transform={`translate(${posX}, ${posY})`}>
      <rect
        width={badgeWidth}
        height={badgeHeight}
        rx={9}
        fill="var(--card)"
        stroke="var(--primary)"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <circle cx={9} cy={badgeHeight / 2} r={2.5} fill="var(--primary)" />
      <text
        x={25}
        y={badgeHeight / 2 + 3.5}
        textAnchor="middle"
        fill="var(--primary)"
        fontSize={10}
        fontWeight={700}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {goal}m
      </text>
    </g>
  );
}

interface DayTickProps {
  x?: number | string;
  y?: number | string;
  item?: ChartDayItem;
  showTodayDot: boolean;
}

function DayTick({ x = 0, y = 0, item, showTodayDot }: DayTickProps) {
  if (!item?.tickLabel) return <g />;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill={item.isToday ? 'var(--primary)' : 'var(--muted-foreground)'}
        fontSize={showTodayDot ? 11 : 10}
        fontWeight={item.isToday ? 700 : 500}
      >
        {item.tickLabel}
      </text>
      {item.isToday && showTodayDot && (
        <circle cx={0} cy={22} r={2} fill="var(--primary)" />
      )}
    </g>
  );
}

interface BarValueLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

function renderBarValueLabel({
  x = 0,
  y = 0,
  width = 0,
  value,
}: BarValueLabelProps) {
  if (value === undefined || value === null) return null;
  const isZero = value === 0;

  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill={isZero ? 'var(--muted-foreground)' : 'var(--foreground)'}
      textAnchor="middle"
      fontSize={isZero ? 10 : 11}
      fontWeight={isZero ? 500 : 700}
      opacity={isZero ? 0.45 : 1}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {value}m
    </text>
  );
}

interface StudyBarChartProps {
  data: ChartDayItem[];
  stats: StudyStats;
  goal: number;
  isWeekView: boolean;
}

export function StudyBarChart({
  data,
  stats,
  goal,
  isWeekView,
}: StudyBarChartProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const hasActivity = stats.totalMinutes > 0;

  return (
    <div
      role="img"
      aria-label={t('chartAriaLabel', {
        total: formatDuration(stats.totalMinutes),
        average: formatDuration(stats.avgMinutes),
        met: stats.metCount,
        count: data.length,
      })}
      className="relative h-64 w-full pt-2"
    >
      <ChartContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            vertical={false}
            horizontal={true}
            stroke="var(--border)"
            strokeOpacity={0.6}
          />

          <XAxis
            dataKey="dateStr"
            axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.6 }}
            tickLine={false}
            interval={0}
            tick={({ x, y, index }) => (
              <DayTick
                x={x}
                y={y}
                item={data[index]}
                showTodayDot={isWeekView}
              />
            )}
          />

          <YAxis
            domain={[0, stats.yDomainMax]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value: number) => `${value}m`}
            allowDecimals={false}
          />

          <ChartTooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.4, radius: 6 }}
            content={({ active, payload }) => (
              <StudyChartTooltip
                active={active}
                payload={payload}
                goal={goal}
              />
            )}
          />

          {/* Soft ambient glow layer for target line */}
          <ReferenceLine
            y={goal}
            stroke="var(--primary)"
            strokeWidth={5}
            strokeOpacity={0.12}
            strokeDasharray="6 4"
            ifOverflow="extendDomain"
          />

          {/* Crisp, professional dashed target line with pill badge */}
          <ReferenceLine
            y={goal}
            stroke="var(--primary)"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="5 4"
            ifOverflow="extendDomain"
            label={({ viewBox }) => (
              <TargetReferenceLabel viewBox={viewBox} goal={goal} />
            )}
          />

          <Bar
            dataKey="minutes"
            radius={[8, 8, 3, 3]}
            barSize={isWeekView ? 70 : 30}
          >
            {isWeekView && (
              <LabelList dataKey="minutes" content={renderBarValueLabel} />
            )}

            {data.map((day) => (
              <Cell
                key={day.dateStr}
                fill="var(--primary)"
                fillOpacity={getBarOpacity(day)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {!hasActivity && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8 text-sm text-muted-foreground">
          {t('noActivityYet')}
        </p>
      )}
    </div>
  );
}
