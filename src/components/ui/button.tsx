import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  't-label inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-3 text-center btn-motion disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // plum with gold label on ivory; gold with plum label on plum
        primary: 'bg-cta text-on-cta hover:bg-plum-700 [.theme-dark_&]:hover:bg-gold-400',
        secondary: 'border-[1.5px] border-accent bg-transparent text-accent hover:bg-accent/10',
        whatsapp: 'bg-peacock-green text-white hover:bg-peacock-green/90',
      },
      size: {
        default: '',
        sm: 'min-h-11 px-4 py-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
