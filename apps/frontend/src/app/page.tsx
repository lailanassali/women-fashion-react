import { ProductCatalogueClient } from './ProductCatalogueClient'

export const metadata = {
  title: 'Women Fashion Catalogue',
}

export default function DemoPage(): React.JSX.Element {
  return (
    <main className="container">
      <ProductCatalogueClient />
    </main>
  )
}
