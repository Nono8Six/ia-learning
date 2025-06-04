import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logEvent, logError } from '@/error/logger';

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
  });

  it('sends log entry via fetch', async () => {
    await logEvent('info', 'test message', { foo: 'bar' });
    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/logs');
    const body = JSON.parse(options.body);
    expect(body.level).toBe('info');
    expect(body.message).toBe('test message');
    expect(body.details.foo).toBe('bar');
  });

  it('logError logs with level error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await logError(new Error('boom'));
    expect(spy).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
    spy.mockRestore();
  });
});
