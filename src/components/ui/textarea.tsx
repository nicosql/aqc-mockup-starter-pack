import { cn } from '@/lib/shadcn'
import * as React from 'react'

const Textarea = ({
  className,
  ref,
  ...props
}: React.ComponentProps<'textarea'>) => (
  <textarea
    ref={ref}
    className={cn(
      'border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-lg border-2 px-3 py-2 text-sm font-hand shadow-[2px_2px_0_0_hsl(var(--foreground)/0.06)] focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:opacity-50 transition-shadow focus-visible:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.1)] md:text-sm',
      className
    )}
    {...props}
  />
)
Textarea.displayName = 'Textarea'

export { Textarea }
