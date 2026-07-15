import { useSearchParams } from 'react-router-dom'

export function useSearchParamState<T extends string>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = (searchParams.get(key) as T) ?? defaultValue

  const setValue = (next: T) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (next === defaultValue) params.delete(key)
      else params.set(key, next)
      return params
    })
  }

  return [value, setValue]
}
