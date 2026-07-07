import type { SVGProps, CSSProperties } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'style'> {
  size?: number | string;
  color?: string;
  viewBox?: string;
  style?: CSSProperties;
  testID?: string;
  variant?: 'bold' | 'linear';
}

export type IconComponent = React.ComponentType<IconProps>;
