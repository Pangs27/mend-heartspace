import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BaselineState } from "@/lib/patternSnapshot";

interface Node {
  id: number;
  x: number;
  y: number;
  cluster: number; // 0, 1, or 2 — maps to dominant themes
}

interface Edge {
  from: number;
  to: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateGraph(nodeCount: number): { nodes: Node[]; edges: Edge[] } {
  const rand = seededRandom(42);
  const nodes: Node[] = [];

  // 3 cluster centers
  const centers = [
    { x: 35, y: 40 },
    { x: 65, y: 35 },
    { x: 50, y: 65 },
  ];

  for (let i = 0; i < nodeCount; i++) {
    const cluster = i % 3;
    const cx = centers[cluster].x;
    const cy = centers[cluster].y;
    nodes.push({
      id: i,
      x: cx + (rand() - 0.5) * 30,
      y: cy + (rand() - 0.5) * 28,
      cluster,
    });
  }

  // Connect nearby nodes
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 18 && rand() > 0.35) {
        edges.push({ from: i, to: j });
      }
    }
  }

  return { nodes, edges };
}

// Pulse timing per baseline state
const pulseConfig: Record<BaselineState, { duration: number; ease: string }> = {
  calm: { duration: 5, ease: "easeInOut" },
  elevated: { duration: 3, ease: "easeInOut" },
  fluctuating: { duration: 3.2, ease: "easeInOut" },
  high: { duration: 1.8, ease: "easeInOut" },
};

interface BrainVisualizationProps {
  baselineState: BaselineState;
  highlightCluster: number; // 0, 1, or 2 — top dominant theme
  isEmpty?: boolean;
}

export function BrainVisualization({
  baselineState,
  highlightCluster,
  isEmpty = false,
}: BrainVisualizationProps) {
  const nodeCount = isEmpty ? 9 : 32;
  const { nodes, edges } = useMemo(() => generateGraph(nodeCount), [nodeCount]);
  const pulse = pulseConfig[baselineState];

  // Stagger phase offsets for fluctuating state
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (baselineState !== "fluctuating") return;
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, [baselineState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-sm mx-auto aspect-square"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-label="Brain activity visualization"
      >
        {/* Edges */}
        {edges.map((e, i) => {
          const a = nodes[e.from];
          const b = nodes[e.to];
          const isHighlight =
            a.cluster === highlightCluster || b.cluster === highlightCluster;
          return (
            <motion.line
              key={`e-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={
                isEmpty
                  ? "hsl(250 15% 80%)"
                  : isHighlight
                  ? "hsl(270 45% 75%)"
                  : "hsl(250 15% 85%)"
              }
              strokeWidth={isEmpty ? 0.15 : 0.25}
              strokeOpacity={isEmpty ? 0.3 : isHighlight ? 0.5 : 0.25}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHighlight = node.cluster === highlightCluster && !isEmpty;
          const baseRadius = isEmpty ? 0.8 : isHighlight ? 1.6 : 1.1;

          // Fluctuating: staggered random delays
          const delay =
            baselineState === "fluctuating"
              ? (node.id * 0.37 + tick * 0.1) % pulse.duration
              : node.id * 0.12;

          return (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={baseRadius}
              fill={
                isEmpty
                  ? "hsl(250 15% 78%)"
                  : isHighlight
                  ? "hsl(270 50% 72%)"
                  : "hsl(165 35% 78%)"
              }
              animate={{
                r: [baseRadius, baseRadius * 1.3, baseRadius],
                opacity: isEmpty ? [0.25, 0.35, 0.25] : isHighlight
                  ? [0.7, 1, 0.7]
                  : [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: pulse.duration,
                ease: pulse.ease as any,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}

        {/* Glow filter for highlight cluster — 10-15% brighter */}
        {!isEmpty && (
          <>
            {nodes
              .filter((n) => n.cluster === highlightCluster)
              .map((node) => (
                <motion.circle
                  key={`glow-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={2.8}
                  fill="hsl(270 45% 80%)"
                  animate={{ opacity: [0, 0.18, 0] }}
                  transition={{
                    duration: pulse.duration * 1.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: node.id * 0.15,
                  }}
                />
              ))}
          </>
        )}
      </svg>

      {/* Caption */}
      <p className="text-center text-[11px] text-muted-foreground/50 mt-2 tracking-wide">
        {isEmpty
          ? "Your patterns will become clearer as you share more."
          : "Reflecting your recent emotional rhythm."}
      </p>
    </motion.div>
  );
}
