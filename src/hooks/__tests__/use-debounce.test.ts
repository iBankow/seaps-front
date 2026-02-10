import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce callback execution', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebounce(callback, 500))
    
    // Call the debounced function multiple times
    act(() => {
      result.current.debouncedCallback('arg1')
      result.current.debouncedCallback('arg2')
      result.current.debouncedCallback('arg3')
    })
    
    // Callback should not be called immediately
    expect(callback).not.toHaveBeenCalled()
    
    // Fast-forward time by 499ms
    act(() => {
      vi.advanceTimersByTime(499)
    })
    
    // Callback should still not be called
    expect(callback).not.toHaveBeenCalled()
    
    // Fast-forward time by 1ms more (total 500ms)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    
    // Now callback should be called with the last arguments
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg3')
  })

  it('should cancel pending execution', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebounce(callback, 500))
    
    // Call the debounced function
    act(() => {
      result.current.debouncedCallback('test')
    })
    
    // Cancel the execution
    act(() => {
      result.current.cancel()
    })
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Callback should not be called
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle multiple arguments', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebounce(callback, 100))
    
    act(() => {
      result.current.debouncedCallback('arg1', 'arg2', 123)
    })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })

  it('should update when delay changes', () => {
    const callback = vi.fn()
    let delay = 500
    const { result, rerender } = renderHook(() => useDebounce(callback, delay))
    
    act(() => {
      result.current.debouncedCallback('test')
    })
    
    // Change delay and rerender
    delay = 1000
    rerender()
    
    // Clear any existing timer and call with new delay
    act(() => {
      result.current.cancel()
      result.current.debouncedCallback('test-new')
    })
    
    // The callback should not be called at 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(callback).not.toHaveBeenCalled()
    
    // The callback should be called at 1000ms with new delay
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(callback).toHaveBeenCalledWith('test-new')
  })
})
