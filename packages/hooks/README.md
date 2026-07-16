# @lumen/hooks

A collection of shared React hooks used across Lumen's frontend applications.

## Usage

```tsx
import { useAuth } from '@lumen/hooks';

export function Component() {
  const { user, login } = useAuth();
  // ...
}
```

These hooks encapsulate common business logic, state management, and side-effects to keep components clean and maintainable.
