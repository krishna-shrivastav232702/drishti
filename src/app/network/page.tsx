"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import CytoscapeComponent from "react-cytoscapejs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ZoomIn, ZoomOut, Maximize2, RefreshCw, Network as NetworkIcon } from "lucide-react"
import { toast } from "sonner"
import { simulateLoading } from "@/lib/utils"
import networkData from "@/data/network.json"

interface NodeData {
  id: string
  label: string
  type: string
  citations?: number
}

export default function NetworkPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const cyRef = useRef<any>(null)

  useEffect(() => {
    loadNetworkData()
  }, [])

  const loadNetworkData = async () => {
    setIsLoading(true)
    await simulateLoading(null, 1000)
    setIsLoading(false)
    toast.success("Network graph loaded successfully")
  }

  const cytoscapeElements = [
    ...networkData.nodes.map(node => ({
      data: { 
        id: node.id, 
        label: node.label,
        type: node.type,
        citations: node.citations
      }
    })),
    ...networkData.edges.map((edge, index) => ({
      data: { 
        id: `edge-${index}`,
        source: edge.source, 
        target: edge.target,
        type: edge.type
      }
    }))
  ]

  const cytoscapeStylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#6366f1',
        'label': 'data(label)',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '10px',
        'width': '40px',
        'height': '40px'
      }
    },
    {
      selector: 'node[type="document"]',
      style: {
        'background-color': '#6366f1',
        'shape': 'ellipse'
      }
    },
    {
      selector: 'node[type="author"]',
      style: {
        'background-color': '#8b5cf6',
        'shape': 'rectangle'
      }
    },
    {
      selector: 'node[type="topic"]',
      style: {
        'background-color': '#14b8a6',
        'shape': 'diamond'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#cbd5e1',
        'target-arrow-color': '#cbd5e1',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'border-color': '#f59e0b'
      }
    }
  ]

  const handleNodeTap = (event: any) => {
    const node = event.target
    const nodeData: NodeData = {
      id: node.data('id'),
      label: node.data('label'),
      type: node.data('type'),
      citations: node.data('citations')
    }
    setSelectedNode(nodeData)
    setIsDrawerOpen(true)
  }

  const handleZoomIn = () => {
    if (cyRef.current) {
      const cy = cyRef.current
      cy.zoom(cy.zoom() * 1.2)
    }
  }

  const handleZoomOut = () => {
    if (cyRef.current) {
      const cy = cyRef.current
      cy.zoom(cy.zoom() * 0.8)
    }
  }

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.fit()
      toast.success("View reset to default")
    }
  }

  const handleCenterView = () => {
    if (cyRef.current) {
      cyRef.current.center()
    }
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-500'
      case 'author': return 'bg-purple-500'
      case 'topic': return 'bg-teal-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Knowledge Graph</h1>
          <p className="text-lg text-muted-foreground">
            Explore connections between documents, authors, and research topics
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Network Visualization</CardTitle>
                    <CardDescription>
                      Click on nodes to view details • Drag to pan • Scroll to zoom
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleCenterView}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleResetView}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[600px] bg-muted/20">
                    <div className="text-center space-y-4">
                      <NetworkIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
                      <p className="text-muted-foreground">Loading network graph...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[600px] bg-muted/20">
                    <CytoscapeComponent
                      elements={cytoscapeElements}
                      style={{ width: '100%', height: '100%' }}
                      stylesheet={cytoscapeStylesheet}
                      layout={{
                        name: 'cose',
                        animate: true,
                        animationDuration: 1000,
                        nodeRepulsion: 8000,
                        idealEdgeLength: 100,
                        edgeElasticity: 100,
                        nestingFactor: 5,
                        gravity: 80,
                        numIter: 1000,
                        initialTemp: 200,
                        coolingFactor: 0.95,
                        minTemp: 1.0
                      }}
                      cy={(cy) => {
                        cyRef.current = cy
                        cy.on('tap', 'node', handleNodeTap)
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
                <CardDescription>Node types in the graph</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Documents</p>
                    <p className="text-xs text-muted-foreground">Research papers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Authors</p>
                    <p className="text-xs text-muted-foreground">Researchers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rotate-45 bg-teal-500" />
                  <div>
                    <p className="text-sm font-medium">Topics</p>
                    <p className="text-xs text-muted-foreground">Research areas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Documents</span>
                  <Badge variant="secondary">
                    {networkData.nodes.filter(n => n.type === 'document').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Authors</span>
                  <Badge variant="secondary">
                    {networkData.nodes.filter(n => n.type === 'author').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Topics</span>
                  <Badge variant="secondary">
                    {networkData.nodes.filter(n => n.type === 'topic').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Connections</span>
                  <Badge variant="secondary">{networkData.edges.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Node Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full ${getNodeTypeColor(selectedNode?.type || '')}`} />
              {selectedNode?.label}
            </SheetTitle>
            <SheetDescription>
              {selectedNode?.type && (
                <Badge variant="outline" className="mt-2">
                  {selectedNode.type}
                </Badge>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Node ID</p>
              <p className="text-sm text-muted-foreground font-mono">{selectedNode?.id}</p>
            </div>
            {selectedNode?.citations && (
              <div>
                <p className="text-sm font-medium mb-1">Citations</p>
                <p className="text-2xl font-bold text-primary">{selectedNode.citations}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-2">Connected Nodes</p>
              <p className="text-sm text-muted-foreground">
                This node is connected to {networkData.edges.filter(e => 
                  e.source === selectedNode?.id || e.target === selectedNode?.id
                ).length} other nodes in the graph.
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <Button className="w-full" variant="outline">
                View Full Details
              </Button>
              <Button className="w-full" variant="outline">
                Explore Connections
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}