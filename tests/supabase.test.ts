import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const env = process.env

beforeEach(() => {
  vi.resetModules()
  process.env = { ...env, NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon' }
})

afterEach(() => {
  process.env = env
  vi.restoreAllMocks()
})

describe('checkConnection', () => {
  it('returns online when fetch succeeds', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    const mod = await import('../lib/supabase')
    const result = await mod.checkConnection()
    expect(result).toEqual({ online: true })
    expect(mod.connectionStatus.online).toBe(true)
  })

  it('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const mod = await import('../lib/supabase')
    const result = await mod.checkConnection()
    expect(result.online).toBe(false)
    expect(result.error.type).toBe(mod.SupabaseErrorType.NETWORK_ERROR)
  })
})

describe('testSupabaseConnection', () => {
  it('fails when connection check fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const mod = await import('../lib/supabase')
    const res = await mod.testSupabaseConnection()
    expect(res.success).toBe(false)
    expect(res.message).toMatch('Failed to connect to Supabase API')
  })

  it('fails when database query errors', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    const mod = await import('../lib/supabase')
    vi.spyOn(mod, 'checkConnection').mockResolvedValue({ online: true })
    // mock database call
    mod.supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'db error', code: 'PGRST', hint: null, details: 'bad' }, status: 400 })
    })
    const res = await mod.testSupabaseConnection()
    expect(res.success).toBe(false)
    expect(res.message).toMatch('database query failed')
  })

  it('succeeds when connection and query succeed', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    const mod = await import('../lib/supabase')
    vi.spyOn(mod, 'checkConnection').mockResolvedValue({ online: true })
    mod.supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null, status: 200 })
    })
    const res = await mod.testSupabaseConnection()
    expect(res.success).toBe(true)
  })
})
