'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface BarChartProps {
  data: BarChartData[];
  dataKey?: string;
  nameKey?: string;
  fillColor?: string;
  height?: number | string;
  showGrid?: boolean;
  tooltipFormatter?: (value: number, name: string, props: any) => React.ReactNode[];
}

export const BarChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  fillColor = 'hsl(var(--primary))',
  height = '100%',
  showGrid = true,
  tooltipFormatter,
}: BarChartProps) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
          )}
          <XAxis
            dataKey={nameKey}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              boxShadow:
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
            formatter={tooltipFormatter || ((value: number) => [value, 'Value'])}
          />
          <Bar
            dataKey={dataKey}
            fill={fillColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
