'use client';

interface DailyGoalRingProps {
  completed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export function DailyGoalRing({
  completed = 15,
  target = 20,
  size = 120,
  strokeWidth = 10,
}: DailyGoalRingProps) {
  const percentage = Math.min(Math.round((completed / target) * 100), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-black text-foreground">{percentage}%</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {completed}/{target}
        </span>
      </div>
    </div>
  );
}
