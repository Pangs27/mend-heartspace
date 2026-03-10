import { useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaselineState } from "@/lib/patternSnapshot";
import type { GraphNode, GraphEdge } from "@/hooks/useUnifiedSignals";

/* ── Layout helpers ─────────────────────────────── */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Cluster visual centers
const centers = [
  { x: 24, y: 32 },  // emotional states (lavender)
  { x: 76, y: 28 },  // stabilizers (mint)
  { x: 50, y: 72 },  // context/themes (gray)
];

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  cluster: number;
  size: number;
  label: string;
}

interface LayoutEdge {
  from: string;
  to: string;
  strength: number;
}

function layoutRealNodes(graphNodes: GraphNode[], graphEdges: GraphEdge[]): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const rand = seededRandom(42);
  const nodes: LayoutNode[] = [];

  for (let i = 0; i < graphNodes.length; i++) {
    const gn = graphNodes[i];
    const cx = centers[gn.cluster].x;
    const cy = centers[gn.cluster].y;
    const spread = 16;
    const size = 0.5 + gn.weight * 1.0; // weight-driven size
    nodes.push({
      id: gn.id,
      x: cx + (rand() - 0.5) * spread * 2,
      y: cy + (rand() - 0.5) * spread * 1.6,
      cluster: gn.cluster,
      size,
      label: gn.label,
    });
  }

  return { nodes, edges: graphEdges.map(e => ({ from: e.from, to: e.to, strength: e.strength })) };
}

function generateEmptyGraph(count: number): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const rand = seededRandom(42);
  const nodes: LayoutNode[] = [];
  const placeholders = [
    ["...", "...", "...", "..."],
    ["...", "...", "..."],
    ["...", "...", "...", "..."],
  ];

  for (let i = 0; i < count; i++) {
    const cluster = i % 3;
    const cx = centers[cluster].x;
    const cy = centers[cluster].y;
    const labels = placeholders[cluster];
    nodes.push({
      id: `empty-${i}`,
      x: cx + (rand() - 0.5) * 32,
      y: cy + (rand() - 0.5) * 25,
      cluster,
      size: 0.5 + rand() * 0.3,
      label: labels[Math.floor(rand() * labels.length)],
    });
  }

  const edges: LayoutEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (nodes[i].cluster === nodes[j].cluster && dist < 16 && rand() > 0.5) {
        edges.push({ from: nodes[i].id, to: nodes[j].id, strength: 1 });
      }
    }
  }
  return { nodes, edges };
}

/* ── Pulse config ───────────────────────────────── */

const pulseConfig: Record<BaselineState, { duration: number; ease: string }> = {
  calm: { duration: 5, ease: "easeInOut" },
  elevated: { duration: 3, ease: "easeInOut" },
  fluctuating: { duration: 3.2, ease: "easeInOut" },
  high: { duration: 1.8, ease: "easeInOut" },
};

const clusterColors = {
  node: [
    "hsl(270 45% 72%)",  // lavender — emotional states
    "hsl(165 35% 70%)",  // mint — stabilizers
    "hsl(250 12% 68%)",  // neutral gray — context
  ],
  nodeEmpty: [
    "hsl(270 20% 84%)",
    "hsl(165 18% 84%)",
    "hsl(250 10% 84%)",
  ],
  glow: [
    "hsl(270 40% 78%)",
    "hsl(165 30% 76%)",
    "hsl(250 12% 76%)",
  ],
  edge: [
    "hsl(270 25% 82%)",
    "hsl(165 20% 82%)",
    "hsl(250 8% 84%)",
  ],
  edgeCross: "hsl(250 10% 86%)",
};

/* ── Mock insight data ───────────────────────────── */

const clusterInsightTemplates: Record<number, { chain: string; explanation: string }[]> = {
  0: [ // emotional states
    { chain: "Work Stress → Frustration → Late Night Journaling", explanation: "This emotional thread tends to surface during busy weeks." },
    { chain: "Overthinking → Tension → Evening Restlessness", explanation: "A pattern of mental loops that usually peaks after work." },
    { chain: "Loneliness → Heaviness → Quiet Reflection", explanation: "Moments of solitude that carry emotional weight." },
    { chain: "Worry → Unease → Sleep Disruption", explanation: "Anxiety-related signals that cluster around bedtime." },
  ],
  1: [ // stabilizers
    { chain: "Journaling → Calm → Emotional Clarity", explanation: "Writing seems to create space for settling." },
    { chain: "Gratitude Practice → Ease → Better Sleep", explanation: "A grounding rhythm that supports rest." },
    { chain: "Reflection → Relief → Lighter Mornings", explanation: "Processing feelings appears to ease the next day." },
  ],
  2: [ // context
    { chain: "Work Pressure → Relationship Tension → Self-Doubt", explanation: "Stress at work may be spilling into other areas." },
    { chain: "Family Dynamics → Emotional Weight → Avoidance", explanation: "Family-related themes that carry forward." },
    { chain: "Routine Disruption → Unease → Loss of Focus", explanation: "Changes in daily rhythm seem to trigger unsettledness." },
    { chain: "Future Uncertainty → Overthinking → Fatigue", explanation: "Worries about what's ahead tend to drain energy." },
  ],
};

