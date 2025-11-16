import { useState, useRef } from 'react'
import twitterVectors from './word_vectors.json'
import wikiVectors from './word_vectors_wiki.json'
import DotProductDisplay from './components/DotProductDisplay'
import SimilarityChart from './components/SimilarityChart'
import About from './components/About'
import VectorTooltip from './components/tooltips/VectorTooltip'
import WordSuggestions from './components/WordSuggestions'
import AllWordsTable from './components/AllWordsTable'
import { useWordSearch } from './hooks/useWordSearch'
import './App.css'

function App() {
  const [dataset, setDataset] = useState('twitter')
  const [wordVectors, setWordVectors] = useState(twitterVectors)
  const [word, setWord] = useState('philly')
  const [hasSuggestions, setHasSuggestions] = useState(false)
  const inputRef = useRef(null)

  const { results, error, selectedWord, setSelectedWord } = useWordSearch(word, wordVectors, hasSuggestions)

  const handleWordSelect = (word) => {
    setSelectedWord(word)
  }

  const showResults = results.length > 0
  // Always show right panel - About is the default, DotProductDisplay only when word is selected
  const showRightPanel = true

  const datasetMeta = {
    twitter: {
      description:
        'This database contains the most common 1,000 words from the GloVe Twitter 25-dimensional word embeddings model. Click on any word below to search for its most similar words.',
      modelLink: 'https://huggingface.co/jkrukowski/glove-twitter-25',
      modelLabel: 'GloVe Twitter 25',
    },
    wiki: {
      description:
        'This database contains 5,000 high-frequency words from the GloVe Wiki-Gigaword 50-dimensional word embeddings model. Click on any word below to search for its most similar words.',
      modelLink: 'https://nlp.stanford.edu/projects/glove/',
      modelLabel: 'GloVe Wiki-Gigaword 50',
    },
  }

  const handleDatasetChange = (event) => {
    const newDataset = event.target.value
    setDataset(newDataset)
    setWordVectors(newDataset === 'wiki' ? wikiVectors : twitterVectors)
    // Reset selected word state when switching datasets
    setSelectedWord(null)
  }

  return (
    <div className={showRightPanel ? 'grid' : 'container'}>
      <div className={showRightPanel ? 'left-content' : ''}>
        <h1>Word2Vec Similarity Search</h1>
        <p>Find the 10 most similar words using cosine similarity</p>
        <div className="form-group">
          <label htmlFor="dataset-select">Dataset:</label>
          <select
            id="dataset-select"
            value={dataset}
            onChange={handleDatasetChange}
          >
            <option value="twitter">Twitter (1,000 words, 25-dimensional)</option>
            <option value="wiki">Wiki + Gigaword (5,000 words, 50-dimensional)</option>
          </select>
        </div>
        <p className="info">Searching {wordVectors.words.length} words from the selected dataset</p>

        <div className="form-group">
                <label htmlFor="word-input">Enter a word:</label>
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    id="word-input"
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="e.g., king, queen, happy..."
                    autoFocus
                  />
                  <WordSuggestions
                    value={word}
                    items={wordVectors.words}
                    onSelect={(selectedWord) => setWord(selectedWord)}
                    onSuggestionsChange={setHasSuggestions}
                    inputRef={inputRef}
                  />
                </div>
              </div>

              {error && (
                <div className="error-section">
                  <div className="error">
                    <strong>Error:</strong> {error}
                  </div>
                  <AllWordsTable 
                    words={wordVectors.words}
                    wordVectors={wordVectors}
              description={datasetMeta[dataset].description}
              modelLink={datasetMeta[dataset].modelLink}
              modelLabel={datasetMeta[dataset].modelLabel}
                    onWordSelect={(word) => setWord(word)}
                  />
                </div>
              )}

              {showResults && (
                <div className="results-content">
                  <h2>
                    Top 10 Most Similar Words to "
                    <VectorTooltip word={word} wordVectors={wordVectors} theme="lightBg">
                      {word}
                    </VectorTooltip>
                    " (click a row to see calculation)
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Word</th>
                        <th>Similarity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => {
                        const isSelected = selectedWord === result.word
                        return (
                          <tr 
                            key={result.word}
                            className={isSelected ? 'selected-row' : 'clickable-row'}
                      onClick={() => handleWordSelect(result.word)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{index + 1}</td>
                            <td>
                              <strong>
                                <VectorTooltip word={result.word} wordVectors={wordVectors} theme="lightBg">
                                  {result.word}
                                </VectorTooltip>
                              </strong>
                            </td>
                            <td>{result.similarity.toFixed(4)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <SimilarityChart 
                    results={results} 
                    onBarClick={handleWordSelect}
                    selectedWord={selectedWord}
                  />
                </div>
              )}
            </div>

            <div className="right-content">
              {selectedWord && showResults ? (
                <DotProductDisplay 
                  word={word} 
                  results={results} 
                  wordVectors={wordVectors}
                  selectedWord={selectedWord}
                  onBack={() => setSelectedWord(null)}
                />
              ) : (
                <About />
              )}
            </div>
          </div>
  )
}

export default App
