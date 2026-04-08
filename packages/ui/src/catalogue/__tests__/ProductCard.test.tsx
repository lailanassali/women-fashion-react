import { render } from '@testing-library/react'
import { ProductCard } from '../ProductCard'

const product = {
  id: 1,
  title: 'Test Product',
  price: 42,
  category: 'fashion',
  description: 'A test product description',
  image: 'https://example.com/test.png',
  rating: { rate: 4.2, count: 120 },
}

describe('ProductCard', () => {
  it('renders product details', () => {
    const { getByText, getByAltText } = render(
      <ProductCard product={product} onProductClick={() => {}} />
    )

    expect(getByText('Test Product')).toBeDefined()
    expect(getByText('£42.00')).toBeDefined()
    expect(getByText('fashion')).toBeDefined()
    expect(getByAltText('Test Product')).toBeDefined()
  })

  it('calls onProductClick when clicked', () => {
    const onClick = jest.fn()
    const { getByRole } = render(<ProductCard product={product} onProductClick={onClick} />)
    getByRole('article').click()
    expect(onClick).toHaveBeenCalledWith(product)
  })
})
