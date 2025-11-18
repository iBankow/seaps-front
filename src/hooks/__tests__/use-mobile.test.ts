import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIsMobile } from '../use-mobile'

// Mock window.matchMedia
const mockMatchMedia = vi.fn()

describe('useIsMobile', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return false for desktop width', () => {
    const mockMQL = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMQL)
    
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('should return true for mobile width', () => {
    const mockMQL = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMQL)
    
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 600,
    })

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should respond to media query changes', () => {
    const mockMQL = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMQL)

    // Start with desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    
    // Simulate media query change to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 600,
    })

    // Simulate the change event
    const changeHandler = mockMQL.addEventListener.mock.calls.find(
      call => call[0] === 'change'
    )?.[1]

    if (changeHandler) {
      act(() => {
        changeHandler()
      })
    }

    expect(result.current).toBe(true)
  })

  it('should clean up event listener on unmount', () => {
    const mockMQL = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMQL)

    const { unmount } = renderHook(() => useIsMobile())
    
    expect(mockMQL.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    
    unmount()
    
    expect(mockMQL.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle undefined initial state', () => {
    const mockMQL = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMQL)

    // Start with desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    
    // Should return false (converted from undefined with !!)
    expect(typeof result.current).toBe('boolean')
    expect(result.current).toBe(false)
  })
})
