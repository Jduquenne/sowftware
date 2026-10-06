import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'info' | 'link' | 'link-danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-forest-700 text-white shadow-sm hover:bg-forest-800',
  secondary: 'border border-line bg-white text-forest-900 hover:bg-cream',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
  info: 'bg-water-600 text-white shadow-sm hover:bg-water-700',
  link: 'font-semibold text-forest-600 hover:text-forest-800',
  'link-danger': 'font-semibold text-red-600 hover:text-red-700',
}

const LINK_VARIANTS: ButtonVariant[] = ['link', 'link-danger']

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'gap-2 rounded-xl px-4 py-2 text-sm',
  sm: 'gap-1.5 rounded-lg px-2.5 py-1 text-xs',
}

const LINK_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'gap-1.5 text-sm',
  sm: 'gap-1 text-xs',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const isLink = LINK_VARIANTS.includes(variant)
  const sizeClass = isLink ? LINK_SIZE_CLASSES[size] : SIZE_CLASSES[size]
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
    />
  )
}
