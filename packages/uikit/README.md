# @lumen/uikit

The centralized Design System and UI Component library for Lumen.

## Overview

This package provides a strict, reusable set of React components that adhere strictly to the Lumen Design System (Minimal Single Column, Bold typography, High Contrast). 

It utilizes:
- **Tailwind CSS** for styling and utility classes.
- **Base-UI & Radix Primitives** for unstyled, accessible component foundations.
- **Lucide Icons** for SVG iconography.
- **Framer Motion** for micro-animations and transitions.

## Usage

```tsx
import { Button, Card, Input } from '@lumen/uikit/components';

export function Example() {
  return (
    <Card>
      <Input placeholder="Enter value" />
      <Button>Submit</Button>
    </Card>
  );
}
```

Components in this package should remain purely presentational and devoid of application-specific business logic.
