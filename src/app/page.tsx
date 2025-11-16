"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Upload, 
  Search, 
  Network, 
  Calendar, 
  FileText, 
  Shield, 
  Eye,
  Languages,
  ScanEye,
  Image,
  GitGraph,
  Clock,
  FileCheck,
  AlertTriangle
} from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Integrity Validation",
      description: "UFDR manifest verification checks for missing logs, incomplete exports, and selective extractions before analysis.",
      href: "/ingest",
      color: "text-red-500"
    },
    {
      icon: GitGraph,
      title: "Cross-Source Fusion",
      description: "Unified graph of Person ↔ Device ↔ App ↔ Messages/Calls/Media across UFDR, XRY, and Oxygen exports.",
      href: "/network",
      color: "text-blue-500"
    },
    {
      icon: Languages,
      title: "Multilingual Search",
      description: "Hinglish-aware semantic search with transliteration normalization for code-switched conversations.",
      href: "/search",
      color: "text-purple-500"
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      description: "Automatic detection of suspicious patterns, burst activity, deleted artifacts, and communication gaps.",
      href: "/search",
      color: "text-orange-500"
    },
    {
      icon: Image,
      title: "Media Triage (OCR + Vision)",
      description: "Extract text from images, detect objects, identify sensitive items—make all media searchable by content.",
      href: "/search",
      color: "text-pink-500"
    },
    {
      icon: Network,
      title: "Relationship Graphs",
      description: "Visualize who talked to whom, how often, with explainability for coordinators, bridges, and outliers.",
      href: "/network",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "Timeline Reconstruction",
      description: "Minute-by-minute chronology of chats, calls, locations, and media with cross-app correlation.",
      href: "/timeline",
      color: "text-cyan-500"
    },
    {
      icon: FileCheck,
      title: "Court-Ready Reports",
      description: "Evidence-cited reports with message IDs, timestamps, file paths, and device sources—no hallucinations.",
      href: "/reports",
      color: "text-indigo-500"
    },
    {
      icon: ScanEye,
      title: "Chain-of-Custody Safe",
      description: "Deterministic pipelines with artifact hashing, model versioning, and immutable audit trails.",
      href: "/reports",
      color: "text-teal-500"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "No Blind Spots",
      description: "Pre-analysis integrity checks ensure complete extractions before investigation begins."
    },
    {
      icon: Eye,
      title: "Hidden Intelligence",
      description: "Detect deleted messages, implied files, and patterns that break normal behavior."
    },
    {
      icon: FileText,
      title: "Legally Defensible",
      description: "Every claim includes evidence IDs, timestamps, and source paths for court verification."
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-4" variant="secondary">
              <Shield className="mr-1 h-3 w-3" />
              AI-Assisted Forensic Intelligence Platform
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              From UFDR to Evidence,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Fast
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Drishti analyzes UFDR, XRY, and Oxygen mobile extraction reports—validates integrity, 
              uncovers hidden patterns, performs multilingual Hinglish search, and generates court-ready, 
              evidence-backed investigation reports.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/ingest">
                  Upload UFDR Report (Demo)
                  <Upload className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/search">
                  Open Sample Case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities - 9 Features */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              9 Core Capabilities
            </h2>
            <p className="text-lg text-muted-foreground">
              From integrity validation to court-ready reports—built for forensic correctness.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={feature.href}>
                    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group cursor-pointer">
                      <CardHeader>
                        <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${feature.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Drishti */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Drishti?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for investigators, verified by forensic standards.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Analyze Your Case?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload UFDR/XRY/Oxygen reports, run integrity checks, search in Hinglish, 
              visualize networks, and export court-ready evidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/ingest">
                  Start Analysis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/search">
                  Explore Demo Case
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Shield className="inline h-4 w-4 mr-1" />
              Demo Only — Mock Data, No Real Evidence
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}