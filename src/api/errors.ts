import { AxiosError, isAxiosError, type AxiosResponse } from 'axios'
import type { ApiError } from './types'

const getErrorMsg = (data: unknown, fallback: string): string => {
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as Record<string, unknown>).message === 'string'
  ) {
    return (data as Record<string, unknown>).message as string
  }
  return fallback
}

export const axiosToApiError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const ax = error as AxiosError
    const status = ax.response?.status ?? 0
    const data = ax.response?.data ?? null

    const message = getErrorMsg(data, ax.message)
    return { message, status, details: data }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
      details: null,
    }
  }

  return { message: String(error ?? 'Unknown error'), status: 0, details: null }
}

export const responseToApiError = (response: AxiosResponse): ApiError => {
  const data = response?.data
  const message = getErrorMsg(data, 'Invalid server response')

  return {
    message,
    status: response?.status ?? 0,
    details: data ?? null,
  }
}
