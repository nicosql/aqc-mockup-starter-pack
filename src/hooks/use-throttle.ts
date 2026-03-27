import { useCallback, useRef, useState } from 'react'

/**
 * Returns a `[throttledFn, isPending]` tuple.
 * The function can only fire once every `limitMs` milliseconds.
 * `isPending` is true while the returned promise is in-flight.
 */
export function useThrottle<A extends unknown[], R>(
  callback: (...args: A) => R | Promise<R>,
  limitMs = 2000
): [(...args: A) => Promise<R | undefined>, boolean] {
  const lastRan = useRef(0)
  const [isPending, setIsPending] = useState(false)

  const throttled = useCallback(
    async (...args: A): Promise<R | undefined> => {
      const now = Date.now()
      if (now - lastRan.current < limitMs) return undefined
      lastRan.current = now
      setIsPending(true)
      try {
        return await callback(...args)
      } finally {
        setIsPending(false)
      }
    },
    [callback, limitMs]
  )

  return [throttled, isPending]
}
