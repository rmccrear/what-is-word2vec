import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from './About'

describe('About', () => {
  it('renders the heading', () => {
    render(<About />)
    expect(screen.getByText('About Word2Vec Similarity')).toBeInTheDocument()
  })

  it('renders key content', () => {
    render(<About />)
    expect(screen.getByText(/Word2Vec is a technique/)).toBeInTheDocument()
    expect(screen.getByText(/Cosine Similarity/)).toBeInTheDocument()
  })

  it('renders the list items', () => {
    render(<About />)
    expect(screen.getByText(/Dot Product:/)).toBeInTheDocument()
    expect(screen.getByText(/Vector Magnitude:/)).toBeInTheDocument()
    expect(screen.getByText(/Normalization:/)).toBeInTheDocument()
  })
})

