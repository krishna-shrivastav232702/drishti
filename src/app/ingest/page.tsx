"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquare,
  Phone,
  Image as ImageIcon,
  Users
} from "lucide-react"
import { toast } from "sonner"
import { simulateLoading } from "@/lib/utils"
import advisorData from "@/data/advisor.json"

export default function IngestPage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      toast.success(`File "${file.name}" uploaded successfully`)
    }
  }

  const handleRunCheck = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a UFDR/XRY report first")
      return
    }

    setIsAnalyzing(true)
    setShowResults(false)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    await simulateLoading(null, 2500)
    
    setIsAnalyzing(false)
    setShowResults(true)
    toast.success("Completeness check completed!")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Ingest & Validate</h1>
          <p className="text-lg text-muted-foreground">
            Upload UFDR/XRY/Oxygen reports and validate extraction completeness
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Extraction Report
            </CardTitle>
            <CardDescription>
              <strong className="text-destructive">Demo Only:</strong> No actual file processing. 
              Click "Run Completeness Check" to simulate analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".zip,.ufdr,.xry,.xml"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">
                  {uploadedFile || "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground">
                  UFDR, XRY, or Oxygen extraction files (.zip, .ufdr, .xry, .xml)
                </p>
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <Button 
                size="lg"
                onClick={handleRunCheck}
                disabled={!uploadedFile || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Completeness Check
                  </>
                )}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Validating extraction integrity...</span>
                  <span className="font-medium">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && (
          <>
            {/* Extraction Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Extraction Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant={advisorData.extraction_status.complete ? "default" : "destructive"} className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {advisorData.extraction_status.complete 
                        ? "Extraction Complete" 
                        : "Incomplete Extraction Detected"}
                    </AlertTitle>
                    <AlertDescription>
                      Confidence Score: {(advisorData.extraction_status.confidence * 100).toFixed(0)}% • 
                      {" "}{advisorData.extraction_status.device_count} devices analyzed • 
                      {" "}{advisorData.extraction_summary.apps_extracted.length} apps extracted
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{advisorData.extraction_summary.total_messages}</p>
                            <p className="text-sm text-muted-foreground">Messages</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Phone className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{advisorData.extraction_summary.total_calls}</p>
                            <p className="text-sm text-muted-foreground">Calls</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{advisorData.extraction_summary.total_media}</p>
                            <p className="text-sm text-muted-foreground">Media Files</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Users className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{advisorData.extraction_summary.total_contacts}</p>
                            <p className="text-sm text-muted-foreground">Contacts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Missing Artifacts Advisor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Missing Evidence Advisor
                  </CardTitle>
                  <CardDescription>
                    Critical gaps detected in extraction — re-extraction recommended
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {advisorData.missing_artifacts.map((artifact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Alert variant={artifact.severity === "high" ? "destructive" : "default"}>
                        <div className="flex items-start gap-4">
                          {artifact.severity === "high" ? (
                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <AlertTitle className="mb-0">{artifact.type}</AlertTitle>
                              <Badge variant={getSeverityColor(artifact.severity)}>
                                {artifact.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <AlertDescription className="mb-2">
                              <strong>Issue:</strong> {artifact.reason}
                            </AlertDescription>
                            <AlertDescription className="text-xs">
                              <strong>Recommendation:</strong> {artifact.recommendation}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Anomalies Detected */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Suspicious Patterns Detected
                  </CardTitle>
                  <CardDescription>
                    AI has identified {advisorData.anomalies.length} suspicious patterns requiring investigation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {advisorData.anomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        anomaly.risk_level === "high" ? "text-destructive" : "text-orange-500"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{anomaly.type}</p>
                          <Badge variant={anomaly.risk_level === "high" ? "destructive" : "default"}>
                            {anomaly.risk_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {typeof anomaly.timestamp === 'string' && anomaly.timestamp.includes('to') 
                            ? anomaly.timestamp 
                            : new Date(anomaly.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>
                    Despite incomplete extraction, you can proceed with analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      size="lg"
                      onClick={() => router.push("/search")}
                      className="flex-1"
                    >
                      Proceed to Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => router.push("/network")}
                      className="flex-1"
                    >
                      View Network Graph
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}