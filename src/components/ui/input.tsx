import { cn } from '@/lib/shadcn'
import * as React from 'react'

const Input = ({
  className,
  type,
  ref,
  ...props
}: React.ComponentProps<'input'>) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-9 w-full rounded-lg border-2 px-3 py-2 text-sm font-hand shadow-[2px_2px_0_0_hsl(var(--foreground)/0.06)] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:opacity-50 transition-shadow focus-visible:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.1)]',
      className
    )}
    {...props}
  />
)
Input.displayName = 'Input'

export { Input }
