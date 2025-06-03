"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const processingSteps = [
  "Initializing document analysis...",
  "Extracting text from PDF...",
  "Analyzing document structure...",
  "Identifying key information...",
  "Processing complete!",
]

export default function ProcessingStatus() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentStep < processingSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setIsComplete(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Processing Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          {!isComplete ? (
            <>
              <div className="p-3 bg-secondary rounded-full">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-lg font-medium text-center">{processingSteps[currentStep]}</p>
              <div className="w-full max-w-md bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep + 1) / processingSteps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </>
          ) : (
            <p className="text-lg font-medium text-green-500">Processing complete! Scroll down to view results.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
