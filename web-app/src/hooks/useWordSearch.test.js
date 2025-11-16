import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWordSearch } from './useWordSearch'

describe('useWordSearch', () => {
  const mockWordVectors = {
    words: ['test', 'word', 'example'],
    vectors: [
      [1, 0, 0],
      [0.9, 0.1, 0],
      [0.1, 0.9, 0]
    ]
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useWordSearch('', mockWordVectors, false))
    
    expect(result.current.results).toEqual([])
    expect(result.current.error).toBe('')
    expect(result.current.selectedWord).toBe(null)
    expect(typeof result.current.setSelectedWord).toBe('function')
  })

  it('returns results when word is found', () => {
    const { result } = renderHook(() => useWordSearch('test', mockWordVectors, false))
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.error).toBe('')
    // Check input word is excluded from results
    expect(result.current.results.find(r => r.word === 'test')).toBeUndefined()
  })

  it('shows error when word not found', () => {
    const { result } = renderHook(() => useWordSearch('nonexistent', mockWordVectors, false))
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current.error).toBe('Word "nonexistent" not found in database')
    expect(result.current.results).toEqual([])
  })

  it('allows setting selectedWord', () => {
    const { result } = renderHook(() => useWordSearch('', mockWordVectors, false))
    
    act(() => {
      result.current.setSelectedWord('word')
    })
    expect(result.current.selectedWord).toBe('word')
    
    act(() => {
      result.current.setSelectedWord(null)
    })
    expect(result.current.selectedWord).toBe(null)
  })
})
