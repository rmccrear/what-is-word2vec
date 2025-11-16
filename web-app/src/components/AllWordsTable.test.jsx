import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AllWordsTable from './AllWordsTable'

// Mock VectorTooltip to simplify tests
vi.mock('./tooltips/VectorTooltip', () => ({
  default: ({ children }) => <span>{children}</span>
}))

describe('AllWordsTable', () => {
  const mockWordVectors = {
    words: ['test', 'word'],
    vectors: [[0.1, 0.2], [0.3, 0.4]]
  }

  const mockWords = ['hello', 'world', 'test']
  const mockOnWordSelect = vi.fn()

  it('renders the word count', () => {
    render(
      <AllWordsTable 
        words={mockWords} 
        wordVectors={mockWordVectors}
        onWordSelect={mockOnWordSelect}
      />
    )
    expect(screen.getByText(/3 total/)).toBeInTheDocument()
  })

  it('renders all words', () => {
    render(
      <AllWordsTable 
        words={mockWords} 
        wordVectors={mockWordVectors}
        onWordSelect={mockOnWordSelect}
      />
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('calls onWordSelect when a word is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AllWordsTable 
        words={mockWords} 
        wordVectors={mockWordVectors}
        onWordSelect={mockOnWordSelect}
      />
    )
    
    await user.click(screen.getByText('hello'))
    expect(mockOnWordSelect).toHaveBeenCalledWith('hello')
  })
})

