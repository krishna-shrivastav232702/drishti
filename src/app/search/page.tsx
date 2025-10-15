"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Sparkles, ExternalLink, BookmarkPlus, Filter, SortAsc } from "lucide-react"
import { toast } from "sonner"
import { simulateLoading, formatDate, formatConfidence } from "@/lib/utils"
import documentsData from "@/data/documents.json"

type Document = typeof documentsData[0]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    // Simulate search with loading
    const searchResults = await simulateLoading(
      documentsData.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.summary.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        doc.author.toLowerCase().includes(query.toLowerCase())
      ),
      1500
    )

    setResults(searchResults)
    setIsLoading(false)
    
    if (searchResults.length === 0) {
      toast.info("No results found. Try a different query.")
    } else {
      toast.success(`Found ${searchResults.length} relevant documents`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const addToReport = (doc: Document) => {
    toast.success(`Added "${doc.title}" to your report`)
  }

  const exampleQueries = [
    "climate change impact",
    "neural network innovations",
    "quantum computing",
    "healthcare efficiency"
  ]

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Search Evidence</h1>
          <p className="text-lg text-muted-foreground">
            Use natural language to find relevant research and credible sources
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ask a question or describe what you're looking for..."
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
                <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example) => (
                    <Badge
                      key={example}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        setQuery(example)
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

        {/* Filters */}
        {hasSearched && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort by Relevance
              </Button>
            </div>
            {!isLoading && results.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {results.length} results
              </p>
            )}
          </div>
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
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Click on any result to view details or add to your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title & Summary</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead className="text-center">Citations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <TableCell className="max-w-md">
                        <div className="space-y-1">
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {doc.summary}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{doc.author}</p>
                          <p className="text-xs text-muted-foreground">{doc.institution}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(doc.date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={doc.confidence > 0.9 ? "default" : "secondary"}>
                          {formatConfidence(doc.confidence)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {doc.citations}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addToReport(doc)}
                          >
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
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
                Try adjusting your search query or use different keywords
              </p>
              <Button variant="outline" onClick={() => {
                setQuery("")
                setHasSearched(false)
                setResults([])
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