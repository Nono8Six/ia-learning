import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/components/ui/use-toast';

// Ensure useFakeTimers for controlling setTimeout

describe('useToast removal', () => {
  it('removes dismissed toast after delay', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());

    let created;
    act(() => {
      created = toast({ title: 'test' });
    });

    // Toast should be added
    expect(result.current.toasts.length).toBe(1);

    act(() => {
      created.dismiss();
    });

    // After dismissal but before timer, toast still present
    expect(result.current.toasts.length).toBe(1);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.toasts.length).toBe(0);
    vi.useRealTimers();
  });
});
