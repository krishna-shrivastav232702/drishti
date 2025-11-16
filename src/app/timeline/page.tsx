"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Clock, MessageSquare, Phone, Image as ImageIcon, AlertTriangle, Smartphone } from "lucide-react"
import { toast } from "sonner"
import timelineData from "@/data/timeline.json"

export default function TimelinePage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  const filteredEvents = timelineData.filter((event: any) => {
    if (filter === "all") return true
    return event.type === filter
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case "chat":
        return MessageSquare
      case "call":
        return Phone
      case "media":
        return ImageIcon
      default:
        return Clock
    }
  }

  const getEventColor = (event: any) => {
    if (event.deleted) return "border-destructive"
    if (event.tags?.includes("Suspicious")) return "border-orange-500"
    if (event.tags?.includes("Financial")) return "border-blue-500"
    return "border-border"
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDrawerOpen(true)
    toast.success(`Viewing event ${event.message_id}`)
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Timeline Reconstruction</h1>
          <p className="text-lg text-muted-foreground">
            Minute-by-minute chronology of chats, calls, media, and locations
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium mr-4">Filter by:</p>
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                All Events ({timelineData.length})
              </Button>
              <Button
                size="sm"
                variant={filter === "chat" ? "default" : "outline"}
                onClick={() => setFilter("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chats
              </Button>
              <Button
                size="sm"
                variant={filter === "call" ? "default" : "outline"}
                onClick={() => setFilter("call")}
              >
                <Phone className="mr-2 h-4 w-4" />
                Calls
              </Button>
              <Button
                size="sm"
                variant={filter === "media" ? "default" : "outline"}
                onClick={() => setFilter("media")}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Media
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Case Chronology</CardTitle>
            <CardDescription>
              {filteredEvents.length} events • March 12-16, 2024 • Click any event for full details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

              {/* Events */}
              <div className="space-y-6">
                {filteredEvents.map((event: any, index: number) => {
                  const Icon = getEventIcon(event.type)
                  const eventDate = new Date(event.timestamp)
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-16"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-background border-4 border-primary flex items-center justify-center">
                        <Icon className="h-3 w-3 text-primary" />
                      </div>

                      {/* Event Card */}
                      <Card
                        className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${getEventColor(event)}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {event.app}
                              </Badge>
                              {event.deleted && (
                                <Badge variant="destructive" className="text-xs">
                                  RECOVERED
                                </Badge>
                              )}
                              {event.tags?.includes("Odd Hours") && (
                                <Badge variant="outline" className="text-xs text-orange-500">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Odd Hours
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {event.message_id}
                            </span>
                          </div>

                          <p className="text-sm font-medium mb-2">
                            {event.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {event.participants.join(" ↔ ")}
                            </span>
                            <span className="font-mono">
                              {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}
                            </span>
                          </div>

                          {event.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {event.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
            <SheetDescription>
              Court-ready evidence citation with full metadata
            </SheetDescription>
          </SheetHeader>

          {selectedEvent && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Message Content</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">&quot;{selectedEvent.description}&quot;</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Evidence Citation</h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="font-semibold text-primary">Message ID:</span>
                    <code>{selectedEvent.message_id}</code>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="font-semibold">Timestamp:</span>
                    <span>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="font-semibold">App:</span>
                    <span>{selectedEvent.app}</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted rounded">
                    <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedEvent.device}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Participants</h3>
                <div className="space-y-2">
                  {selectedEvent.participants.map((participant: string, idx: number) => (
                    <div key={idx} className="p-2 bg-muted rounded text-sm">
                      {participant}
                    </div>
                  ))}
                </div>
              </div>

              {selectedEvent.tags && (
                <div>
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.deleted && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">Deleted Message</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This message was deleted by the sender but recovered during forensic extraction.
                  </p>
                </div>
              )}

              {selectedEvent.media_ref && (
                <div>
                  <h3 className="font-semibold mb-3">Media Reference</h3>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono">{selectedEvent.media_ref}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Referenced media file (not extracted in current report)
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => toast.success(`Added ${selectedEvent.message_id} to report`)}
                >
                  Add to Report
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}