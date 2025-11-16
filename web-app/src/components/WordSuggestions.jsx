import { useState, useEffect } from 'react'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react'

const defaultFilter = (value, items) => {
  if (!value || value.trim().length === 0) return []
  const trimmedValue = value.trim().toLowerCase()
  // Only suggest items that start with the input and are not exactly equal to it.
  // This prevents the dropdown from reopening immediately after selecting a word.
  return items.filter(item => {
    const lower = item.toLowerCase()
    return lower.startsWith(trimmedValue) && lower !== trimmedValue
  })
}

const WordSuggestions = ({ 
  value = '', 
  items = [], 
  onSelect, 
  inputRef,
  filterFn = defaultFilter,
  maxResults = 10,
  enableKeyboardNav = true,
  onSuggestionsChange
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: isOpen && inputRef?.current ? autoUpdate : undefined,
  })

  useEffect(() => {
    if (inputRef?.current) {
      refs.setReference(inputRef.current)
    }
  }, [refs, inputRef])

  // Filter suggestions based on value
  useEffect(() => {
    if (!value || value.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
      onSuggestionsChange?.(false)
      return
    }

    const matches = filterFn(value, items).slice(0, maxResults)

    if (matches.length > 0) {
      setSuggestions(matches)
      setIsOpen(true)
      setSelectedIndex(-1)
      onSuggestionsChange?.(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
      onSuggestionsChange?.(false)
    }
  }, [value, items, filterFn, maxResults, onSuggestionsChange])

  const handleSelect = (selectedItem) => {
    onSelect?.(selectedItem)
    setIsOpen(false)
    setSuggestions([])
  }

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return

    const handleKeyDown = (e) => {
      if (!isOpen || suggestions.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleSelect(suggestions[selectedIndex])
        setIsOpen(false)
        setSuggestions([])
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const input = inputRef?.current
    if (input) {
      input.addEventListener('keydown', handleKeyDown)
      return () => input.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, suggestions, selectedIndex, enableKeyboardNav, onSelect, inputRef])

  if (!isOpen || suggestions.length === 0) return null

  return (
    <div
      ref={refs.setFloating}
      className="word-suggestions"
      style={floatingStyles}
    >
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelect(suggestion)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WordSuggestions

