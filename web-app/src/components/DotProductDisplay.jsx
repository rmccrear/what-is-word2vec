import { useEffect, useRef } from 'react'
import { getWordVector } from '../utils/wordUtils'
import MathFormulaDescription from './MathFormulaDescription'
import CalculationTooltip from './tooltips/CalculationTooltip'
import CosineSimilarityTooltip from './tooltips/CosineSimilarityTooltip'
import MagnitudeTooltip from './tooltips/MagnitudeTooltip'
import VectorTooltip from './tooltips/VectorTooltip'

const DotProductDisplay = ({ word, results, wordVectors, selectedWord, onBack }) => {
  const containerRef = useRef(null)

  // Scroll into view when component mounts or selectedWord changes
  useEffect(() => {
    if (selectedWord && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedWord])

  if (results.length === 0 || !selectedWord) return null

  const inputVector = getWordVector(word, wordVectors)
  const matchWord = selectedWord
  const matchVector = getWordVector(matchWord, wordVectors)

  if (!inputVector || !matchVector) return null

  // Calculate dot product step by step
  const products = inputVector.map((val, i) => ({
    dimension: i,
    inputValue: val,
    matchValue: matchVector[i],
    product: val * matchVector[i]
  }))

  const dotProduct = products.reduce((sum, p) => sum + p.product, 0)

  // Calculate magnitudes for normalization
  const sumSquares1 = inputVector.reduce((sum, val) => sum + val * val, 0)
  const sumSquares2 = matchVector.reduce((sum, val) => sum + val * val, 0)
  const magnitude1 = Math.sqrt(sumSquares1)
  const magnitude2 = Math.sqrt(sumSquares2)
  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2)

  return (
    <div id="dot-product-calculation" ref={containerRef} className="dot-product-display">
      <button onClick={onBack} className="back-button">
        ← Back to About
      </button>
      <h3>
        Dot Product Calculation:<br />
        "<VectorTooltip word={word} wordVectors={wordVectors} theme="darkBg">
          {word}
        </VectorTooltip>" · "<VectorTooltip word={matchWord} wordVectors={wordVectors} theme="darkBg">
          {matchWord}
        </VectorTooltip>" = {cosineSimilarity.toFixed(6)}
      </h3>
      <MathFormulaDescription 
        dotProduct={dotProduct}
        magnitude1={magnitude1}
        magnitude2={magnitude2}
        cosineSimilarity={cosineSimilarity}
        inputVector={inputVector}
        matchVector={matchVector}
      />
      <div className="vector-multiplication">
        <div className="vector-table">
          <table>
            <thead>
              <tr>
                <th>Dimension</th>
                <th>{word} (v₁)</th>
                <th>×</th>
                <th>{matchWord} (v₂)</th>
                <th>=</th>
                <th>v₁ × v₂</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.dimension}>
                  <td>dim_{p.dimension}</td>
                  <td>{p.inputValue.toFixed(6)}</td>
                  <td className="operator-cell">×</td>
                  <td>{p.matchValue.toFixed(6)}</td>
                  <td className="operator-cell">=</td>
                  <td className="product-cell">{p.product.toFixed(6)}</td>
                </tr>
              ))}
              <tr className="sum-row">
                <td colSpan="5">
                  <strong>Sum (Dot Product):</strong> Dot Product = Σ(v₁ᵢ × v₂ᵢ) for i = 0 to 24
                </td>
                <td className="sum-cell">
                  <CalculationTooltip
                    dotProduct={dotProduct}
                    magnitude1={magnitude1}
                    magnitude2={magnitude2}
                    cosineSimilarity={cosineSimilarity}
                    inputVector={inputVector}
                    matchVector={matchVector}
                  >
                    <strong>{dotProduct.toFixed(6)}</strong>
                  </CalculationTooltip>
                </td>
              </tr>
              <tr className="length-row">
                <td className="length-label-cell">
                  <strong>||v₁|| × ||v₂||</strong> (length)
                </td>
                <td className="sum-squares-cell">
                  <MagnitudeTooltip vector={inputVector} magnitude={magnitude1} vectorName="v₁">
                    {magnitude1.toFixed(6)}
                  </MagnitudeTooltip>
                </td>
                <td className="operator-cell">×</td>
                <td className="sum-squares-cell">
                  <MagnitudeTooltip vector={matchVector} magnitude={magnitude2} vectorName="v₂">
                    {magnitude2.toFixed(6)}
                  </MagnitudeTooltip>
                </td>
                <td className="operator-cell">=</td>
                <td className="length-cell"><strong>{(magnitude1 * magnitude2).toFixed(6)}</strong></td>
              </tr>
              <tr className="normalization-row">
                <td className="normalization-label-cell">
                  <strong>Cosine Similarity</strong> (normalized)
                </td>
                <td className="normalization-value-cell">{dotProduct.toFixed(6)}</td>
                <td className="operator-cell">/</td>
                <td className="normalization-value-cell">{(magnitude1 * magnitude2).toFixed(6)}</td>
                <td className="operator-cell">=</td>
                <td className="normalization-cell">
                  <CosineSimilarityTooltip
                    dotProduct={dotProduct}
                    magnitude1={magnitude1}
                    magnitude2={magnitude2}
                    cosineSimilarity={cosineSimilarity}
                  >
                    <strong>{cosineSimilarity.toFixed(6)}</strong>
                  </CosineSimilarityTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DotProductDisplay

