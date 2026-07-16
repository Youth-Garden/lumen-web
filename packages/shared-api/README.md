# @lumen/shared-api

A shared package that contains all API bindings, Axios interceptors, endpoints, and Data Transfer Objects (DTOs) for communicating with the Lumen Backend.

## Features
- **Axios Configuration**: Configured base instances with request/response interceptors for handling authentication tokens and errors.
- **API Endpoints**: Strongly-typed enums and paths mapping to backend routes.
- **Response Models**: TypeScript interfaces defining backend responses to ensure type safety across frontend applications.

## Usage

```tsx
import { authService } from '@lumen/shared-api';

const handleLogin = async () => {
  const data = await authService.login({ email, password });
  console.log(data);
};
```
