"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample extracted text for demonstration
const sampleExtractedText = `
CONFIDENTIAL BUSINESS DOCUMENT

Annual Financial Report
Fiscal Year 2023

Executive Summary:
This document presents the financial performance of Acme Corporation for the fiscal year ending December 31, 2023. The company has shown significant growth in revenue and profitability, with a 15% increase in total revenue compared to the previous fiscal year.

Key Financial Indicators:
- Total Revenue: $24.5 million
- Gross Profit: $10.2 million
- Operating Expenses: $6.8 million
- Net Income: $3.4 million
- Earnings Per Share (EPS): $2.45

Revenue Breakdown by Department:
1. Product Sales: $15.3 million (62.5%)
2. Services: $7.2 million (29.4%)
3. Licensing: $2.0 million (8.1%)

Regional Performance:
- North America: $12.8 million
- Europe: $6.7 million
- Asia-Pacific: $3.5 million
- Rest of World: $1.5 million

Future Outlook:
The company expects continued growth in the coming fiscal year, with projected revenue increase of 12-18%. Strategic investments in R&D and market expansion are planned to sustain long-term growth and competitive advantage.

Prepared by:
Financial Department
Acme Corporation
January 15, 2024
`

export default function ExtractedContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedText, setHighlightedText] = useState(sampleExtractedText)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate delay for content to appear after processing
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 7000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setHighlightedText(sampleExtractedText)
      return
    }

    const regex = new RegExp(`(${searchTerm})`, "gi")
    const highlighted = sampleExtractedText.replace(
      regex,
      '<span class="bg-yellow-500/30 text-white px-1 rounded">$1</span>',
    )
    setHighlightedText(highlighted)
  }, [searchTerm])

  if (!isVisible) {
    return null
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader className="border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Extracted Content</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search within document..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <pre
            className="p-6 text-sm font-mono overflow-auto max-h-[500px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          ></pre>
        </div>
      </CardContent>
    </Card>
  )
}
