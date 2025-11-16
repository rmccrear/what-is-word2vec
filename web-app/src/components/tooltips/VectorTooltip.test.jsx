import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VectorTooltip from './VectorTooltip'

// Mock wordUtils
vi.mock('../../utils/wordUtils', () => ({
  getWordVector: (word, wordVectors) => {
    const index = wordVectors.words.findIndex(w => w.toLowerCase() === word.toLowerCase())
    return index >= 0 ? wordVectors.vectors[index] : null
  }
}))

describe('VectorTooltip', () => {
  const mockWordVectors = {
    words: ['test', 'word'],
    vectors: [
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6]
    ]
  }

  it('renders the word as children', () => {
    render(
      <VectorTooltip word="test" wordVectors={mockWordVectors}>
        test
      </VectorTooltip>
    )
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('displays vector data on hover', async () => {
    const user = userEvent.setup()
    render(
      <VectorTooltip word="test" wordVectors={mockWordVectors}>
        hover me
      </VectorTooltip>
    )
    
    const trigger = screen.getByText('hover me')
    await user.hover(trigger)
    
    // Wait for vector to load and tooltip to appear
    await screen.findByText(/0\.100000/)
    
    expect(screen.getByText(/test/)).toBeInTheDocument()
    expect(screen.getByText(/0\.100000/)).toBeInTheDocument()
    expect(screen.getByText(/0\.200000/)).toBeInTheDocument()
    expect(screen.getByText(/0\.300000/)).toBeInTheDocument()
  })
})

