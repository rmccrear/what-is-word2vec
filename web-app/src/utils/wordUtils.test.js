import { describe, it, expect } from 'vitest'
import { getWordVector } from './wordUtils'

describe('getWordVector', () => {
  const mockWordVectors = {
    words: ['follow', 'know', 'back', 'people', 'really'],
    vectors: [
      [0.0033407, 0.91533, -1.2207],
      [0.3026, 0.69964, -0.02715],
      [-0.74355, 0.715, -0.1593],
      [0.61531, 0.40895, -0.34224],
      [-0.08943, 0.22163, 0.18244]
    ]
  }

  it('should return the correct vector for an existing word', () => {
    const result = getWordVector('follow', mockWordVectors)
    expect(result).toEqual([0.0033407, 0.91533, -1.2207])
  })

  it('should be case-insensitive', () => {
    const result1 = getWordVector('FOLLOW', mockWordVectors)
    const result2 = getWordVector('Follow', mockWordVectors)
    const result3 = getWordVector('follow', mockWordVectors)
    
    expect(result1).toEqual([0.0033407, 0.91533, -1.2207])
    expect(result2).toEqual([0.0033407, 0.91533, -1.2207])
    expect(result3).toEqual([0.0033407, 0.91533, -1.2207])
  })

  it('should handle words with whitespace', () => {
    const result = getWordVector('  follow  ', mockWordVectors)
    expect(result).toEqual([0.0033407, 0.91533, -1.2207])
  })

  it('should return null for non-existent words', () => {
    const result = getWordVector('nonexistent', mockWordVectors)
    expect(result).toBeNull()
  })

  it('should return null for empty string', () => {
    const result = getWordVector('', mockWordVectors)
    expect(result).toBeNull()
  })

  it('should return null for words with only whitespace', () => {
    const result = getWordVector('   ', mockWordVectors)
    expect(result).toBeNull()
  })

  it('should find words at different positions in the array', () => {
    const result1 = getWordVector('follow', mockWordVectors) // First word
    const result2 = getWordVector('really', mockWordVectors) // Last word
    const result3 = getWordVector('back', mockWordVectors) // Middle word
    
    expect(result1).not.toBeNull()
    expect(result2).not.toBeNull()
    expect(result3).not.toBeNull()
    expect(result1).not.toEqual(result2)
    expect(result2).not.toEqual(result3)
  })

  it('should handle special characters in word names', () => {
    const specialWordVectors = {
      words: ['test-word', 'test_word', 'test.word'],
      vectors: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
    }
    
    const result1 = getWordVector('test-word', specialWordVectors)
    const result2 = getWordVector('test_word', specialWordVectors)
    const result3 = getWordVector('test.word', specialWordVectors)
    
    expect(result1).toEqual([1, 2, 3])
    expect(result2).toEqual([4, 5, 6])
    expect(result3).toEqual([7, 8, 9])
  })

  it('should return correct vector for all words in mock data', () => {
    mockWordVectors.words.forEach((word, index) => {
      const result = getWordVector(word, mockWordVectors)
      expect(result).toEqual(mockWordVectors.vectors[index])
    })
  })

  it('should handle empty word vectors database', () => {
    const emptyWordVectors = {
      words: [],
      vectors: []
    }
    
    const result = getWordVector('anyword', emptyWordVectors)
    expect(result).toBeNull()
  })
})

