'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface RadarChartData {
  subject: string;
  value: number;
  fullMark: number;
  [key: string]: any;
}

export interface RadarChartProps {
  data: RadarChartData[];
  dataKey?: string;
  nameKey?: string;
  fillColor?: string;
  strokeColor?: string;
  fillOpacity?: number;
  height?: number | string;
  tooltipFormatter?: (value: number, name: string, props: any) => React.ReactNode[];
}

export const RadarChart = ({
  data,
  dataKey = 'value',
  nameKey = 'subject',
  fillColor = 'hsl(var(--primary))',
  strokeColor = 'hsl(var(--primary))',
  fillOpacity = 0.4,
  height = '100%',
  tooltipFormatter,
}: RadarChartProps) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey={nameKey} 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Performance"
            dataKey={dataKey}
            stroke={strokeColor}
            fill={fillColor}
            fillOpacity={fillOpacity}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--card-foreground))'
            }}
            formatter={tooltipFormatter || ((value: number) => [`${value}%`, 'Score'])}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
