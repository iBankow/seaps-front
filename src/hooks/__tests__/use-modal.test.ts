import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useModal } from '../use-modal'

describe('useModal', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useModal())
    
    expect(result.current.visible).toBe(false)
    expect(result.current.index).toBe(0)
  })

  it('should initialize with custom default visible state', () => {
    const { result } = renderHook(() => useModal(true))
    
    expect(result.current.visible).toBe(true)
    expect(result.current.index).toBe(0)
  })

  it('should show modal', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.show()
    })
    
    expect(result.current.visible).toBe(true)
  })

  it('should hide modal and reset index', () => {
    const { result } = renderHook(() => useModal(true))
    
    // Set index to non-zero value
    act(() => {
      result.current.showIndex(5)
    })
    
    expect(result.current.visible).toBe(true)
    expect(result.current.index).toBe(5)
    
    // Hide modal
    act(() => {
      result.current.hide()
    })
    
    expect(result.current.visible).toBe(false)
    expect(result.current.index).toBe(0)
  })

  it('should show modal with specific index', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.showIndex(3)
    })
    
    expect(result.current.visible).toBe(true)
    expect(result.current.index).toBe(3)
  })

  it('should toggle modal visibility', () => {
    const { result } = renderHook(() => useModal())
    
    // Initially false, toggle should make it true
    act(() => {
      result.current.toggle(undefined)
    })
    
    expect(result.current.visible).toBe(true)
    
    // Toggle again should make it false
    act(() => {
      result.current.toggle(undefined)
    })
    
    expect(result.current.visible).toBe(false)
  })

  it('should toggle with explicit value', () => {
    const { result } = renderHook(() => useModal())
    
    // Set to true explicitly
    act(() => {
      result.current.toggle(true)
    })
    
    expect(result.current.visible).toBe(true)
    
    // Set to false explicitly
    act(() => {
      result.current.toggle(false)
    })
    
    expect(result.current.visible).toBe(false)
  })

  it('should handle toggle with truthy values', () => {
    const { result } = renderHook(() => useModal())
    
    // Test with truthy value
    act(() => {
      result.current.toggle('truthy string')
    })
    
    expect(result.current.visible).toBe('truthy string')
    
    // Test with falsy value
    act(() => {
      result.current.toggle(0)
    })
    
    expect(result.current.visible).toBe(0)
  })

  it('should provide all expected methods and properties', () => {
    const { result } = renderHook(() => useModal())
    
    expect(typeof result.current.show).toBe('function')
    expect(typeof result.current.hide).toBe('function')
    expect(typeof result.current.showIndex).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
    expect(typeof result.current.visible).toBe('boolean')
    expect(typeof result.current.index).toBe('number')
  })

  it('should maintain independent state for multiple instances', () => {
    const { result: modal1 } = renderHook(() => useModal())
    const { result: modal2 } = renderHook(() => useModal(true))
    
    expect(modal1.current.visible).toBe(false)
    expect(modal2.current.visible).toBe(true)
    
    act(() => {
      modal1.current.show()
    })
    
    expect(modal1.current.visible).toBe(true)
    expect(modal2.current.visible).toBe(true) // Should remain unchanged
    
    act(() => {
      modal2.current.hide()
    })
    
    expect(modal1.current.visible).toBe(true) // Should remain unchanged
    expect(modal2.current.visible).toBe(false)
  })
})
