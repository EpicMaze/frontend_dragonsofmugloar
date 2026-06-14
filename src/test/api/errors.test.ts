import { describe, it, expect } from 'vitest'
import { AxiosError } from 'axios'
import { axiosToApiError, responseToApiError, isApiError } from '@/api/errors'

const makeAxiosError = (status: number, data: unknown): AxiosError => {
  const error = new AxiosError('Request failed')
  error.response = { status, data, headers: {}, config: {} as never, statusText: '' }
  return error
}

describe('axiosToApiError', () => {
  it('extracts status and message from data.message', () => {
    const error = makeAxiosError(400, { message: 'Bad request' })
    const result = axiosToApiError(error)
    expect(result).toEqual({
      message: 'Bad request',
      status: 400,
      details: { message: 'Bad request' },
    })
  })

  it('falls back to axios message when data has no message field', () => {
    const error = makeAxiosError(500, { error: 'something' })
    const result = axiosToApiError(error)
    expect(result.message).toBe('Request failed')
    expect(result.status).toBe(500)
  })

  it('falls back to axios message when data.message is non-string', () => {
    const error = makeAxiosError(422, { message: 42 })
    const result = axiosToApiError(error)
    expect(result.message).toBe('Request failed')
  })

  it('returns status 0 when no response', () => {
    const error = new AxiosError('Network Error')
    const result = axiosToApiError(error)
    expect(result.status).toBe(0)
    expect(result.message).toBe('Network Error')
  })

  it('handles plain Error', () => {
    const result = axiosToApiError(new Error('plain error'))
    expect(result).toEqual({ message: 'plain error', status: 0, details: null })
  })

  it('handles unknown thrown string', () => {
    const result = axiosToApiError('something weird')
    expect(result.message).toBe('something weird')
    expect(result.status).toBe(0)
  })

  it('handles null', () => {
    const result = axiosToApiError(null)
    expect(result.message).toBe('Unknown error')
  })
})

describe('responseToApiError', () => {
  it('extracts message from response data', () => {
    const response = {
      status: 410,
      data: { message: 'Game over' },
      headers: {},
      config: {} as never,
      statusText: '',
    }
    const result = responseToApiError(response)
    expect(result).toEqual({ message: 'Game over', status: 410, details: { message: 'Game over' } })
  })

  it('falls back to default message when data has no message', () => {
    const response = { status: 404, data: {}, headers: {}, config: {} as never, statusText: '' }
    const result = responseToApiError(response)
    expect(result.message).toBe('Invalid server response')
    expect(result.status).toBe(404)
  })
})

describe('isApiError', () => {
  it('returns true for valid ApiError shape', () => {
    expect(isApiError({ message: 'err', status: 400 })).toBe(true)
  })

  it('returns false for plain Error', () => {
    expect(isApiError(new Error('nope'))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isApiError(null)).toBe(false)
  })

  it('returns false when status missing', () => {
    expect(isApiError({ message: 'err' })).toBe(false)
  })

  it('returns false when message missing', () => {
    expect(isApiError({ status: 400 })).toBe(false)
  })
})
