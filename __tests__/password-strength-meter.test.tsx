// Manual test utility for Password Strength Meter
// Run this file with: npx tsx __tests__/password-strength-meter.test.tsx
// Or integrate with your preferred testing framework

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

// Extracted password strength calculation logic for testing
function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "transparent",
      suggestions: []
    }
  }

  let score = 0
  const suggestions: string[] = []

  // Length check
  if (password.length >= 8) {
    score += 30
  } else {
    suggestions.push("Use at least 8 characters")
  }

  if (password.length >= 12) {
    score += 10
  }

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (hasLowercase) score += 10
  else suggestions.push("Add lowercase letters")

  if (hasUppercase) score += 10
  else suggestions.push("Add uppercase letters")

  if (hasNumbers) score += 10
  else suggestions.push("Add numbers")

  if (hasSpecialChars) score += 15
  else suggestions.push("Add special characters (!@#$%^&*)")

  // Bonus for character variety
  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length
  if (varietyCount >= 3) score += 10

  // Penalty for common patterns
  const commonPatterns = [
    /(.)\1{2,}/g, // Repeated characters (aaa, 111)
    /123|234|345|456|567|678|789|890/g, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi, // Sequential letters
    /password|123456|qwerty|admin|login|welcome/gi // Common words
  ]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 15
      suggestions.push("Avoid common patterns and words")
      break
    }
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score))

  // Determine label and color
  let label: string
  let color: string

  if (score < 40) {
    label = "Weak"
    color = "bg-red-500"
  } else if (score < 70) {
    label = "Medium"
    color = "bg-yellow-500"
  } else {
    label = "Strong"
    color = "bg-green-500"
  }

  return { score, label, color, suggestions }
}

// Test cases
const testCases = [
  { password: '', expected: { label: '', score: 0 }, description: 'empty password' },
  { password: '123', expected: { label: 'Weak', score: 0 }, description: 'very short password' },
  { password: '12345678', expected: { label: 'Weak', score: 25 }, description: 'numbers only, 8 chars' },
  { password: 'abcdefgh', expected: { label: 'Weak', score: 25 }, description: 'lowercase only, 8 chars' },
  { password: 'Password', expected: { label: 'Weak', score: 35 }, description: 'mixed case, no numbers' },
  { password: 'Password1', expected: { label: 'Medium', score: 55 }, description: 'mixed case with numbers' },
  { password: 'Password1!', expected: { label: 'Strong', score: 70 }, description: 'mixed case with numbers and special chars' },
  { password: 'MyVeryStr0ng!P@ssw0rd', expected: { label: 'Strong', score: 95 }, description: 'long complex password' },
  { password: 'password123', expected: { label: 'Weak', score: 35 }, description: 'common pattern penalty' },
  { password: 'aaabbbccc', expected: { label: 'Weak', score: 25 }, description: 'repeated characters penalty' },
]

// Run tests
console.log('🧪 Password Strength Meter Tests\n')

let passed = 0
let failed = 0

testCases.forEach(({ password, expected, description }, index) => {
  const result = calculatePasswordStrength(password)
  const labelMatch = result.label === expected.label
  const scoreInRange = Math.abs(result.score - expected.score) <= 10 // Allow 10 point variance
  
  if (labelMatch && scoreInRange) {
    console.log(`✅ Test ${index + 1}: ${description}`)
    console.log(`   Password: "${password}" → ${result.label} (${result.score})`)
    passed++
  } else {
    console.log(`❌ Test ${index + 1}: ${description}`)
    console.log(`   Password: "${password}"`)
    console.log(`   Expected: ${expected.label} (~${expected.score})`)
    console.log(`   Got: ${result.label} (${result.score})`)
    failed++
  }
  
  if (result.suggestions.length > 0) {
    console.log(`   Suggestions: ${result.suggestions.slice(0, 3).join(', ')}`)
  }
  console.log('')
})

console.log(`📊 Results: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('🎉 All tests passed!')
} else {
  console.log('⚠️  Some tests failed. Review the password strength logic.')
}

// Export for potential integration with testing frameworks
export { calculatePasswordStrength, testCases } 