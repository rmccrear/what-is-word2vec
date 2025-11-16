import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BaseTooltip from './BaseTooltip'

describe('BaseTooltip', () => {
  it('renders children', () => {
    render(
      <BaseTooltip popupContent={<div>Tooltip content</div>}>
        <span>Hover me</span>
      </BaseTooltip>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup()
    render(
      <BaseTooltip popupContent={<div>Tooltip content</div>}>
        <span>Hover me</span>
      </BaseTooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)
    expect(screen.getByText('Tooltip content')).toBeInTheDocument()
  })

  it('hides tooltip when isShowing is false', async () => {
    const user = userEvent.setup()
    render(
      <BaseTooltip 
        popupContent={<div>Tooltip content</div>}
        isShowing={false}
      >
        <span>Hover me</span>
      </BaseTooltip>
    )
    
    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
  })
})

