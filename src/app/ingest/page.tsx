"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
  name: string
  size: number
  status: "processing" | "completed" | "error"
  progress: number
  insights?: string[]
}

export default function IngestPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = async (file: File) => {
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      status: "processing",
      progress: 0
    }

    setFiles(prev => [...prev, newFile])

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { ...f, progress: i } : f
      ))
    }

    // Simulate AI insights
    const insights = [
      "Detected 15 citations to peer-reviewed sources",
      "Identified 3 key authors in the research domain",
      "Extracted 8 relevant keywords and topics",
      "Confidence score: 92%"
    ]

    setFiles(prev => prev.map(f => 
      f.name === file.name 
        ? { ...f, status: "completed", progress: 100, insights } 
        : f
    ))

    toast.success(`${file.name} processed successfully!`)
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setIsProcessing(true)

    const droppedFiles = Array.from(e.dataTransfer.files)
    
    for (const file of droppedFiles) {
      if (file.type === "application/pdf" || file.type.includes("document")) {
        await processFile(file)
      } else {
        toast.error(`${file.name} is not a supported file type`)
      }
    }

    setIsProcessing(false)
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setIsProcessing(true)

    const selectedFiles = Array.from(e.target.files)
    
    for (const file of selectedFiles) {
      await processFile(file)
    }

    setIsProcessing(false)
  }

  const advisorTips = [
    {
      icon: FileText,
      title: "Supported Formats",
      description: "PDF, DOC, DOCX, TXT, and more"
    },
    {
      icon: Sparkles,
      title: "AI Extraction",
      description: "Automatically extracts citations, authors, and metadata"
    },
    {
      icon: CheckCircle2,
      title: "Quality Check",
      description: "Validates sources and assigns confidence scores"
    }
  ]

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Ingest Documents</h1>
          <p className="text-lg text-muted-foreground">
            Upload research papers, reports, and documents to extract evidence and build your knowledge base.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Drag and drop your documents or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
                    ${isDragging 
                      ? "border-primary bg-primary/5" 
                      : "border-muted-foreground/25 hover:border-primary/50"
                    }
                  `}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                  />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-1">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to select files from your computer
                  </p>
                  <Badge variant="secondary">PDF, DOC, DOCX, TXT</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Processing Queue</CardTitle>
                  <CardDescription>
                    {files.filter(f => f.status === "completed").length} of {files.length} files processed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {file.status === "processing" && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          )}
                          {file.status === "completed" && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          file.status === "completed" ? "default" : 
                          file.status === "error" ? "destructive" : 
                          "secondary"
                        }>
                          {file.status}
                        </Badge>
                      </div>
                      {file.status === "processing" && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                      {file.status === "completed" && file.insights && (
                        <div className="pl-8 space-y-1">
                          {file.insights.map((insight, i) => (
                            <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Sparkles className="h-3 w-3 text-primary" />
                              {insight}
                            </p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Advisor Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Advisor
                </CardTitle>
                <CardDescription>
                  Tips for optimal document processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {advisorTips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tip.title}</p>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" disabled={files.length === 0}>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Documents
                </Button>
                <Button className="w-full" variant="outline" disabled={files.length === 0}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}