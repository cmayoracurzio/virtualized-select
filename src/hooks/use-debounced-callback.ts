import { useCallback, useEffect, useRef } from "react"

/**
 * A hook that returns a debounced version of the provided callback.
 * @param callback - The function to debounce (can be async).
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced function that can be called multiple times, but only
 *          executes the callback once no calls have been made for `delay` ms.
 */
export function useDebouncedCallback<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  callback: T,
  delay: number = 200
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const callbackRef = useRef<T>(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep track of the latest callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Create a debounced function using setTimeout
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      return new Promise<ReturnType<T>>((resolve, reject) => {
        // Clear any existing timer
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // Set a new timer that calls the latest callback
        timeoutRef.current = setTimeout(() => {
          try {
            const result = callbackRef.current(...args)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, delay)
      })
    },
    [delay]
  )

  // Clear the timeout if the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}
