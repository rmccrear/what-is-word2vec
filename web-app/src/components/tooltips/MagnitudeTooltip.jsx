import BaseTooltip from './BaseTooltip'

const MagnitudeTooltip = ({ vector, magnitude, vectorName, children }) => {
  // Preserve exact color scheme from original: #1a202c bg, #e2e8f0 text, #4299e1 border
  const tooltipStyles = {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    borderColor: '#4299e1',
  }

  const sumSquares = vector ? vector.reduce((sum, val) => sum + val * val, 0) : 0

  const popupContent = (
    <div className="calculation-steps">
      <div className="calculation-step">
        <div className="step-label">||{vectorName}|| = √(Σ({vectorName}ᵢ²) for i = 0 to 24)</div>
        <div className="expanded-calculation">
          {vector.map((val, i) => {
            const isLast = i === vector.length - 1
            return (
              <span key={i} className="calculation-term">
                {val.toFixed(6)}²{!isLast && ' + '}
              </span>
            )
          })}
        </div>
        <div className="step-result">= √{sumSquares.toFixed(6)}</div>
        <div className="step-result">= <strong>{magnitude.toFixed(6)}</strong></div>
      </div>
    </div>
  )

  return (
    <BaseTooltip
      placement="top"
      hoverableClassName="calculation-hoverable"
      tooltipClassName="calculation-tooltip"
      tooltipStyles={tooltipStyles}
      isShowing={!!vector}
      popupContent={popupContent}
    >
      {children}
    </BaseTooltip>
  )
}

export default MagnitudeTooltip

