import VectorTooltip from './tooltips/VectorTooltip'

const AllWordsTable = ({ words, wordVectors, onWordSelect, description, modelLink, modelLabel }) => {
  const effectiveDescription =
    description ||
    'This database contains the words from the currently selected embedding dataset. Click on any word below to search for its most similar words.'

  return (
    <div className="all-words-section">
      <h2>All Words in Database ({words.length} total)</h2>
      <p className="all-words-description">
        {effectiveDescription}
      </p>
      <div className="words-table-container">
        <table className="all-words-table">
          <thead>
            <tr>
              <th>
                {modelLink && modelLabel ? (
                  <a
                    href={modelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="model-link-header"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {modelLabel}
                  </a>
                ) : (
                  'Embedding Model'
                )}
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

