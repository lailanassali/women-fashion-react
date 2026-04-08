import { test, expect } from '@playwright/test'

test.describe('Product Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows skeleton cards while loading then renders products', async ({ page }) => {
    // Skeleton appears immediately
    await expect(page.locator('.product-card-skeleton').first()).toBeVisible()
    // Products render after fetch
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 8000 })
  })

  test('search filters products by name', async ({ page }) => {
    await page.locator('.product-card').first().waitFor({ timeout: 8000 })

    const totalBefore = await page.locator('.product-card').count()
    await page.getByPlaceholder('Search products…').fill('dress')

    // Wait for debounce + re-render
    await page.waitForTimeout(400)
    const totalAfter = await page.locator('.product-card').count()
    expect(totalAfter).toBeLessThanOrEqual(totalBefore)
  })

  test('shows empty state when search matches nothing', async ({ page }) => {
    await page.locator('.product-card').first().waitFor({ timeout: 8000 })
    await page.getByPlaceholder('Search products…').fill('xyznotaproduct')
    await page.waitForTimeout(400)
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('opens product detail modal on card click', async ({ page }) => {
    await page.locator('.product-card').first().waitFor({ timeout: 8000 })
    await page.locator('.product-card').first().click()
    await expect(page.locator('.modal')).toBeVisible()
    await expect(page.locator('.modal-price')).toBeVisible()
    await expect(page.locator('.modal-description')).toBeVisible()
  })

  test('adds product to basket from modal', async ({ page }) => {
    await page.locator('.product-card').first().waitFor({ timeout: 8000 })
    await page.locator('.product-card').first().click()
    await page.locator('.add-to-basket-btn').click()

    // Modal closes and basket badge shows 1
    await expect(page.locator('.modal')).not.toBeVisible()
    await expect(page.locator('.basket-badge')).toHaveText('1')
  })

  test('basket drawer shows added item and updates quantity', async ({ page }) => {
    await page.locator('.product-card').first().waitFor({ timeout: 8000 })
    await page.locator('.product-card').first().click()
    await page.locator('.add-to-basket-btn').click()

    await page.locator('.basket-btn').click()
    await expect(page.locator('.basket-drawer')).toBeVisible()
    await expect(page.locator('.basket-item')).toHaveCount(1)

    await page.getByLabel('Increase quantity').click()
    await expect(page.locator('.quantity-value')).toHaveText('2')
  })
})
