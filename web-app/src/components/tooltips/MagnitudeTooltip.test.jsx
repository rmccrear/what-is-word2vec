import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MagnitudeTooltip from './MagnitudeTooltip'

describe('MagnitudeTooltip', () => {
  const mockVector = [3, 4]
  const mockMagnitude = 5

  it('renders children', () => {
    render(
      <MagnitudeTooltip 
        vector={mockVector} 
        magnitude={mockMagnitude}
        vectorName="v₁"
      >
        {mockMagnitude}
      </MagnitudeTooltip>
    )
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('displays magnitude calculation on hover', async () => {
    const user = userEvent.setup()
    render(
      <MagnitudeTooltip 
        vector={mockVector} 
        magnitude={mockMagnitude}
        vectorName="v₁"
      >
        hover me
      </MagnitudeTooltip>
    )
    
    const trigger = screen.getByText('hover me')
    await user.hover(trigger)
    
    expect(screen.getByText(/v₁/)).toBeInTheDocument()
    expect(screen.getByText(/3\.000000²/)).toBeInTheDocument()
    expect(screen.getByText(/4\.000000²/)).toBeInTheDocument()
    expect(screen.getAllByText(/5\.000000/).length).toBeGreaterThan(0)
  })
})

