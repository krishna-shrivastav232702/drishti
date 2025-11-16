"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Network as NetworkIcon, Users, Smartphone, MessageSquare, AlertTriangle, Phone } from "lucide-react"
import { toast } from "sonner"
import graphData from "@/data/graph.json"
import entitiesData from "@/data/entities.json"

// @ts-ignore
import cytoscape from "cytoscape"

export default function NetworkPage() {
  const cyRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (!containerRef.current || cyRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        // Nodes
        ...graphData.nodes.map((node: any) => ({
          data: { 
            id: node.id, 
            label: node.label,
            type: node.type,
            role: node.role,
            risk_score: node.risk_score
          }
        })),
        // Edges
        ...graphData.edges.map((edge: any, index: number) => ({
          data: { 
            id: `edge-${index}`,
            source: edge.source, 
            target: edge.target,
            label: edge.kind,
            count: edge.count,
            app: edge.app
          }
        }))
      ],
      style: [
        {
          selector: 'node[type="person"]',
          style: {
            'background-color': (ele: any) => {
              const risk = ele.data('risk_score') || 0
              if (risk > 0.85) return '#ef4444'
              if (risk > 0.70) return '#f97316'
              return '#3b82f6'
            },
            'label': 'data(label)',
            'width': (ele: any) => {
              const risk = ele.data('risk_score') || 0
              return 40 + (risk * 30)
            },
            'height': (ele: any) => {
              const risk = ele.data('risk_score') || 0
              return 40 + (risk * 30)
            },
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'font-weight': 'bold',
            'text-outline-width': 2,
            'text-outline-color': '#000'
          }
        },
        {
          selector: 'node[type="device"]',
          style: {
            'background-color': '#8b5cf6',
            'shape': 'rectangle',
            'label': 'data(label)',
            'width': 50,
            'height': 30,
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'text-outline-width': 2,
            'text-outline-color': '#000'
          }
        },
        {
          selector: 'node[type="app"]',
          style: {
            'background-color': '#10b981',
            'shape': 'diamond',
            'label': 'data(label)',
            'width': 40,
            'height': 40,
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'text-outline-width': 2,
            'text-outline-color': '#000'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (ele: any) => Math.min(2 + (ele.data('count') || 0) / 10, 10),
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'color': '#64748b',
            'text-background-color': '#fff',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 8000,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        nestingFactor: 1.2,
        gravity: 1,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    })

    cy.on('tap', 'node', (evt: any) => {
      const node = evt.target
      const nodeData = node.data()
      
      // Find entity details
      if (nodeData.type === 'person') {
        const entity = entitiesData.find((e: any) => e.id === nodeData.id)
        setSelectedNode({
          ...nodeData,
          details: entity
        })
        setIsDrawerOpen(true)
      }
    })

    cyRef.current = cy

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
        cyRef.current = null
      }
    }
  }, [])

  const fitGraph = () => {
    if (cyRef.current) {
      cyRef.current.fit(50)
      toast.success("Graph view reset")
    }
  }

  const getRiskColor = (score: number) => {
    if (score > 0.85) return "text-red-500"
    if (score > 0.70) return "text-orange-500"
    return "text-blue-500"
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Communication Network</h1>
          <p className="text-lg text-muted-foreground">
            Person ↔ Device ↔ App relationship graph with coordinator/bridge detection
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Graph Visualization */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NetworkIcon className="h-5 w-5" />
                Network Graph
              </CardTitle>
              <CardDescription>
                Click on nodes to view details • Edge thickness = communication frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                ref={containerRef}
                className="w-full h-[600px] bg-muted/30 rounded-lg border border-border"
              />
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={fitGraph}>
                  Reset View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legend & Key Entities */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500" />
                  <div>
                    <p className="font-medium text-sm">High Risk</p>
                    <p className="text-xs text-muted-foreground">Score &gt; 0.85</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Medium Risk</p>
                    <p className="text-xs text-muted-foreground">Score 0.70-0.85</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Low Risk</p>
                    <p className="text-xs text-muted-foreground">Score &lt; 0.70</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Key Entities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {entitiesData
                  .filter((e: any) => e.type === "person" && e.risk_score > 0.7)
                  .sort((a: any, b: any) => b.risk_score - a.risk_score)
                  .map((entity: any) => (
                    <div key={entity.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{entity.name}</p>
                        <Badge variant={entity.risk_score > 0.85 ? "destructive" : "default"}>
                          {entity.role}
                        </Badge>
                      </div>
                      <p className={`text-xs font-semibold ${getRiskColor(entity.risk_score)}`}>
                        Risk: {(entity.risk_score * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entity.reason}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Node Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedNode?.label}</SheetTitle>
            <SheetDescription>
              {selectedNode?.type === "person" ? "Person Profile" : "Node Details"}
            </SheetDescription>
          </SheetHeader>
          
          {selectedNode?.details && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Assessment
                </h3>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role</span>
                    <Badge>{selectedNode.details.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Score</span>
                    <span className={`font-bold ${getRiskColor(selectedNode.details.risk_score)}`}>
                      {(selectedNode.details.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Why flagged:</strong> {selectedNode.details.reason}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {selectedNode.details.phones.map((phone: string, idx: number) => (
                    <div key={idx} className="p-2 bg-muted rounded text-sm font-mono">
                      {phone}
                    </div>
                  ))}
                </div>
              </div>

              {selectedNode.details.devices && selectedNode.details.devices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Devices
                  </h3>
                  <div className="space-y-3">
                    {selectedNode.details.devices.map((device: any, idx: number) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">{device.model}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          IMEI: {device.imei}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {device.apps.map((app: string) => (
                            <Badge key={app} variant="secondary" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}