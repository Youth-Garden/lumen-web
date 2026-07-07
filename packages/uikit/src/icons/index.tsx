import React from 'react';
import { registry, type IconName } from './registry';
import type { IconProps } from './types';

export interface IconsProps extends IconProps {
  name: IconName;
}

export function Icons({ name, ...props }: IconsProps) {
  const Icon = registry[name];

  if (!Icon) {
    console.warn(`Icons: Icon "${name}" not found in registry`);
    return null;
  }

  return (
    <React.Suspense fallback={<div style={{ width: props.size || 24, height: props.size || 24 }} />}>
      <Icon {...props} />
    </React.Suspense>
  );
}
