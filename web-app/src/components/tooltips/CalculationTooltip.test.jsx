import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalculationTooltip from './CalculationTooltip'

describe('CalculationTooltip', () => {
  const props = {
    dotProduct: 10,
    magnitude1: 5,
    magnitude2: 2,
    cosineSimilarity: 1.0,
    inputVector: [1, 2],
    matchVector: [3, 4]
  }

  it('renders children', () => {
    render(
      <CalculationTooltip {...props}>
        {props.dotProduct.toFixed(6)}
      </CalculationTooltip>
    )
    expect(screen.getByText('10.000000')).toBeInTheDocument()
  })

  it('displays dot product calculation on hover', async () => {
    const user = userEvent.setup()
    render(
      <CalculationTooltip {...props}>
        hover me
      </CalculationTooltip>
    )
    
    const trigger = screen.getByText('hover me')
    await user.hover(trigger)
    
    expect(screen.getByText(/1\.000000 × 3\.000000/)).toBeInTheDocument()
    expect(screen.getByText(/2\.000000 × 4\.000000/)).toBeInTheDocument()
    expect(screen.getAllByText(/10\.000000/).length).toBeGreaterThan(0)
  })
})

