import { useState, useEffect } from 'react'
import { getWordVector } from '../../utils/wordUtils'
import BaseTooltip from './BaseTooltip'

const VectorTooltip = ({ word, wordVectors, theme = 'darkBg', children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [vector, setVector] = useState(null)

  useEffect(() => {
    if (isOpen && word) {
      const v = getWordVector(word, wordVectors)
      setVector(v)
    } else {
      setVector(null)
    }
  }, [isOpen, word, wordVectors])

  // Preserve exact color schemes from original
  const tooltipStyles = theme === 'darkBg' 
    ? {
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        borderColor: '#4299e1',
      }
    : {
        backgroundColor: '#ffffff',
        color: '#2d3748',
        borderColor: '#1890ff',
      }

  const popupContent = vector ? (
    <>
      <div className="tooltip-header"><strong>{word}</strong> = [</div>
      <div className="tooltip-content">
        {vector.map((val, i) => (
          <span key={i} className="tooltip-value">
            {val.toFixed(6)}{i < vector.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
      <div className="tooltip-footer">]</div>
    </>
  ) : null

  return (
    <BaseTooltip
      placement="right"
      hoverableClassName="vector-hoverable"
      tooltipClassName={`vector-tooltip vector-tooltip-${theme}`}
      tooltipStyles={tooltipStyles}
      isShowing={!!vector}
      onOpenChange={setIsOpen}
      popupContent={popupContent}
    >
      {children}
    </BaseTooltip>
  )
}

export default VectorTooltip

