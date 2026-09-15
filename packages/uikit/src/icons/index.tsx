import React from 'react';
import * as LucideIcons from 'lucide-react';
import { registry, registerIcon, type IconRegistryName } from './registry';
import type { IconProps } from './types';

function toPascalCase(str: string): string {
  return str
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export type IconName = IconRegistryName | (string & {});

export interface IconsProps extends IconProps {
  name: IconName;
}

export function Icons({
  name,
  size = 24,
  className,
  color,
  strokeWidth,
  style,
  ...props
}: IconsProps) {
  let IconComponent: React.ComponentType<any> | undefined = registry[name];

  if (!IconComponent) {
    const pascalName = toPascalCase(name);
    const catalog = LucideIcons as unknown as Record<
      string,
      React.ComponentType<any>
    >;
    IconComponent = catalog[name] || catalog[pascalName];
  }

  if (!IconComponent) {
    console.warn(`Icons: Icon "${name}" not found in registry or lucide-react`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      {...props}
    />
  );
}

export { registerIcon };
export type { IconProps, IconComponent } from './types';
