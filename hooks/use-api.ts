import { useState, useEffect } from 'react'
import { ApiError } from '@/lib/api'

interface UseApiOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
        ? err.message
        : 'An unexpected error occurred'
      setError(errorMessage)
      options.onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, deps)

  const refetch = () => {
    fetchData()
  }

  return {
    data,
    loading,
    error,
    refetch,
  }
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: string, variables: TVariables) => void
  } = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(variables)
      options.onSuccess?.(result, variables)
      return result
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
        ? err.message
        : 'An unexpected error occurred'
      setError(errorMessage)
      options.onError?.(errorMessage, variables)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    mutate,
    loading,
    error,
  }
}