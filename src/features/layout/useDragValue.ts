import { useEffect, useState } from 'react'

export function useDragValue<T>(): [T | null, (value: T) => void] {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    const stop = () => setValue(null)
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])
  return [value, setValue]
}
