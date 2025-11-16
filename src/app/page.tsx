"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Search, 
  Network, 
  Clock, 
  FileText, 
  Upload,
  AlertTriangle,
  Languages,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLoadSampleCase = async () => {
    setLoading(true)
    toast.success("Loading sample UFDR case...")
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false)
      toast.success("Sample case loaded successfully!")
      router.push("/ingest")
    }, 1500)
  }

  const features = [
    {
      icon: Shield,
      title: "UFDR/XRY Validation",
      description: "Validates extraction integrity BEFORE analysis. Detects missing logs, incomplete exports, and selective extractions.",
      color: "text-blue-500"
    },
    {
      icon: Languages,
      title: "Multilingual Search",
      description: "Understands Hinglish, code-switched text, and transliteration. Find 'paise bhejne' = 'send money' = 'transfer funds'.",
      color: "text-purple-500"
    },
    {
      icon: Network,
      title: "Communication Networks",
      description: "Visualizes who-talked-to-whom with coordinator/bridge detection. Cross-app, multi-device relationship graphs.",
      color: "text-teal-500"
    },
    {
      icon: Clock,
      title: "Timeline Reconstruction",
      description: "Minute-by-minute chronology of chats, calls, media, and locations. Automatically builds the story of events.",
      color: "text-orange-500"
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      description: "AI flags suspicious patterns: deleted messages, odd-hour calls, message bursts, and hidden artifacts.",
      color: "text-red-500"
    },
    {
      icon: FileText,
      title: "Court-Ready Reports",
      description: "Every claim includes Message ID, Timestamp, Device Source. No hallucinations. Legally defensible citations.",
      color: "text-green-500"
    }
  ]

  const benefits = [
    {
      title: "Incomplete Extraction Detection",
      description: "Identifies missing WhatsApp call logs, Telegram voice notes, deleted media files BEFORE you start analysis."
    },
    {
      title: "Cross-Source Fusion",
      description: "Unifies evidence from multiple apps, devices, and formats into one coherent investigation graph."
    },
    {
      title: "Hidden Intelligence",
      description: "OCR extracts text from screenshots, IDs, passports. Makes images searchable by content."
    },
    {
      title: "Chain-of-Custody Safe",
      description: "Deterministic pipelines, artifact hashing, model versioning, immutable audit trails."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Assisted Forensic Intelligence Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              From UFDR to Evidence,{" "}
              <span className="text-primary">Fast</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convert mobile extraction reports into evidence-backed, investigation-ready insights. 
              Multilingual search, network graphs, and court-ready citations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => router.push("/ingest")}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload UFDR Report
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={handleLoadSampleCase}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-5 w-5" />
                    Try Sample Case
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Six Core Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drishti solves the critical challenges in mobile forensic analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className={`h-10 w-10 mb-3 ${feature.color}`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Drishti?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional forensic tools assume reports are complete. Drishti knows better.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {benefit.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Investigation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start with a sample case or upload your own UFDR/XRY/Oxygen extraction report
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={handleLoadSampleCase}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Loading Sample...
                  </>
                ) : (
                  <>
                    Try Sample Case
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="py-8 bg-muted">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            <strong className="font-semibold">Demo Only</strong> — Mock Data, No Real Evidence. 
            This is a frontend prototype demonstrating forensic intelligence capabilities.
          </p>
        </div>
      </section>
    </div>
  )
}
