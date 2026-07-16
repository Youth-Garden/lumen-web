# @lumen/utils

Shared utility functions, formatting tools, and constants used across Lumen's frontend applications.

## Features
- **String Formatting**: Dates, currency, capitalization.
- **Tailwind Merge**: `cn()` utility for merging tailwind classes with `clsx` and `tailwind-merge`.
- **Validation**: Common validation schemas and regex.

## Usage

```tsx
import { cn } from '@lumen/utils';

const className = cn('bg-blue-500', isHovered && 'bg-blue-600');
```
