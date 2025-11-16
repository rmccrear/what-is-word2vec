import { describe, it, expect } from 'vitest'
import { cosineSimilarity } from './cosineSimilarity'

describe('cosineSimilarity', () => {
  it('should return 1 for identical vectors', () => {
    const vec1 = [1, 2, 3, 4, 5]
    const vec2 = [1, 2, 3, 4, 5]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(1, 10)
  })

  it('should return -1 for opposite vectors', () => {
    const vec1 = [1, 0, 0]
    const vec2 = [-1, 0, 0]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(-1, 10)
  })

  it('should return 0 for orthogonal vectors', () => {
    const vec1 = [1, 0, 0]
    const vec2 = [0, 1, 0]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(0, 10)
  })

  it('should calculate similarity for 25-dimensional vectors', () => {
    const vec1 = Array(25).fill(0.5)
    const vec2 = Array(25).fill(0.5)
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(1, 10)
  })

  it('should handle different magnitude vectors correctly', () => {
    const vec1 = [1, 2, 3]
    const vec2 = [2, 4, 6] // Same direction, different magnitude
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(1, 10)
  })

  it('should return 0 for zero vectors', () => {
    const vec1 = [0, 0, 0]
    const vec2 = [1, 2, 3]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBe(0)
  })

  it('should return 0 when both vectors are zero', () => {
    const vec1 = [0, 0, 0]
    const vec2 = [0, 0, 0]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBe(0)
  })

  it('should handle negative values correctly', () => {
    const vec1 = [-1, -2, -3]
    const vec2 = [-1, -2, -3]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeCloseTo(1, 10)
  })

  it('should handle mixed positive and negative values', () => {
    const vec1 = [1, -2, 3]
    const vec2 = [-1, 2, -3]
    const result = cosineSimilarity(vec1, vec2)
    expect(result).toBeLessThan(0) // Should be negative (opposite direction)
  })

  it('should handle real-world word vector example', () => {
    // Example vectors similar to actual word2vec data
    const vec1 = [0.0033407, 0.91533, -1.2207, -0.45773, -0.59682]
    const vec2 = [-0.74355, 0.715, -0.1593, -0.28136, -0.736]
    const result = cosineSimilarity(vec1, vec2)
    
    // Result should be a valid cosine similarity between -1 and 1
    expect(result).toBeGreaterThanOrEqual(-1)
    expect(result).toBeLessThanOrEqual(1)
    expect(typeof result).toBe('number')
    expect(isNaN(result)).toBe(false)
  })

  it('should handle vectors of different lengths gracefully', () => {
    const vec1 = [1, 2, 3]
    const vec2 = [1, 2, 3, 4, 5]
    
    // Should handle gracefully (will only compare first 3 elements)
    // Note: In real usage, vectors should be same length
    expect(() => cosineSimilarity(vec1, vec2)).not.toThrow()
  })
})

