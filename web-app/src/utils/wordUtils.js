/**
 * Get the vector for a given word from the word vectors database
 * @param {string} wordToFind - The word to find
 * @param {Object} wordVectors - The word vectors database object with words and vectors arrays
 * @returns {number[]|null} The vector array or null if word not found
 */
export const getWordVector = (wordToFind, wordVectors) => {
  const trimmedWord = wordToFind.trim().toLowerCase()
  const wordIndex = wordVectors.words.findIndex(w => w.toLowerCase() === trimmedWord)
  return wordIndex !== -1 ? wordVectors.vectors[wordIndex] : null
}