function getMockInsight(node: LayoutNode): { chain: string; explanation: string; count: number } {
  const templates = clusterInsightTemplates[node.cluster] || clusterInsightTemplates[2];
  // Deterministic pick based on label hash
  let hash = 0;
  for (let i = 0; i < node.label.length; i++) hash = ((hash << 5) - hash + node.label.charCodeAt(i)) | 0;
  const template = templates[Math.abs(hash) % templates.length];
  const count = 2 + (Math.abs(hash) % 6); // 2-7
  return { ...template, count };
}

const clusterNames = ["Emotional state", "Stabilizing moment", "Context signal"];

/* ── Component ──────────────────────────────────── */

interface BrainVisualizationProps {
  baselineState: BaselineState;
  highlightCluster?: number;
  isEmpty?: boolean;
  graphNodes?: GraphNode[];
  graphEdges?: GraphEdge[];
}

export function BrainVisualization({
  baselineState,
  highlightCluster = 0,
  isEmpty = false,
  graphNodes,
  graphEdges,
}: BrainVisualizationProps) {
  const hasRealData = graphNodes && graphNodes.length > 0 && !isEmpty;

  const { nodes, edges } = useMemo(() => {
    if (hasRealData) return layoutRealNodes(graphNodes!, graphEdges || []);
    return generateEmptyGraph(isEmpty ? 15 : 24);
  }, [hasRealData, graphNodes, graphEdges, isEmpty]);

  const pulse = pulseConfig[baselineState];
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Convert SVG coordinates to pixel position relative to container
  const getPixelPos = useCallback((svgX: number, svgY: number) => {
    if (!containerRef.current) return { px: 0, py: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      px: (svgX / 100) * rect.width,
      py: (svgY / 100) * rect.height,
    };
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (isEmpty) return;
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
  }, [isEmpty]);

  // Dismiss panel on background click
  const handleBgClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const selectedLayoutNode = selectedNode ? nodeMap.get(selectedNode) : null;
  const insight = selectedLayoutNode ? getMockInsight(selectedLayoutNode) : null;

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-label="Emotional pattern visualization"
        onClick={handleBgClick}
      >
        {/* Subtle grid texture */}
        <defs>
          <pattern id="pattern-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="hsl(250 15% 82%)" strokeWidth="0.06" opacity="0.35" />
          </pattern>
          <filter id="glow-0" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
          <filter id="glow-1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" />
          </filter>
          <filter id="glow-2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" />
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#pattern-grid)" />

        {/* Edges */}
        {edges.map((e, i) => {
          const a = nodeMap.get(e.from);
          const b = nodeMap.get(e.to);
          if (!a || !b) return null;
          const sameCluster = a.cluster === b.cluster;
          const edgeColor = isEmpty
            ? "hsl(250 8% 86%)"
            : sameCluster
            ? clusterColors.edge[a.cluster]
            : clusterColors.edgeCross;
          const strokeW = sameCluster
            ? Math.min(0.14 + (e.strength || 0) * 0.03, 0.35)
            : 0.08;
          return (
            <line
              key={`e-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={edgeColor}
              strokeWidth={strokeW}
              opacity={isEmpty ? 0.18 : sameCluster ? 0.25 : 0.12}
            />
          );
        })}

        {/* Ambient glow halos */}
        {!isEmpty &&
          nodes.map((node) => {
            const isHighlight = node.cluster === highlightCluster;
            if (!isHighlight && node.size < 0.8) return null;
            return (
              <motion.circle
                key={`glow-${node.id}`}
                cx={node.x} cy={node.y} r={node.size * 3}
                fill={clusterColors.glow[node.cluster]}
                filter={`url(#glow-${node.cluster})`}
                animate={{ opacity: [0, isHighlight ? 0.14 : 0.08, 0] }}
                transition={{
                  duration: pulse.duration * 1.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: nodes.indexOf(node) * 0.12,
                }}
              />
            );
          })}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const isHighlight = node.cluster === highlightCluster && !isEmpty;
          const isSelected = selectedNode === node.id;
          const baseRadius = isEmpty
            ? node.size * 0.7
            : isHighlight
            ? node.size * 1.5
            : node.size * 1.05;

          const fillColor = isEmpty
            ? clusterColors.nodeEmpty[node.cluster]
            : clusterColors.node[node.cluster];

          return (
            <motion.circle
              key={node.id}
              cx={node.x} cy={node.y} r={baseRadius}
              fill={fillColor}
              stroke={isSelected ? clusterColors.node[node.cluster] : "none"}
              strokeWidth={isSelected ? 0.4 : 0}
              style={{ cursor: isEmpty ? "default" : "pointer" }}
              onMouseEnter={() => !isEmpty && setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
              animate={{
                r: isSelected
                  ? [baseRadius * 1.5, baseRadius * 1.6, baseRadius * 1.5]
                  : hoveredNode === node.id
                  ? [baseRadius * 1.4, baseRadius * 1.5, baseRadius * 1.4]
                  : [baseRadius, baseRadius * 1.18, baseRadius],
                opacity: isEmpty
                  ? [0.22, 0.38, 0.22]
                  : isSelected
                  ? [0.9, 1, 0.9]
                  : hoveredNode === node.id
                  ? [0.85, 1, 0.85]
                  : isHighlight
                  ? [0.6, 0.88, 0.6]
                  : [0.32, 0.52, 0.32],
              }}
              transition={{
                duration: isSelected ? 2 : hoveredNode === node.id ? 1.5 : pulse.duration,
                ease: pulse.ease as any,
                repeat: Infinity,
                delay: isSelected || hoveredNode === node.id ? 0 : idx * 0.1,
              }}
            />
          );
        })}

        {/* Hover tooltip (only when no panel is open) */}
        {hoveredNode !== null && !selectedNode && !isEmpty && (() => {
          const node = nodeMap.get(hoveredNode);
          if (!node) return null;
          const labelWidth = node.label.length * 1.1 + 2;
          const tooltipY = node.y - node.size * 2 - 3;
          const clampedX = Math.max(labelWidth / 2 + 1, Math.min(99 - labelWidth / 2, node.x));
          return (
            <g>
              <rect
                x={clampedX - labelWidth / 2} y={tooltipY - 2}
                width={labelWidth} height={4} rx={1}
                fill="hsl(250 15% 20%)" opacity={0.85}
              />
              <text
                x={clampedX} y={tooltipY + 0.6}
                textAnchor="middle" fontSize="2.2"
                fill="hsl(250 15% 92%)" fontFamily="inherit"
                style={{ pointerEvents: "none" }}
              >
                {node.label}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* ── Floating insight panel ─────────────────── */}
      <AnimatePresence>
        {selectedLayoutNode && insight && (
          <InsightPanel
            node={selectedLayoutNode}
            insight={insight}
            getPixelPos={getPixelPos}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Insight panel component ────────────────────── */

function InsightPanel({
  node,
  insight,
  getPixelPos,
  onClose,
}: {
  node: LayoutNode;
  insight: { chain: string; explanation: string; count: number };
  getPixelPos: (x: number, y: number) => { px: number; py: number };
  onClose: () => void;
}) {
  const { px, py } = getPixelPos(node.x, node.y);
  const panelWidth = 240;
  const clusterLabel = clusterNames[node.cluster] || "Signal";
  const dotColor = clusterColors.node[node.cluster];

  // Position: prefer right of node, flip left if too close to edge
  const flipLeft = px > 280;
  const left = flipLeft ? px - panelWidth - 16 : px + 16;
  const top = Math.max(8, py - 40);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute z-20 pointer-events-auto"
      style={{ left, top, width: panelWidth }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-xl bg-card border border-border/40 shadow-hover p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {clusterLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground/40 hover:text-muted-foreground text-xs leading-none transition-colors"
            aria-label="Close insight"
          >
            ✕
          </button>
        </div>

        {/* Node label */}
        <p className="text-[15px] font-serif font-semibold text-foreground mb-2 capitalize">
          {node.label}
        </p>

        {/* Pattern chain */}
        <p className="text-[12px] text-foreground/70 leading-relaxed mb-2">
          {insight.chain}
        </p>

        {/* Explanation */}
        <p className="text-[11px] text-muted-foreground/60 leading-snug mb-2">
          {insight.explanation}
        </p>

        {/* Occurrence count */}
        <p className="text-[10px] text-muted-foreground/45 italic">
          Observed {insight.count} times in the last 30 days
        </p>
      </div>
    </motion.div>
  );
}
