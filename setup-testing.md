# Testing Setup Guide for DocuMindIntelliOCR

## Recommended: Jest + React Testing Library

### 1. Install Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### 2. Create Jest Configuration

Create `jest.config.js` in your project root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### 3. Create Jest Setup File

Create `jest.setup.js` in your project root:

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})
```

### 4. Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### 5. Rewrite Password Strength Meter Tests

Create `__tests__/password-strength-meter.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordStrengthMeter } from '@/components/password-strength-meter'

describe('PasswordStrengthMeter', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrengthMeter password="" />)
    expect(container.firstChild).toBeNull()
  })

  it('shows weak strength for short passwords', () => {
    render(<PasswordStrengthMeter password="123" />)
    expect(screen.getByText('Weak')).toBeInTheDocument()
    expect(screen.getByText('Use at least 8 characters')).toBeInTheDocument()
  })

  it('shows medium strength for passwords with variety', () => {
    render(<PasswordStrengthMeter password="Password1" />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('shows strong strength for complex passwords', () => {
    render(<PasswordStrengthMeter password="MyStr0ng!P@ssw0rd" />)
    expect(screen.getByText('Strong')).toBeInTheDocument()
  })

  it('provides helpful suggestions', () => {
    render(<PasswordStrengthMeter password="lowercase" />)
    expect(screen.getByText('Add uppercase letters')).toBeInTheDocument()
    expect(screen.getByText('Add numbers')).toBeInTheDocument()
  })

  it('penalizes common patterns', () => {
    render(<PasswordStrengthMeter password="password123" />)
    expect(screen.getByText('Avoid common patterns and words')).toBeInTheDocument()
  })
})
```

### 6. Create Integration Test for Auth Form

Create `__tests__/auth-form.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from '@/components/auth-form'

describe('AuthForm', () => {
  it('shows password strength meter only on signup', () => {
    const { rerender } = render(<AuthForm type="login" />)
    
    // Should not show password strength meter on login
    expect(screen.queryByText('Password Strength')).not.toBeInTheDocument()
    
    // Should show password strength meter on signup
    rerender(<AuthForm type="signup" />)
    const passwordInput = screen.getByLabelText('Password')
    
    // Type a password to trigger the meter
    userEvent.type(passwordInput, 'test123')
    expect(screen.getByText('Password Strength')).toBeInTheDocument()
  })

  it('updates password strength in real-time', async () => {
    const user = userEvent.setup()
    render(<AuthForm type="signup" />)
    
    const passwordInput = screen.getByLabelText('Password')
    
    // Start with weak password
    await user.type(passwordInput, 'weak')
    expect(screen.getByText('Weak')).toBeInTheDocument()
    
    // Improve to medium
    await user.clear(passwordInput)
    await user.type(passwordInput, 'Password1')
    expect(screen.getByText('Medium')).toBeInTheDocument()
    
    // Improve to strong
    await user.clear(passwordInput)
    await user.type(passwordInput, 'MyStr0ng!P@ssw0rd')
    expect(screen.getByText('Strong')).toBeInTheDocument()
  })
})
```

## Alternative Options

### 2. **Vitest** (Modern Alternative)
- Faster than Jest
- Better TypeScript support out of the box
- Compatible with Jest API
- Great for Vite-based projects

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 3. **Playwright** (For E2E Testing)
- Excellent for end-to-end testing
- Cross-browser testing
- Great for testing user flows

```bash
npm install --save-dev @playwright/test
```

## Recommendation Summary

**Start with Jest + React Testing Library** because:
- ✅ Industry standard for React projects
- ✅ Excellent Next.js integration
- ✅ Comprehensive testing capabilities
- ✅ Large community and resources
- ✅ Your existing manual tests can be easily converted

**Consider Vitest** if you want:
- ⚡ Faster test execution
- 🔧 Better TypeScript experience
- 🆕 Modern tooling

**Add Playwright later** for:
- 🌐 End-to-end testing
- 🔄 User journey testing
- 📱 Cross-browser validation 