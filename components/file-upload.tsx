"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploadStatus("idle")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  const handleUpload = () => {
    if (!file) return

    setUploadStatus("uploading")

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploadStatus("success")
        setTimeout(() => {
          router.push("/processing")
        }, 1000)
      }
    }, 100)
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadStatus("idle")
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border"
        } ${file ? "bg-secondary/20" : ""}`}
      >
        <input {...getInputProps()} />
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-secondary rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">Drag & drop your PDF here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
            </div>
            <p className="text-xs text-muted-foreground">Supported file: PDF (max 10MB)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-secondary rounded-full">
              <File className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>

      {file && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadStatus === "idle" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile()
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                )}
                {uploadStatus === "success" && (
                  <div className="p-1 bg-green-500/20 rounded-full">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {uploadStatus === "uploading" && <Progress value={uploadProgress} className="h-1 mt-3" />}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex justify-center">
        <Button size="lg" className="px-8" disabled={!file || uploadStatus !== "idle"} onClick={handleUpload}>
          {uploadStatus === "uploading" ? "Uploading..." : "Process PDF"}
        </Button>
      </div>
    </div>
  )
}
