"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  FileText, 
  Download, 
  Copy, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Smartphone,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"
import documentsData from "@/data/documents.json"
import entitiesData from "@/data/entities.json"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ReportsPage() {
  const [selectedItems, setSelectedItems] = useState<any[]>(documentsData.slice(0, 5))

  const removeItem = (messageId: string) => {
    setSelectedItems(prev => prev.filter(item => item.message_id !== messageId))
    toast.success(`Removed ${messageId} from report`)
  }

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all selected evidence?")) {
      setSelectedItems([])
      toast.success("All items cleared from report")
    }
  }

  const handleCopy = () => {
    const reportText = generateReportText()
    navigator.clipboard.writeText(reportText)
    toast.success("Report copied to clipboard")
  }

  const handleDownload = () => {
    toast.info("PDF download is a demo feature — no actual file generated")
    setTimeout(() => {
      toast.success("Report_Case_2024_03.pdf would be generated")
    }, 1000)
  }

  const generateReportText = () => {
    let report = "=== FORENSIC INVESTIGATION REPORT ===\\n\\n"
    report += "Executive Summary:\\n"
    report += "Investigation reveals coordinated financial transactions and meeting arrangements between multiple suspects. "
    report += `${selectedItems.length} pieces of evidence analyzed with full chain-of-custody documentation.\\n\\n`
    report += "Key Findings:\\n"
    report += `• ${selectedItems.filter(i => i.tags.includes("Financial")).length} financial transaction discussions\\n`
    report += `• ${selectedItems.filter(i => i.deleted).length} recovered deleted messages\\n`
    report += `• ${new Set(selectedItems.flatMap(i => i.participants)).size} unique individuals identified\\n\\n`
    report += "Evidence Annexure:\\n"
    selectedItems.forEach((item, idx) => {
      report += `${idx + 1}. [${item.message_id}] ${new Date(item.timestamp).toLocaleString()} - "${item.text}"\\n`
    })
    return report
  }

  // Chart data
  const messagesByApp = [
    { app: "WhatsApp", count: selectedItems.filter(i => i.app === "WhatsApp").length },
    { app: "Telegram", count: selectedItems.filter(i => i.app === "Telegram").length }
  ].filter(d => d.count > 0)

  const messagesByTag = Array.from(
    new Set(selectedItems.flatMap(i => i.tags))
  ).map(tag => ({
    tag,
    count: selectedItems.filter(i => i.tags.includes(tag)).length
  }))

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Court-Ready Report</h1>
          <p className="text-lg text-muted-foreground">
            Evidence-backed, citation-verified investigation report
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Executive Summary
            </CardTitle>
            <CardDescription>
              AI-generated overview with verifiable citations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Investigation Findings</AlertTitle>
              <AlertDescription>
                Analysis of {selectedItems.length} evidence items reveals coordinated financial transactions 
                involving amounts up to ₹2 lac, with suspicious deletion patterns and odd-hour communications.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Financial Activity:</strong> {selectedItems.filter(i => i.tags.includes("Financial")).length} messages 
                  discussing monetary transfers, UPI payments, and cash arrangements [msg:W1234, W1235, T5679]
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Meeting Coordination:</strong> Multiple references to physical meetings at specific times 
                  and locations [msg:W1236 - "Meeting kal raat 11pm, usual spot pe"]
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Deleted Evidence:</strong> {selectedItems.filter(i => i.deleted).length} deleted message(s) 
                  recovered containing suspicious content [msg:W1237_DELETED]
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Network Analysis:</strong> {new Set(selectedItems.flatMap(i => i.participants)).size} individuals 
                  identified with Rahul Sharma as central coordinator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Messages by App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={messagesByApp}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="app" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Evidence by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={messagesByTag}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tag" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Evidence Annexure</CardTitle>
                <CardDescription>
                  {selectedItems.length} items with full chain-of-custody documentation
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={clearAll}
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedItems.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No evidence items in report</p>
                <p className="text-sm mt-2">Use "Add to Report" from Search or Timeline pages</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message ID</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item, index) => (
                    <motion.tr
                      key={item.message_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-0.5 rounded">
                            {item.message_id}
                          </code>
                          {item.deleted && (
                            <Badge variant="destructive" className="text-xs">
                              RECOVERED
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">&quot;{item.text}&quot;</p>
                        <div className="flex gap-1 mt-1">
                          {item.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.participants.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1">
                          <Smartphone className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">
                            {item.device.split("(")[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.message_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Key Entities */}
        <Card>
          <CardHeader>
            <CardTitle>Key Entities & Risk Assessment</CardTitle>
            <CardDescription>
              Individuals identified in evidence with risk scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {entitiesData
                .filter((e: any) => e.type === "person")
                .sort((a: any, b: any) => b.risk_score - a.risk_score)
                .map((entity: any) => (
                  <div key={entity.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{entity.name}</h3>
                      <Badge variant={entity.risk_score > 0.85 ? "destructive" : "default"}>
                        {entity.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {entity.reason}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Risk Score:</span>
                      <span className={`font-bold ${
                        entity.risk_score > 0.85 ? "text-red-500" : 
                        entity.risk_score > 0.70 ? "text-orange-500" : 
                        "text-blue-500"
                      }`}>
                        {(entity.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}