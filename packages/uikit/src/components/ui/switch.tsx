'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@lumen/uikit/utils';

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'group/switch peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none select-none disabled:cursor-not-allowed disabled:opacity-50',
        'bg-slate-200 data-checked:bg-primary dark:bg-slate-700 dark:data-checked:bg-primary',
        'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out',
          'data-checked:translate-x-5 data-unchecked:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
