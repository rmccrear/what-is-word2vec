import VectorTooltip from './tooltips/VectorTooltip'

const AllWordsTable = ({ words, wordVectors, onWordSelect }) => {
  return (
    <div className="all-words-section">
      <h2>All Words in Database ({words.length} total)</h2>
      <p className="all-words-description">
        This database contains the most common 1,000 words from the GloVe Twitter 25-dimensional word embeddings model.
        GloVe (Global Vectors for Word Representation) was trained on Twitter data and represents each word as a 25-dimensional vector.
        Click on any word below to search for its most similar words.
      </p>
      <div className="words-table-container">
        <table className="all-words-table">
          <thead>
            <tr>
              <th>
                <a 
                  href="https://huggingface.co/jkrukowski/glove-twitter-25" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="model-link-header"
                  onClick={(e) => e.stopPropagation()}
                >
                  GloVe Twitter 25
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, index) => (
              <tr 
                key={index}
                className="word-row"
                onClick={() => onWordSelect(w)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <VectorTooltip word={w} wordVectors={wordVectors} theme="lightBg">
                    {w}
                  </VectorTooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllWordsTable

