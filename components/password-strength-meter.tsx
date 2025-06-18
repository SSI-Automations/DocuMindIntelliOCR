import React from "react"
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthMeterProps {
  password: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculatePasswordStrength = (password: string): PasswordStrength => {
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

  const strength = calculatePasswordStrength(password)

  if (!password) return null

  return (
    <div className="space-y-2 mt-2" data-testid="password-strength-meter">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <span className={`text-sm font-medium ${
          strength.label === "Weak" ? "text-red-500" :
          strength.label === "Medium" ? "text-yellow-500" :
          "text-green-500"
        }`}>
          {strength.label}
        </span>
      </div>
      
      <div className="relative">
        <Progress value={strength.score} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {strength.suggestions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Suggestions:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {strength.suggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 