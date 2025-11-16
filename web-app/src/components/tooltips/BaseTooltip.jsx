import { useState } from 'react'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react'

/**
 * BaseTooltip - Common tooltip infrastructure
 * Preserves exact color schemes and CSS classes from original tooltips
 */
const BaseTooltip = ({
  children,
  placement = 'top',
  hoverableClassName = 'calculation-hoverable',
  tooltipClassName = 'calculation-tooltip',
  tooltipStyles = {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    borderColor: '#4299e1',
  },
  isShowing = true,
  popupContent,
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: isOpen ? autoUpdate : undefined,
  })

  const handleMouseEnter = () => {
    setIsOpen(true)
    onOpenChange?.(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  return (
    <>
      <span
        ref={refs.setReference}
        className={hoverableClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {isOpen && isShowing && (
        <div
          ref={refs.setFloating}
          className={tooltipClassName}
          style={{
            ...floatingStyles,
            ...tooltipStyles,
          }}
        >
          {popupContent}
        </div>
      )}
    </>
  )
}

export default BaseTooltip

