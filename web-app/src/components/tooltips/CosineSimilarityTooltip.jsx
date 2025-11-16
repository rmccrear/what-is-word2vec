import BaseTooltip from './BaseTooltip'

const CosineSimilarityTooltip = ({ dotProduct, magnitude1, magnitude2, cosineSimilarity, children }) => {
  // Preserve exact color scheme from original: #1a202c bg, #e2e8f0 text, #4299e1 border
  const tooltipStyles = {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    borderColor: '#4299e1',
  }

  const popupContent = (
    <div className="calculation-steps">
      <div className="calculation-step">
        <div className="step-result">
          = {dotProduct.toFixed(6)} / ({magnitude1.toFixed(6)} × {magnitude2.toFixed(6)})
        </div>
        <div className="step-result">= <strong>{cosineSimilarity.toFixed(6)}</strong></div>
      </div>
    </div>
  )

  return (
    <BaseTooltip
      placement="top"
      hoverableClassName="calculation-hoverable"
      tooltipClassName="calculation-tooltip"
      tooltipStyles={tooltipStyles}
      popupContent={popupContent}
    >
      {children}
    </BaseTooltip>
  )
}

export default CosineSimilarityTooltip

