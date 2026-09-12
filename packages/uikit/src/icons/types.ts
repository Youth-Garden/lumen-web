import type { SVGProps, CSSProperties, ComponentType } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'style'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  viewBox?: string;
  style?: CSSProperties;
  testID?: string;
  variant?: 'bold' | 'linear';
  stage?: number;
  isWilted?: boolean;
}

export type IconComponent = ComponentType<IconProps>;
