import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CosineSimilarityTooltip from './CosineSimilarityTooltip'

describe('CosineSimilarityTooltip', () => {
  const props = {
    dotProduct: 10,
    magnitude1: 5,
    magnitude2: 2,
    cosineSimilarity: 1.0
  }

  it('renders children', () => {
    render(
      <CosineSimilarityTooltip {...props}>
        {props.cosineSimilarity.toFixed(6)}
      </CosineSimilarityTooltip>
    )
    expect(screen.getByText('1.000000')).toBeInTheDocument()
  })

  it('displays cosine similarity formula on hover', async () => {
    const user = userEvent.setup()
    render(
      <CosineSimilarityTooltip {...props}>
        hover me
      </CosineSimilarityTooltip>
    )
    
    const trigger = screen.getByText('hover me')
    await user.hover(trigger)
    
    expect(screen.getByText(/10\.000000/)).toBeInTheDocument()
    expect(screen.getByText(/5\.000000/)).toBeInTheDocument()
    expect(screen.getByText(/2\.000000/)).toBeInTheDocument()
    expect(screen.getAllByText(/1\.000000/).length).toBeGreaterThan(0)
  })
})

