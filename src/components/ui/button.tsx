import { cn } from '@/lib/shadcn'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'cursor-pointer inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 text-sm font-medium font-hand ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground border-primary/80 shadow-[2px_2px_0_0_hsl(var(--foreground)/0.15)] hover:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.2)] hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground border-destructive/80 shadow-[2px_2px_0_0_hsl(var(--foreground)/0.15)] hover:bg-destructive/90',
        outline:
          'border-border bg-background shadow-[2px_2px_0_0_hsl(var(--foreground)/0.08)] hover:bg-accent hover:text-accent-foreground hover:shadow-[3px_3px_0_0_hsl(var(--foreground)/0.12)]',
        secondary:
          'bg-secondary text-secondary-foreground border-border shadow-[2px_2px_0_0_hsl(var(--foreground)/0.08)] hover:bg-secondary/80',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
        link: 'border-transparent text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3',
        lg: 'h-12 rounded-lg px-8',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
Button.displayName = 'Button'

export { Button, buttonVariants }
