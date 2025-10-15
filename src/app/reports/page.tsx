"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Trash2, Eye, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatConfidence } from "@/lib/utils"
import documentsData from "@/data/documents.json"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Document = typeof documentsData[0]

export default function ReportsPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    documentsData.slice(0, 5).map(doc => doc.id)
  )
  const [exportFormat, setExportFormat] = useState<string>("bibtex")

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedItems.length === documentsData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(documentsData.map(doc => doc.id))
    }
  }

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    toast.success("Item removed from report")
  }

  const exportReport = () => {
    const formats: Record<string, string> = {
      bibtex: "BibTeX",
      apa: "APA",
      mla: "MLA",
      chicago: "Chicago",
      json: "JSON",
      csv: "CSV"
    }
    toast.success(`Exporting ${selectedItems.length} items as ${formats[exportFormat]}`)
  }

  const selectedDocs = documentsData.filter(doc => selectedItems.includes(doc.id))

  // Chart data
  const chartData = selectedDocs.map(doc => ({
    name: doc.title.split(' ').slice(0, 2).join(' '),
    citations: doc.citations,
    confidence: Math.round(doc.confidence * 100)
  }))

  const stats = [
    { label: "Selected Items", value: selectedItems.length },
    { label: "Total Citations", value: selectedDocs.reduce((sum, doc) => sum + doc.citations, 0) },
    { label: "Avg. Confidence", value: `${Math.round(selectedDocs.reduce((sum, doc) => sum + doc.confidence, 0) / selectedDocs.length * 100)}%` },
  ]

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Reports & Citations</h1>
          <p className="text-lg text-muted-foreground">
            Manage your selected evidence and export citations in multiple formats
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        {selectedItems.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Citation Overview
              </CardTitle>
              <CardDescription>
                Citation counts and confidence scores for selected items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.625rem"
                    }}
                  />
                  <Bar dataKey="citations" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Export Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
            <CardDescription>
              Choose your preferred citation format and download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="sm:w-[200px]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bibtex">BibTeX</SelectItem>
                  <SelectItem value="apa">APA Style</SelectItem>
                  <SelectItem value="mla">MLA Style</SelectItem>
                  <SelectItem value="chicago">Chicago Style</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={exportReport}
                disabled={selectedItems.length === 0}
                className="sm:flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Export {selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Items Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Selected Items</CardTitle>
                <CardDescription>
                  Manage items included in your report
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedItems.length === documentsData.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedItems.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items selected</h3>
                <p className="text-muted-foreground mb-4">
                  Add items from the search page to create your report
                </p>
                <Button variant="outline" asChild>
                  <a href="/search">Go to Search</a>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === documentsData.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead className="text-center">Citations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDocs.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(doc.id)}
                          onCheckedChange={() => toggleItem(doc.id)}
                        />
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="space-y-1">
                          <p className="font-medium">{doc.title}</p>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 2).map((tag) => (
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
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}