import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'info' | 'link' | 'link-danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-green-800 text-white',
  secondary: 'bg-neutral-100 text-neutral-600',
  danger: 'text-red-600',
  info: 'bg-blue-700 text-white',
  link: 'text-green-800',
  'link-danger': 'text-red-600',
}

const LINK_VARIANTS: ButtonVariant[] = ['link', 'link-danger']

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-3 py-1.5 text-sm',
  sm: 'px-2 py-1 text-xs',
}

const LINK_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'text-sm',
  sm: 'text-xs',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const isLink = LINK_VARIANTS.includes(variant)
  const sizeClass = isLink ? LINK_SIZE_CLASSES[size] : SIZE_CLASSES[size]
  return (
    <button
      type="button"
      {...props}
      className={`${isLink ? '' : 'rounded'} ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
    />
  )
}
