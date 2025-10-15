"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowRight, Upload, Search, Network, Calendar, FileText, Sparkles, Shield, Zap } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Upload,
      title: "Ingest Documents",
      description: "Upload and process research papers, reports, and documents with AI-powered extraction.",
      href: "/ingest",
      color: "text-blue-500"
    },
    {
      icon: Search,
      title: "Natural Language Search",
      description: "Find relevant evidence using conversational queries powered by semantic search.",
      href: "/search",
      color: "text-purple-500"
    },
    {
      icon: Network,
      title: "Knowledge Graph",
      description: "Visualize connections between documents, authors, and topics in an interactive network.",
      href: "/network",
      color: "text-green-500"
    },
    {
      icon: Calendar,
      title: "Timeline View",
      description: "Explore research evolution chronologically with rich context and relationships.",
      href: "/timeline",
      color: "text-orange-500"
    },
    {
      icon: FileText,
      title: "Export Reports",
      description: "Generate citations and export findings in multiple formats for your research.",
      href: "/reports",
      color: "text-pink-500"
    },
    {
      icon: Sparkles,
      title: "AI Insights",
      description: "Get intelligent recommendations and discover hidden patterns in your research.",
      href: "/search",
      color: "text-yellow-500"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Credible Sources",
      description: "Every piece of evidence is traceable to verified, peer-reviewed sources."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Search millions of documents and get results in milliseconds."
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced machine learning understands context and meaning, not just keywords."
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
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Research Platform
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Evidence You Can{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Cite
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Transform your research workflow with Drishti. Discover, analyze, and cite credible evidence 
              using cutting-edge AI technology. Build knowledge graphs, explore timelines, and export citations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/search">
                  Start Searching
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ingest">
                  Upload Documents
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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
              Powerful Features for Modern Research
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to discover, analyze, and cite research evidence in one platform.
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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

      {/* Benefits Section */}
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
              Why Choose Drishti?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for researchers, by researchers. Trusted by leading institutions worldwide.
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
              Ready to Transform Your Research?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of researchers already using Drishti to discover and cite credible evidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/search">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ingest">
                  Upload Your First Document
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}