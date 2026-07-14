import React from 'react';
import type { IconProps } from './types';

/**
 * Extracts a numeric pixel size from Tailwind size classes like "h-4 w-4", "h-5 w-5", etc.
 * Falls back to the `size` prop or 24px default.
 */
function extractSizeFromClassName(
  className: string | undefined,
  size: number | string | undefined,
): number {
  if (className) {
    const match = className.match(/\bh-(\d+(?:\.\d+)?)\b/);
    if (match) {
      return Math.round(parseFloat(match[1]) * 4);
    }
  }
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) return parsed;
  }
  return 24;
}

/**
 * Creates a React component backed by a Material Symbols Rounded icon.
 * Accepts the standard `IconProps` interface but renders a font-based icon
 * instead of an SVG element. SVG-specific props (viewBox, etc.) are ignored.
 */
export function createMaterialIcon(symbol: string) {
  const MaterialIcon = ({
    size,
    className,
    style,
    testID,
    // Intentionally unused SVG-specific props
    color: _color,
    viewBox: _viewBox,
    variant: _variant,
    onClick,
    // Ignore all other SVG event/attribute props
    ...rest
  }: IconProps) => {
    void rest; // prevent unused variable warning
    const fontSize = extractSizeFromClassName(className, size);

    return (
      <span
        className={`material-symbols-rounded${className ? ` ${className}` : ''}`}
        style={{
          fontSize,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          flexShrink: 0,
          ...style,
        }}
        data-testid={testID}
        aria-hidden="true"
        onClick={
          onClick as unknown as
            React.MouseEventHandler<HTMLSpanElement> | undefined
        }
      >
        {symbol}
      </span>
    );
  };

  MaterialIcon.displayName = `MaterialIcon(${symbol})`;
  return MaterialIcon;
}
