import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-white tw-transition-colors tw-focus-visible:outline-none tw-focus-visible:ring-2 tw-focus-visible:ring-slate-950 tw-focus-visible:ring-offset-2 tw-disabled:pointer-events-none tw-disabled:opacity-50 dark:tw-ring-offset-slate-950 dark:tw-focus-visible:ring-slate-300",
          {
            'tw-bg-red-600 tw-text-slate-50 tw-hover:bg-red-600/90 dark:tw-bg-red-900 dark:tw-text-slate-50 dark:tw-hover:bg-red-900/90': variant === 'default',
            'tw-bg-slate-100 tw-text-slate-900 tw-hover:bg-slate-100/80 dark:tw-bg-slate-800 dark:tw-text-slate-50 dark:tw-hover:bg-slate-800/80': variant === 'secondary',
            'tw-border tw-border-slate-200 tw-bg-white tw-hover:bg-slate-100 tw-hover:text-slate-900 dark:tw-border-slate-800 dark:tw-bg-slate-950 dark:tw-hover:bg-slate-800 dark:tw-hover:text-slate-50': variant === 'outline',
            'tw-hover:bg-slate-100 tw-hover:text-slate-900 dark:tw-hover:bg-slate-800 dark:tw-hover:text-slate-50': variant === 'ghost',
            'tw-bg-red-500 tw-text-slate-50 tw-hover:bg-red-500/90 dark:tw-bg-red-900 dark:tw-text-slate-50 dark:tw-hover:bg-red-900/90': variant === 'destructive',
            'tw-text-slate-900 tw-underline-offset-4 tw-hover:underline dark:tw-text-slate-50': variant === 'link',
            'tw-h-10 tw-px-4 tw-py-2': size === 'default',
            'tw-h-9 tw-rounded-md tw-px-3': size === 'sm',
            'tw-h-11 tw-rounded-md tw-px-8': size === 'lg',
            'tw-h-10 tw-w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
