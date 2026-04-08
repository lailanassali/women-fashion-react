import { render } from '@testing-library/react'
import { PaginationControls } from '../PaginationControls'

describe('PaginationControls', () => {
  it('renders page buttons and info', () => {
    const onPageChange = jest.fn()
    const { getByText } = render(
      <PaginationControls currentPage={2} totalPages={4} onPageChange={onPageChange} />
    )

    expect(getByText('Previous')).toBeDefined()
    expect(getByText('Next')).toBeDefined()
    expect(getByText('Page 2 of 4')).toBeDefined()
  })
})
