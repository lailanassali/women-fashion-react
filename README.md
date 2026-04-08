# Women's Fashion Retail Store

A women's fashion product catalogue built with Next.js, Express, and Turborepo. Features product browsing, search and filtering, a persistent basket, and a full test suite.

---

## Getting Started

You'll need Node.js installed ([download](https://nodejs.org/en/download/) or use [NVM](https://github.com/nvm-sh/nvm)).

```bash
# Clone the repository
git clone <repo-url>
cd women-fashion-react

# Install dependencies
npm install

# Run everything (frontend + API)
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3002 |
| API healthcheck | http://localhost:5001/status |

---

## Project Structure

```
women-fashion-react/
├── apps/
│   ├── frontend/          # Next.js app (pages, styles, catalogue client)
│   └── api/               # Express API
└── packages/
    ├── ui/                # Shared React component library
    │   └── src/catalogue/ # All product catalogue components and hooks
    ├── logger/            # Shared logger utility
    └── jest-presets/      # Shared Jest configuration
```

The key places you'll work:

- `apps/frontend/src/app/` — page entry point, `ProductCatalogueClient`, styles
- `packages/ui/src/catalogue/` — all components, hooks, and types

---

## Features

- **Product listing** — grid of cards with image, title, price, rating, category
- **Product detail modal** — full description, star rating, review count, add to basket
- **Search & filtering** — debounced search by name, filter by category, sort by price or rating
- **Basket** — add, remove, update quantity; total price; persisted in `localStorage`
- **Skeleton loading** — shimmer cards shown while products fetch
- **Empty state** — helpful message when search/filter returns no results
- **Responsive** — works across mobile and desktop

---

## Architecture Decisions

### Monorepo with Turborepo
All packages share a single `npm install` and `turbo run` orchestrates builds, tests, and dev servers in parallel with caching.

### Component library in `packages/ui`
UI components live in a separate package rather than directly in the app. This enforces a clean boundary — the frontend imports from `@repo/ui/catalogue`, meaning components stay reusable and independently testable.

To add a new component, export it from three places:
1. `packages/ui/package.json` — add to `exports`
2. `packages/ui/tsup.config.ts` — add to `entry`
3. `packages/ui/src/catalogue/index.tsx` — re-export

### Server vs client state
| State | Tool | Why |
|---|---|---|
| Products (remote data) | React Query | Handles caching, background refetch, loading/error states |
| Basket | React Context + `useBasket` | Shared client state, available anywhere in the tree |
| Filter/sort | Local `useState` | Page-scoped, no need to share across components |

React Query's `QueryClientProvider` and the custom `BasketProvider` are declared as explicit boundaries at the root of `ProductCatalogueClient`, making the state architecture visible at a glance.

### Debounced search
Search input updates React state immediately (so the input feels responsive), but the filter computation uses a 300ms debounced value via `useDebounce`. This avoids re-filtering the product list on every keystroke.

### localStorage persistence
`useBasket` initialises from `localStorage` via a lazy `useState` initialiser and writes back on every change via `useEffect`. Errors (e.g. private browsing) are silently caught so the basket degrades gracefully.

### Data source
Products are fetched from [fakestoreapi.com](https://fakestoreapi.com) using the `women's clothing` category endpoint. No API key required.

---

## Running Tests

```bash
# Unit + integration tests (all packages)
npm run test

# Unit + integration tests (UI package only)
npx turbo run test --filter=@repo/ui

# E2E tests (requires dev server or starts it automatically)
cd apps/frontend
npm run e2e
```

### Test coverage

| Layer | Tool | What's covered |
|---|---|---|
| Unit | Jest | `useDebounce`, `useBasket`, `useProductFilter` |
| Integration | Jest + Testing Library | `ProductCard`, `ProductModal`, `FilterBar`, `BasketDrawer`, `PaginationControls` |
| E2E | Playwright | Product loading, search, empty state, modal, add to basket, basket drawer |

---

## Available Commands

```bash
npm run dev        # Start all apps in watch mode
npm run build      # Production build (all packages)
npm run test       # Run all tests
npm run lint       # Lint all packages
npm run typecheck  # TypeScript check across all packages
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Playwright Documentation](https://playwright.dev)
- [fakestoreapi.com](https://fakestoreapi.com)
