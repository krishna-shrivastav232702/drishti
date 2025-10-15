"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Chrono } from "react-chrono"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Calendar, Clock, LayoutList, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import { simulateLoading } from "@/lib/utils"
import timelineData from "@/data/timeline.json"

type TimelineMode = "VERTICAL" | "HORIZONTAL" | "VERTICAL_ALTERNATING"

interface TimelineItem {
  title: string
  cardTitle: string
  cardSubtitle: string
  cardDetailedText: string
  date: string
}

export default function TimelinePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [mode, setMode] = useState<TimelineMode>("VERTICAL_ALTERNATING")
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    loadTimelineData()
  }, [])

  const loadTimelineData = async () => {
    setIsLoading(true)
    await simulateLoading(null, 1000)
    setIsLoading(false)
    toast.success("Timeline loaded successfully")
  }

  const handleItemClick = (item: any) => {
    const fullItem = timelineData[item]
    if (fullItem) {
      setSelectedItem(fullItem)
      setIsDrawerOpen(true)
    }
  }

  const stats = [
    { label: "Total Events", value: timelineData.length },
    { label: "Date Range", value: "Jun - Nov 2023" },
    { label: "Research Areas", value: "10+" },
  ]

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Research Timeline</h1>
          <p className="text-lg text-muted-foreground">
            Explore the chronological evolution of research and discoveries
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-3">View Mode</p>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={mode === "VERTICAL_ALTERNATING" ? "default" : "outline"}
                  onClick={() => setMode("VERTICAL_ALTERNATING")}
                  title="Alternating"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={mode === "VERTICAL" ? "default" : "outline"}
                  onClick={() => setMode("VERTICAL")}
                  title="Vertical"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={mode === "HORIZONTAL" ? "default" : "outline"}
                  onClick={() => setMode("HORIZONTAL")}
                  title="Horizontal"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline Visualization
            </CardTitle>
            <CardDescription>
              Click on any event to view more details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <Calendar className="h-12 w-12 animate-pulse text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading timeline...</p>
                </div>
              </div>
            ) : (
              <div className="timeline-container">
                <Chrono
                  items={timelineData}
                  mode={mode}
                  theme={{
                    primary: "hsl(var(--primary))",
                    secondary: "hsl(var(--muted))",
                    cardBgColor: "hsl(var(--card))",
                    titleColor: "hsl(var(--foreground))",
                    titleColorActive: "hsl(var(--primary))",
                    cardTitleColor: "hsl(var(--card-foreground))",
                  }}
                  fontSizes={{
                    cardSubtitle: "0.875rem",
                    cardText: "0.875rem",
                    cardTitle: "1rem",
                    title: "0.875rem",
                  }}
                  cardHeight={150}
                  scrollable={{ scrollbar: true }}
                  enableOutline
                  useReadMore={false}
                  onItemSelected={handleItemClick}
                  classNames={{
                    card: "timeline-card",
                    cardText: "text-muted-foreground",
                    cardTitle: "font-semibold",
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">{selectedItem?.cardTitle}</SheetTitle>
            <SheetDescription className="text-base">
              {selectedItem?.cardSubtitle}
            </SheetDescription>
          </SheetHeader>
          {selectedItem && (
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedItem.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Badge variant="secondary">{selectedItem.title}</Badge>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedItem.cardDetailedText}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Impact Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Research Citations</span>
                    <Badge>125+</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Media Coverage</span>
                    <Badge>High</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Field Impact</span>
                    <Badge variant="default">Significant</Badge>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  View Full Document
                </Button>
                <Button className="w-full" variant="outline">
                  Add to Report
                </Button>
                <Button className="w-full" variant="outline">
                  Related Research
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <style jsx global>{`
        .timeline-container {
          min-height: 600px;
        }
        .timeline-card {
          border: 1px solid hsl(var(--border));
          border-radius: 0.625rem;
          transition: all 0.2s;
        }
        .timeline-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: hsl(var(--primary));
        }
      `}</style>
    </div>
  )
}