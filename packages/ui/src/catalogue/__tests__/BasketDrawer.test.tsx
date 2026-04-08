import { render, fireEvent } from '@testing-library/react'
import { BasketDrawer } from '../BasketDrawer'
import type { BasketItem } from '../types'

const item: BasketItem = {
  quantity: 2,
  product: {
    id: 1,
    title: 'Red Dress',
    price: 49.99,
    category: "women's clothing",
    description: '',
    image: 'https://example.com/dress.png',
    rating: { rate: 4.5, count: 10 },
  },
}

const defaultProps = {
  items: [item],
  totalPrice: 99.98,
  onClose: jest.fn(),
  onRemoveItem: jest.fn(),
  onUpdateQuantity: jest.fn(),
}

describe('BasketDrawer', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders item title and total price', () => {
    const { getByText, getAllByText } = render(<BasketDrawer {...defaultProps} />)
    expect(getByText('Red Dress')).toBeDefined()
    expect(getAllByText('£99.98').length).toBeGreaterThan(0)
  })

  it('shows empty state when basket is empty', () => {
    const { getByText } = render(<BasketDrawer {...defaultProps} items={[]} totalPrice={0} />)
    expect(getByText('Your basket is empty')).toBeDefined()
  })

  it('calls onClose when close button is clicked', () => {
    const { getByLabelText } = render(<BasketDrawer {...defaultProps} />)
    fireEvent.click(getByLabelText('Close basket'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onRemoveItem with correct id', () => {
    const { getByLabelText } = render(<BasketDrawer {...defaultProps} />)
    fireEvent.click(getByLabelText('Remove Red Dress'))
    expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(1)
  })

  it('calls onUpdateQuantity when + is clicked', () => {
    const { getByLabelText } = render(<BasketDrawer {...defaultProps} />)
    fireEvent.click(getByLabelText('Increase quantity'))
    expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(1, 3)
  })

  it('calls onUpdateQuantity when − is clicked', () => {
    const { getByLabelText } = render(<BasketDrawer {...defaultProps} />)
    fireEvent.click(getByLabelText('Decrease quantity'))
    expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(1, 1)
  })
})
