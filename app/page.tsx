import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container py-12 space-y-16">
      <section className="text-center space-y-6 pt-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">DocuMind IntelliOCR</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced OCR document processing powered by Mistral AI. Extract, analyze, and understand your documents with intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/login">
            <Button size="lg" className="px-8">Get Started</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="px-8">Sign Up</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto text-center space-y-6 py-8">
        <h2 className="text-2xl font-semibold">Intelligent Document Processing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your document workflow with AI-powered OCR technology that understands context, extracts key information, and provides actionable insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2 text-primary">OCR</div>
            <h3 className="text-lg font-medium mb-2">Advanced Recognition</h3>
            <p className="text-sm text-muted-foreground">
              State-of-the-art optical character recognition with support for multiple languages and document types
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2 text-primary">AI</div>
            <h3 className="text-lg font-medium mb-2">Mistral Processing</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Mistral AI for intelligent document analysis, data extraction, and contextual understanding
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2 text-primary">Data</div>
            <h3 className="text-lg font-medium mb-2">Smart Extraction</h3>
            <p className="text-sm text-muted-foreground">
              Extract structured data, identify patterns, and generate insights from your documents automatically
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto text-center space-y-6 py-8">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">1</div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">Securely upload your PDF documents to our processing platform</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">2</div>
            <h3 className="text-lg font-medium mb-2">Process</h3>
            <p className="text-sm text-muted-foreground">
              Mistral AI analyzes document structure, extracts text, and identifies key information patterns
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">3</div>
            <h3 className="text-lg font-medium mb-2">Extract</h3>
            <p className="text-sm text-muted-foreground">Receive structured data and actionable insights from your documents</p>
          </div>
        </div>
      </section>
    </div>
  )
}
