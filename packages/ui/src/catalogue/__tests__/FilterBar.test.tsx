import { render, fireEvent } from '@testing-library/react'
import { FilterBar } from '../FilterBar'

const defaultProps = {
  search: '',
  category: '',
  sort: 'default' as const,
  categories: ["women's clothing", 'jewellery'],
  resultCount: 6,
  onSearchChange: jest.fn(),
  onCategoryChange: jest.fn(),
  onSortChange: jest.fn(),
}

describe('FilterBar', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders search input, category and sort selects', () => {
    const { getByPlaceholderText, getByLabelText } = render(<FilterBar {...defaultProps} />)
    expect(getByPlaceholderText('Search products…')).toBeDefined()
    expect(getByLabelText('Filter by category')).toBeDefined()
    expect(getByLabelText('Sort products')).toBeDefined()
  })

  it('displays result count', () => {
    const { getByText } = render(<FilterBar {...defaultProps} resultCount={4} />)
    expect(getByText('4 products')).toBeDefined()
  })

  it('calls onSearchChange when typing', () => {
    const { getByPlaceholderText } = render(<FilterBar {...defaultProps} />)
    fireEvent.change(getByPlaceholderText('Search products…'), { target: { value: 'dress' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('dress')
  })

  it('calls onCategoryChange when selecting a category', () => {
    const { getByLabelText } = render(<FilterBar {...defaultProps} />)
    fireEvent.change(getByLabelText('Filter by category'), { target: { value: "women's clothing" } })
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith("women's clothing")
  })

  it('calls onSortChange when selecting a sort option', () => {
    const { getByLabelText } = render(<FilterBar {...defaultProps} />)
    fireEvent.change(getByLabelText('Sort products'), { target: { value: 'price-asc' } })
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('price-asc')
  })
})
