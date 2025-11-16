import BaseTooltip from './BaseTooltip'

const CalculationTooltip = ({ dotProduct, magnitude1, magnitude2, cosineSimilarity, inputVector, matchVector, children }) => {
  // Preserve exact color scheme from original: #1a202c bg, #e2e8f0 text, #4299e1 border
  const tooltipStyles = {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    borderColor: '#4299e1',
  }

  const popupContent = (
    <div className="calculation-steps">
      {inputVector && matchVector && (
        <div className="calculation-step">
          <div className="expanded-calculation">
            {inputVector.map((val1, i) => {
              const val2 = matchVector[i]
              const isLast = i === inputVector.length - 1
              return (
                <span key={i} className="calculation-term">
                  {val1.toFixed(6)} × {val2.toFixed(6)}{!isLast && ' + '}
                </span>
              )
            })}
          </div>
          <div className="step-result">= <strong>{dotProduct.toFixed(6)}</strong></div>
        </div>
      )}
    </div>
  )

  return (
    <BaseTooltip
      placement="top"
      hoverableClassName="calculation-hoverable"
      tooltipClassName="calculation-tooltip"
      tooltipStyles={tooltipStyles}
      isShowing={!!(inputVector && matchVector)}
      popupContent={popupContent}
    >
      {children}
    </BaseTooltip>
  )
}

export default CalculationTooltip

