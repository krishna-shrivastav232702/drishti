"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Loader2, 
  Shield, 
  MessageSquare, 
  Phone, 
  Users, 
  Image as ImageIcon,
  Smartphone,
  ArrowRight,
  XCircle
} from "lucide-react"
import { toast } from "sonner"
import advisorData from "@/data/advisor.json"

interface UploadedFile {
  name: string
  size: number
  status: "processing" | "completed" | "error"
  progress: number
}

export default function IngestPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAdvisor, setShowAdvisor] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

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
      await new Promise(resolve => setTimeout(resolve, 150))
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { ...f, progress: i } : f
      ))
    }

    setFiles(prev => prev.map(f => 
      f.name === file.name 
        ? { ...f, status: "completed", progress: 100 } 
        : f
    ))

    toast.success(`${file.name} uploaded successfully!`)
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setIsProcessing(true)

    const droppedFiles = Array.from(e.dataTransfer.files)
    
    for (const file of droppedFiles) {
      await processFile(file)
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

  const runCompletenessCheck = async () => {
    setIsProcessing(true)
    toast.info("Running integrity validation...")
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setShowAdvisor(true)
    setShowSummary(true)
    setIsProcessing(false)
    
    if (advisorData.overall_status === "Incomplete") {
      toast.error(`Completeness check found ${advisorData.integrity_check.issues_found} issues`)
    } else {
      toast.success("Extraction validation complete!")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive"
      case "High": return "destructive"
      case "Medium": return "secondary"
      case "Low": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">UFDR/XRY Report Upload</h1>
          <p className="text-lg text-muted-foreground">
            Upload mobile extraction reports and run integrity validation before analysis.
          </p>
          <Badge variant="outline" className="mt-2">
            <Shield className="mr-1 h-3 w-3" />
            Demo Only — Mock Data
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Extraction Reports</CardTitle>
                <CardDescription>
                  Supports UFDR, XRY, and Oxygen Forensic formats
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
                    accept=".zip,.ufdr,.xry,.db,.xml"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                  />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-1">
                    {isDragging ? "Drop extraction reports here" : "Drag & drop UFDR/XRY files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to select files from your computer
                  </p>
                  <Badge variant="secondary">UFDR, XRY, Oxygen, ZIP, DB</Badge>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <Button 
                      onClick={runCompletenessCheck} 
                      disabled={isProcessing || files.some(f => f.status === "processing")}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running Integrity Check...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Run Completeness Check
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>
                    {files.filter(f => f.status === "completed").length} of {files.length} files ready
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
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
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
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Extraction Summary */}
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Extraction Summary</CardTitle>
                    <CardDescription>
                      Parsed data from {advisorData.extracted_summary.devices_analyzed} devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MessageSquare className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.extracted_summary.total_messages}</p>
                          <p className="text-sm text-muted-foreground">Messages</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.extracted_summary.total_calls}</p>
                          <p className="text-sm text-muted-foreground">Calls</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Users className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.extracted_summary.total_contacts}</p>
                          <p className="text-sm text-muted-foreground">Contacts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <ImageIcon className="h-8 w-8 text-pink-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.extracted_summary.total_media}</p>
                          <p className="text-sm text-muted-foreground">Media Files</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Smartphone className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.extracted_summary.total_apps}</p>
                          <p className="text-sm text-muted-foreground">Apps</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Shield className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{advisorData.completeness_score}%</p>
                          <p className="text-sm text-muted-foreground">Complete</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full" size="lg">
                        <a href="/search">
                          Proceed to Search
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Advisor Panel */}
          <div className="space-y-6">
            {!showAdvisor ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Missing-Evidence Advisor
                  </CardTitle>
                  <CardDescription>
                    Upload reports and run integrity check to identify missing artifacts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Validates UFDR manifest
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Checks for missing logs
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Detects incomplete exports
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Identifies missing media
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-destructive/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Issues Found
                      </CardTitle>
                      <Badge variant="destructive">
                        {advisorData.integrity_check.critical_issues} Critical
                      </Badge>
                    </div>
                    <CardDescription>
                      {advisorData.integrity_check.issues_found} artifacts missing or incomplete
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                    {advisorData.missing_artifacts.map((artifact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">{artifact.category}</p>
                              <Badge variant={getSeverityColor(artifact.severity) as any} className="mt-1">
                                {artifact.severity}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {artifact.app}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {artifact.description}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          💡 {artifact.recommendation}
                        </p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Suspicious Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Suspicious Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {advisorData.suspicious_patterns_detected.map((pattern, index) => (
                      <div key={index} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <p className="font-medium text-sm mb-1">{pattern.type}</p>
                        <p className="text-xs text-muted-foreground">{pattern.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}