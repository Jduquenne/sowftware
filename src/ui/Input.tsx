import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const CONTROL_CLASS =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-forest-950 placeholder:text-neutral-400 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 focus:outline-none'

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL_CLASS} ${className}`} />
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${CONTROL_CLASS} ${className}`} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL_CLASS} ${className}`} />
}
