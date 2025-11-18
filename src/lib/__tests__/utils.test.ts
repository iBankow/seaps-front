import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cn, getFirstAndLastName, toUpperCase, debounce, states } from '../utils'

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toContain('class1')
      expect(cn('class1', 'class2')).toContain('class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toContain('base')
      expect(cn('base', true && 'conditional')).toContain('conditional')
      expect(cn('base', false && 'conditional')).not.toContain('conditional')
    })

    it('should handle empty and undefined values', () => {
      const result = cn('base', '', undefined, null, 'valid')
      expect(result).toContain('base')
      expect(result).toContain('valid')
    })

    it('should merge conflicting Tailwind classes', () => {
      // This tests tailwind-merge functionality
      const result = cn('p-4', 'p-2')
      expect(result).toBe('p-2')
    })
  })

  describe('getFirstAndLastName', () => {
    it('should return first and last name for multiple names', () => {
      expect(getFirstAndLastName('João Silva Santos')).toBe('João Santos')
      expect(getFirstAndLastName('Maria José da Silva')).toBe('Maria Silva')
      expect(getFirstAndLastName('Pedro Paulo Santos Junior')).toBe('Pedro Junior')
    })

    it('should return only name for single name', () => {
      expect(getFirstAndLastName('João')).toBe('João')
    })

    it('should handle empty or undefined input', () => {
      expect(getFirstAndLastName('')).toBe('--')
      expect(getFirstAndLastName(undefined)).toBe('--')
    })

    it('should handle names with extra spaces', () => {
      expect(getFirstAndLastName('  João   Silva   Santos  ')).toBe('João Santos')
      expect(getFirstAndLastName('João     Silva')).toBe('João Silva')
    })

    it('should handle two names', () => {
      expect(getFirstAndLastName('João Silva')).toBe('João Silva')
    })
  })

  describe('toUpperCase', () => {
    it('should convert input value to uppercase', () => {
      const mockEvent = {
        target: {
          value: 'hello world'
        }
      } as React.ChangeEvent<HTMLInputElement>

      const result = toUpperCase(mockEvent)
      
      expect(result.target.value).toBe('HELLO WORLD')
      expect(result).toBe(mockEvent) // Should return the same event object
    })

    it('should handle already uppercase text', () => {
      const mockEvent = {
        target: {
          value: 'ALREADY UPPERCASE'
        }
      } as React.ChangeEvent<HTMLInputElement>

      const result = toUpperCase(mockEvent)
      
      expect(result.target.value).toBe('ALREADY UPPERCASE')
    })

    it('should handle mixed case text', () => {
      const mockEvent = {
        target: {
          value: 'MiXeD CaSe TeXt'
        }
      } as React.ChangeEvent<HTMLInputElement>

      const result = toUpperCase(mockEvent)
      
      expect(result.target.value).toBe('MIXED CASE TEXT')
    })

    it('should handle empty string', () => {
      const mockEvent = {
        target: {
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>

      const result = toUpperCase(mockEvent)
      
      expect(result.target.value).toBe('')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      // Call multiple times
      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()

      // Fast-forward time by 99ms
      vi.advanceTimersByTime(99)
      expect(mockFn).not.toHaveBeenCalled()

      // Fast-forward by 1ms more (total 100ms)
      vi.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenLastCalledWith('arg3')
    })

    it('should handle multiple arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('arg1', 'arg2', 123)

      vi.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
    })

    it('should reset timeout on subsequent calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      vi.advanceTimersByTime(50)

      debouncedFn('second')
      vi.advanceTimersByTime(50)

      // First call should not execute since it was cancelled
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)

      // Second call should execute
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('second')
    })
  })

  describe('states', () => {
    it('should contain all Brazilian states', () => {
      expect(states).toHaveLength(27) // 26 states + DF
    })

    it('should have correct structure for each state', () => {
      states.forEach(state => {
        expect(state).toHaveProperty('acronym')
        expect(state).toHaveProperty('name')
        expect(typeof state.acronym).toBe('string')
        expect(typeof state.name).toBe('string')
        expect(state.acronym.length).toBeGreaterThan(0)
        expect(state.name.length).toBeGreaterThan(0)
      })
    })

    it('should include specific states', () => {
      const acronyms = states.map(state => state.acronym)
      
      expect(acronyms).toContain('SP')
      expect(acronyms).toContain('RJ')
      expect(acronyms).toContain('MG')
      expect(acronyms).toContain('RS')
      expect(acronyms).toContain('PR')
      expect(acronyms).toContain('SC')
      expect(acronyms).toContain('DF')
      expect(acronyms).toContain('MT')
    })

    it('should have unique acronyms', () => {
      const acronyms = states.map(state => state.acronym)
      const uniqueAcronyms = [...new Set(acronyms)]
      
      expect(acronyms).toHaveLength(uniqueAcronyms.length)
    })

    it('should have São Paulo state with correct data', () => {
      const sp = states.find(state => state.acronym === 'SP')
      expect(sp).toBeDefined()
      expect(sp?.name).toBe('São Paulo')
    })

    it('should have Mato Grosso state with correct data', () => {
      const mt = states.find(state => state.acronym === 'MT')
      expect(mt).toBeDefined()
      expect(mt?.name).toBe('Mato Grosso')
    })
  })
})
