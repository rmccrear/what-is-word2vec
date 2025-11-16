import { useState } from 'react'
import CalculationTooltip from './tooltips/CalculationTooltip'
import CosineSimilarityTooltip from './tooltips/CosineSimilarityTooltip'
import MagnitudeTooltip from './tooltips/MagnitudeTooltip'

const MathFormulaDescription = ({ dotProduct, magnitude1, magnitude2, cosineSimilarity, inputVector, matchVector }) => {
  const [hoveredVector, setHoveredVector] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (vectorType, event) => {
    setHoveredVector(vectorType)
    setHoverPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event) => {
    if (hoveredVector) {
      setHoverPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const handleMouseLeave = () => {
    setHoveredVector(null)
  }

  const renderVectorTooltip = () => {
    if (!hoveredVector) return null

    const vector = hoveredVector === 'v1' ? inputVector : matchVector
    const vectorName = hoveredVector === 'v1' ? 'v₁' : 'v₂'

    return (
      <div 
        className="vector-tooltip vector-tooltip-darkBg"
        style={{
          position: 'fixed',
          left: `${hoverPosition.x + 10}px`,
          top: `${hoverPosition.y + 10}px`,
          zIndex: 1000,
          backgroundColor: '#1a202c',
          color: '#e2e8f0',
          borderColor: '#4299e1',
        }}
      >
        <div className="tooltip-header"><strong>{vectorName}</strong> = [</div>
        <div className="tooltip-content">
          {vector.map((val, i) => (
            <span key={i} className="tooltip-value">
              {val.toFixed(6)}{i < vector.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <div className="tooltip-footer">]</div>
      </div>
    )
  }

  return (
    <div 
      className="math-formula"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <p className="formula-text">
        Step 1: Dot Product = Σ(
        <span 
          className="vector-hoverable"
          onMouseEnter={(e) => handleMouseEnter('v1', e)}
          onMouseLeave={handleMouseLeave}
        >
          v₁ᵢ
        </span>
        {' × '}
        <span 
          className="vector-hoverable"
          onMouseEnter={(e) => handleMouseEnter('v2', e)}
          onMouseLeave={handleMouseLeave}
        >
          v₂ᵢ
        </span>
        ) for i = 0 to 24<br />
        ={' '}
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
      </p>
      <p className="formula-text">
        Step 2: Cosine Similarity = Dot Product / (||v₁|| × ||v₂||)<br />
        = {dotProduct.toFixed(6)} / ({' '}
        <MagnitudeTooltip vector={inputVector} magnitude={magnitude1} vectorName="v₁">
          <strong>{magnitude1.toFixed(6)}</strong>
        </MagnitudeTooltip>
        {' × '}
        <MagnitudeTooltip vector={matchVector} magnitude={magnitude2} vectorName="v₂">
          <strong>{magnitude2.toFixed(6)}</strong>
        </MagnitudeTooltip>
        )<br />
        ={' '}
        <CosineSimilarityTooltip
          dotProduct={dotProduct}
          magnitude1={magnitude1}
          magnitude2={magnitude2}
          cosineSimilarity={cosineSimilarity}
        >
          <strong>{cosineSimilarity.toFixed(6)}</strong>
        </CosineSimilarityTooltip>
      </p>
      {renderVectorTooltip()}
    </div>
  )
}

export default MathFormulaDescription

