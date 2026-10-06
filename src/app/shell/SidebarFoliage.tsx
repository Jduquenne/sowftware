export function SidebarFoliage({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <path d="M-6 200 C 40 150, 70 110, 132 64" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.55" />
      <path d="M58 46 C 80 40, 98 54, 96 78 C 74 80, 58 66, 58 46 Z" fill="currentColor" />
      <path d="M132 64 C 150 50, 176 52, 186 62 C 168 76, 146 76, 132 64 Z" fill="currentColor" />
      <path d="M72 128 C 92 118, 118 128, 124 146 C 100 152, 80 144, 72 128 Z" fill="currentColor" />
      <path d="M-10 150 C 14 150, 30 170, 28 196 C 6 192, -8 174, -10 150 Z" fill="currentColor" />
    </svg>
  )
}
