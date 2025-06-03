import FileUpload from "@/components/file-upload"

export default function Home() {
  return (
    <div className="container py-12 space-y-16">
      <section className="text-center space-y-6 pt-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Intelligent Document Processing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Upload PDFs. Extract insights. Powered by AI.</p>
      </section>

      <section className="py-8">
        <FileUpload />
      </section>

      <section className="max-w-3xl mx-auto text-center space-y-6 py-8">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">1</div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">Upload your PDF documents securely to our platform</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">2</div>
            <h3 className="text-lg font-medium mb-2">Process</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes and extracts key information from your documents
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/50">
            <div className="text-3xl font-bold mb-2">3</div>
            <h3 className="text-lg font-medium mb-2">Extract</h3>
            <p className="text-sm text-muted-foreground">Get structured data and insights from your documents</p>
          </div>
        </div>
      </section>
    </div>
  )
}
