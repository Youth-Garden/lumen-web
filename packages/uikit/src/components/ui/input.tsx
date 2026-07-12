import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { Icons } from '@lumen/uikit/icons';
import { Button } from './button';

import { cn } from '@lumen/uikit/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-lg border border-transparent bg-muted/40 px-3 py-2 text-sm transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 focus:bg-white dark:focus:bg-input/50',
        className,
      )}
      {...props}
    />
  );
}

export interface PasswordInputProps extends React.ComponentProps<
  typeof Input
> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="text"
          size="none"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-0 top-0 h-full px-3 py-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <Icons name="eye-off" className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Icons name="eye" className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { Input, PasswordInput };
