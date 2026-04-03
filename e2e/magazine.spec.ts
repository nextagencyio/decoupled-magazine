import { test, expect } from '@playwright/test'

test.describe('Magazine Homepage', () => {
  test('loads homepage with articles from Drupal', async ({ page }) => {
    await page.goto('/')
    // Hero section should show the featured article title
    await expect(page.locator('h1')).toBeVisible()
    // Should have the Meridian header link
    await expect(page.getByRole('link', { name: 'Meridian', exact: true })).toBeVisible()
  })

  test('displays featured article in hero section', async ({ page }) => {
    await page.goto('/')
    // The hero should have a "Featured" badge
    await expect(page.getByText('Featured')).toBeVisible()
    // Should have a "Read Article" link
    await expect(page.getByText('Read Article')).toBeVisible()
  })

  test('displays article cards in Latest Articles section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Latest Articles')).toBeVisible()
  })

  test('displays magazine description section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Meridian Magazine')).toBeVisible()
    await expect(page.getByText('Monthly Readers')).toBeVisible()
  })
})

test.describe('Article Pages', () => {
  test('can navigate to an article from homepage', async ({ page }) => {
    await page.goto('/')
    // Click the "Read Article" link on the hero
    await page.getByText('Read Article').click()
    // Should navigate to an article page with content
    await expect(page.locator('article')).toBeVisible()
  })

  test('article page displays title and body content', async ({ page }) => {
    await page.goto('/')
    // Get the hero article title
    const heroTitle = await page.locator('h1').first().textContent()
    // Click "Read Article"
    await page.getByText('Read Article').click()
    // Article page should have a title
    await expect(page.locator('h1')).toBeVisible()
    // Should have prose body content
    await expect(page.locator('.prose')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('header navigation links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Culture', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Technology', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Science', exact: true })).toBeVisible()
  })

  test('Meridian logo links to homepage', async ({ page }) => {
    await page.goto('/')
    const logoLink = page.getByRole('link', { name: 'Meridian' })
    await expect(logoLink).toHaveAttribute('href', '/')
  })
})
