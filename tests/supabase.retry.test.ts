import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({}))
}))

const env = process.env

beforeEach(() => {
  vi.resetModules()
  process.env = { ...env, NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon' }
})

afterEach(() => {
  process.env = env
  vi.restoreAllMocks()
  // cleanup navigator/window mocks
  delete (global as any).window
  delete (global as any).navigator
})

describe('classifyError', () => {
  it('maps offline scenario to NETWORK_ERROR', async () => {
    const mod = await import('../lib/supabase')
    ;(global as any).window = {}
    Object.defineProperty(global, 'navigator', { value: { onLine: false }, writable: true, configurable: true })
    const result = mod.classifyError(new Error('offline'))
    expect(result).toBe(mod.SupabaseErrorType.NETWORK_ERROR)
  })

  it('maps aborted requests to NETWORK_ERROR', async () => {
    const mod = await import('../lib/supabase')
    const err = new TypeError('Failed to fetch')
    const result = mod.classifyError(err)
    expect(result).toBe(mod.SupabaseErrorType.NETWORK_ERROR)
  })

  it('maps HTTP 5xx to SERVER_ERROR', async () => {
    const mod = await import('../lib/supabase')
    const result = mod.classifyError({ status: 503 })
    expect(result).toBe(mod.SupabaseErrorType.SERVER_ERROR)
  })
})

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retries with exponential backoff on failure and eventually succeeds', async () => {
    const mod = await import('../lib/supabase')
    const fn = vi.fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce({ status: 503 })
      .mockResolvedValue('ok')

    const timeout = vi.spyOn(global, 'setTimeout')

    const promise = mod.withRetry(fn, 3)
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
    expect(timeout.mock.calls[0][1]).toBeGreaterThanOrEqual(1000)
    expect(timeout.mock.calls[1][1]).toBeGreaterThanOrEqual(2000)
  })

  it('stops retrying on AUTH_ERROR', async () => {
    const mod = await import('../lib/supabase')
    const fn = vi.fn().mockRejectedValue({ status: 401 })

    await expect(mod.withRetry(fn, 3)).rejects.toBeDefined()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries when offline and eventually fails after max retries', async () => {
    const mod = await import('../lib/supabase')
    ;(global as any).window = {}
    Object.defineProperty(global, 'navigator', { value: { onLine: false }, writable: true, configurable: true })

    const fn = vi.fn().mockRejectedValue(new Error('offline'))
    const promise = mod.withRetry(fn, 1).catch(e => e)

    await vi.runAllTimersAsync()
    await promise
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
