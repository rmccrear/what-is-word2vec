import { useState, useEffect } from 'react'
import { cosineSimilarity } from '../utils/cosineSimilarity'

export function useWordSearch(word, wordVectors, hasSuggestions) {
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [selectedWord, setSelectedWord] = useState(null)

  // Search as you type with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!word.trim()) {
        setError('')
        setResults([])
        setSelectedWord(null)
        return
      }

      const trimmedWord = word.trim().toLowerCase()
      const wordIndex = wordVectors.words.findIndex(w => w.toLowerCase() === trimmedWord)

      if (wordIndex === -1) {
        // Only show error if there are no suggestions available
        if (!hasSuggestions) {
          setError(`Word "${trimmedWord}" not found in database`)
        } else {
          setError('')
        }
        setResults([])
        return
      }

      setError('')
      
      // Get the input word's vector
      const inputVector = wordVectors.vectors[wordIndex]

      // Calculate similarity with all words
      const similarities = []
      for (let i = 0; i < wordVectors.words.length; i++) {
        if (i !== wordIndex) { // Exclude the input word itself
          const similarity = cosineSimilarity(inputVector, wordVectors.vectors[i])
          similarities.push({
            word: wordVectors.words[i],
            similarity: similarity
          })
        }
      }

      // Sort by similarity (descending) and get top 10
      similarities.sort((a, b) => b.similarity - a.similarity)
      const top10 = similarities.slice(0, 10)

      setResults(top10)
      setSelectedWord(null) // Reset selection when search changes
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [word, wordVectors, hasSuggestions])

  return {
    results,
    error,
    selectedWord,
    setSelectedWord
  }
}

