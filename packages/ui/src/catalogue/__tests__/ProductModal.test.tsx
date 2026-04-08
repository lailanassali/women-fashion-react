import { render, fireEvent } from '@testing-library/react'
import { ProductModal } from '../ProductModal'
import type { Product } from '../types'

const product: Product = {
  id: 1,
  title: 'Red Dress',
  price: 49.99,
  category: "women's clothing",
  description: 'A beautiful red dress.',
  image: 'https://example.com/dress.png',
  rating: { rate: 4.5, count: 120 },
}

const defaultProps = {
  product,
  onClose: jest.fn(),
  onAddToBasket: jest.fn(),
}

describe('ProductModal', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders product title, price and description', () => {
    const { getByText } = render(<ProductModal {...defaultProps} />)
    expect(getByText('Red Dress')).toBeDefined()
    expect(getByText('£49.99')).toBeDefined()
    expect(getByText('A beautiful red dress.')).toBeDefined()
  })

  it('renders the correct number of filled stars', () => {
    const { container } = render(<ProductModal {...defaultProps} />)
    const filled = container.querySelectorAll('.star-filled')
    expect(filled.length).toBe(4) // floor(4.5) = 4
  })

  it('shows review count', () => {
    const { getByText } = render(<ProductModal {...defaultProps} />)
    expect(getByText('(120 reviews)')).toBeDefined()
  })

  it('calls onAddToBasket with the product when button clicked', () => {
    const { getByText } = render(<ProductModal {...defaultProps} />)
    fireEvent.click(getByText('Add to Basket'))
    expect(defaultProps.onAddToBasket).toHaveBeenCalledWith(product)
  })

  it('calls onClose when overlay is clicked', () => {
    const { getByRole } = render(<ProductModal {...defaultProps} />)
    fireEvent.click(getByRole('dialog'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    const { getByLabelText } = render(<ProductModal {...defaultProps} />)
    fireEvent.click(getByLabelText('Close'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
