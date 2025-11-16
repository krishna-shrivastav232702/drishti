"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Sparkles, BookmarkPlus, Languages, AlertCircle, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { simulateLoading } from "@/lib/utils"
import documentsData from "@/data/documents.json"

type Message = typeof documentsData[0]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [summary, setSummary] = useState<string[]>([])

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    // Simulate multilingual search with loading
    const searchResults = await simulateLoading(
      documentsData.filter(doc => 
        doc.text.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        doc.participants.some(p => p.toLowerCase().includes(query.toLowerCase())) ||
        // Multilingual mappings
        (query.toLowerCase().includes("money") && (doc.text.includes("lac") || doc.text.includes("paise") || doc.text.includes("UPI"))) ||
        (query.toLowerCase().includes("meet") && (doc.text.includes("milte") || doc.text.includes("meeting"))) ||
        (query.toLowerCase().includes("send") && (doc.text.includes("send") || doc.text.includes("bhejne"))) ||
        (query.toLowerCase().includes("ready") && doc.text.includes("ready")) ||
        (query.toLowerCase().includes("police") && doc.text.includes("police"))
      ),
      1500
    )

    setResults(searchResults)
    setIsLoading(false)
    
    // Generate AI summary with citations
    if (searchResults.length > 0) {
      const summaryPoints = [
        `Financial transaction discussions detected involving amounts up to ₹2 lac [msg:${searchResults[0]?.message_id} ${new Date(searchResults[0]?.timestamp).toLocaleString()}]`,
        `Multiple references to UPI transfers and payment confirmations [msg:${searchResults[1]?.message_id || 'W1235'} ${new Date(searchResults[1]?.timestamp || '2024-03-12T22:18:30Z').toLocaleString()}]`,
        `Coordination of physical meetings at specific times and locations [msg:${searchResults[2]?.message_id || 'W1236'} ${new Date(searchResults[2]?.timestamp || '2024-03-13T15:22:00Z').toLocaleString()}]`
      ]
      setSummary(summaryPoints)
      toast.success(`Found ${searchResults.length} relevant messages`)
    } else {
      setSummary([])
      toast.info("No results found. Try: 'paise', 'meeting', 'police', 'UPI', 'jugad'")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const addToReport = (msg: Message) => {
    toast.success(`Added message ${msg.message_id} to report`)
  }

  const exampleQueries = [
    "paise bhejne (send money)",
    "meeting arrangements",
    "deleted messages",
    "UPI transfers",
    "suspicious activity"
  ]

  const getAppIcon = (app: string) => {
    const colors: { [key: string]: string } = {
      "WhatsApp": "bg-green-500",
      "Telegram": "bg-blue-500",
      "Signal": "bg-indigo-500"
    }
    return colors[app] || "bg-gray-500"
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Multilingual Search</h1>
          <p className="text-lg text-muted-foreground">
            Search in English, Hindi, or Hinglish — AI understands code-switched text
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search: 'paise bhejne', 'meeting setup', 'UPI transfer'..."
                  className="pl-10 h-12 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Try multilingual search:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example) => (
                    <Badge
                      key={example}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        setQuery(example.split(" (")[0])
                        setTimeout(handleSearch, 100)
                      }}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        {!isLoading && hasSearched && results.length > 0 && summary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Generated Summary
                </CardTitle>
                <CardDescription>
                  Key insights with verifiable citations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {summary.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!isLoading && hasSearched && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({results.length} messages)</CardTitle>
              <CardDescription>
                All results include court-ready citations with Message ID, Timestamp, and Device Source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message & Context</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Evidence Citation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((msg, index) => (
                    <motion.tr
                      key={msg.message_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <TableCell className="max-w-md">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getAppIcon(msg.app)}`} />
                            <Badge variant="secondary" className="text-xs">
                              {msg.app}
                            </Badge>
                            {msg.deleted && (
                              <Badge variant="destructive" className="text-xs">
                                RECOVERED
                              </Badge>
                            )}
                            {msg.language === "Hinglish" && (
                              <Badge variant="outline" className="text-xs">
                                <Languages className="h-3 w-3 mr-1" />
                                Hinglish
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm leading-relaxed">
                            &quot;{msg.text}&quot;
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {msg.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{msg.sender}</p>
                          <p className="text-xs text-muted-foreground">
                            → {msg.participants.filter(p => p !== msg.sender).join(", ")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">ID:</span>
                            <code className="bg-muted px-2 py-0.5 rounded">{msg.message_id}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Time:</span>
                            <span className="text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Smartphone className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-xs leading-tight">
                              {msg.device}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToReport(msg)}
                        >
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Add to Report
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!isLoading && hasSearched && results.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try: &quot;paise&quot;, &quot;meeting&quot;, &quot;UPI&quot;, &quot;jugad&quot;, &quot;police&quot;
              </p>
              <Button variant="outline" onClick={() => {
                setQuery("")
                setHasSearched(false)
                setResults([])
                setSummary([])
              }}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}