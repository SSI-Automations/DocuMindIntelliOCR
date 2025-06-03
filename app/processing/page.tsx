import ProcessingStatus from "@/components/processing-status"
import ExtractedContent from "@/components/extracted-content"

export default function ProcessingPage() {
  return (
    <div className="container py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Document Processing</h1>
        <p className="text-muted-foreground">We&apos;re analyzing your document to extract valuable insights</p>
      </section>

      <section>
        <ProcessingStatus />
      </section>

      <section>
        <ExtractedContent />
      </section>
    </div>
  )
}
