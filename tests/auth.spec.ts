import { test, expect, type Page } from '@playwright/test'
import { generateTestUserData } from './utils/supabase-test-utils'

test.describe('Authentication Happy Path', () => {
  let testUserData: ReturnType<typeof generateTestUserData>

  test.beforeAll(async () => {
    testUserData = generateTestUserData()
  })

  test.beforeEach(async ({ page }) => {
    // Ensure we start with a clean state
    await page.goto('/')
  })

  test('should successfully sign up a new user', async ({ page }) => {
    // Navigate to signup page
    await page.click('text=Sign Up')
    await expect(page).toHaveURL('/signup')

    // Verify signup form is visible
    await expect(page.locator('h1', { hasText: 'Create an account' })).toBeVisible()

    // Fill out signup form
    await page.fill('input[name="email"]', testUserData.email)
    await page.fill('input[name="password"]', testUserData.password)

    // Verify password strength meter is visible for signup
    await expect(page.locator('[data-testid="password-strength-meter"]')).toBeVisible()

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect after successful signup
    await page.waitForURL('/', { timeout: 15000 })

    // Verify we're redirected to home page
    await expect(page).toHaveURL('/')

    // Verify user is logged in by checking header
    await expect(page.locator('text=' + testUserData.email)).toBeVisible()
    await expect(page.locator('text=Logout')).toBeVisible()
  })

  test('should successfully log in with existing user', async ({ page }) => {
    // First create the user by signing up
    await signUpUser(page, testUserData.email, testUserData.password)
    
    // Then log out to test login
    await page.click('text=Logout')
    await page.waitForURL('/login', { timeout: 10000 })

    // Navigate to login page (if not already there)
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Verify login form is visible
    await expect(page.locator('h1', { hasText: 'Welcome back' })).toBeVisible()

    // Fill out login form
    await page.fill('input[name="email"]', testUserData.email)
    await page.fill('input[name="password"]', testUserData.password)

    // Verify remember me checkbox is present
    await expect(page.locator('input[type="checkbox"]')).toBeVisible()

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect after successful login
    await page.waitForURL('/', { timeout: 15000 })

    // Verify we're redirected to home page
    await expect(page).toHaveURL('/')

    // Verify user is logged in by checking header
    await expect(page.locator('text=' + testUserData.email)).toBeVisible()
    await expect(page.locator('text=Logout')).toBeVisible()
  })

  test('should successfully log out user', async ({ page }) => {
    // First, ensure we're logged in
    await signUpUser(page, testUserData.email, testUserData.password)

    // Verify user is logged in
    await expect(page.locator('text=' + testUserData.email)).toBeVisible()

    // Click logout button
    await page.click('text=Logout')

    // Wait for redirect to login page
    await page.waitForURL('/login', { timeout: 15000 })

    // Verify we're redirected to login page
    await expect(page).toHaveURL('/login')

    // Verify user is logged out by checking header
    await page.goto('/')
    await expect(page.locator('text=Login')).toBeVisible()
    await expect(page.locator('text=Sign Up')).toBeVisible()
    await expect(page.locator('text=' + testUserData.email)).not.toBeVisible()
  })

  test('should protect processing route and redirect to login when not authenticated', async ({ page }) => {
    // Ensure we're not logged in
    await page.goto('/')
    await expect(page.locator('text=Login')).toBeVisible()

    // Try to access protected route
    await page.goto('/processing')

    // Should be redirected to login page
    await page.waitForURL('/login', { timeout: 15000 })
    await expect(page).toHaveURL('/login')

    // Verify login form is visible
    await expect(page.locator('h1', { hasText: 'Welcome back' })).toBeVisible()
  })

  test('should allow access to processing route when authenticated', async ({ page }) => {
    // Log in first
    await signUpUser(page, testUserData.email, testUserData.password)

    // Navigate to protected route
    await page.goto('/processing')

    // Should be able to access the route
    await expect(page).toHaveURL('/processing')
    await expect(page.locator('h1', { hasText: 'Document Processing' })).toBeVisible()

    // Verify user is still logged in
    await expect(page.locator('text=' + testUserData.email)).toBeVisible()
  })

  test('should redirect authenticated users away from auth pages', async ({ page }) => {
    // Log in first
    await signUpUser(page, testUserData.email, testUserData.password)

    // Try to access login page
    await page.goto('/login')

    // Should be redirected to home page
    await page.waitForURL('/', { timeout: 15000 })
    await expect(page).toHaveURL('/')

    // Try to access signup page
    await page.goto('/signup')

    // Should be redirected to home page
    await page.waitForURL('/', { timeout: 15000 })
    await expect(page).toHaveURL('/')
  })

  // Helper function to sign up a user
  async function signUpUser(page: Page, email: string, password: string) {
    await page.goto('/signup')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/', { timeout: 15000 })
  }

  // Helper function to log in a user
  async function loginUser(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/', { timeout: 15000 })
  }
})