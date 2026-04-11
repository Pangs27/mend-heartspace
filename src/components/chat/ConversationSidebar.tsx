import { Plus, MoreVertical, Trash2, Edit2, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string | null;
  updated_at: string | null;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  isLoading?: boolean;
}

/* ─────────────────────────────────────────────────────────
   Deterministic pseudo-random for stable node layout
   ───────────────────────────────────────────────────────── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─────────────────────────────────────────────────────────
   Compute a stable 2D constellation layout for conversations
   Each conversation becomes a node with {x, y, radius}.
   Active node gets the biggest radius.
   Nodes are connected by edges to their nearest neighbours.
   ───────────────────────────────────────────────────────── */
interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  r: number;
  title: string;
}

interface ConstellationEdge {
  from: number;
  to: number;
}

function buildConstellation(
  conversations: Conversation[],
  activeId: string | null,
  width: number,
  height: number
) {
  const count = conversations.length;
  if (count === 0) return { nodes: [] as ConstellationNode[], edges: [] as ConstellationEdge[] };

  const rand = seededRandom(42);
  const padding = 28;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  // Place nodes in a relaxed organic layout
  const nodes: ConstellationNode[] = conversations.map((conv, i) => {
    const isActive = conv.id === activeId;

    // Use a spiral-ish distribution for organic feel
    const angle = (i / Math.max(count, 1)) * Math.PI * 2.2 + rand() * 0.6;
    const dist = 0.25 + (i / Math.max(count, 1)) * 0.55 + rand() * 0.15;

    let x = padding + usableW / 2 + Math.cos(angle) * dist * (usableW / 2);
    let y = padding + usableH / 2 + Math.sin(angle) * dist * (usableH / 2);

    // Clamp within bounds
    const maxR = isActive ? 18 : 8 + rand() * 5;
    x = Math.max(padding + maxR, Math.min(width - padding - maxR, x));
    y = Math.max(padding + maxR, Math.min(height - padding - maxR, y));

    return {
      id: conv.id,
      x,
      y,
      r: isActive ? 18 : 6 + rand() * 5,
      title: conv.title || "New Chat",
    };
  });

  // Build edges: connect each node to its 1–2 nearest neighbours
  const edges: ConstellationEdge[] = [];
  for (let i = 0; i < count; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      dists.push({ j, d: Math.sqrt(dx * dx + dy * dy) });
    }
    dists.sort((a, b) => a.d - b.d);
    const connectCount = Math.min(count <= 3 ? 1 : 2, dists.length);
    for (let k = 0; k < connectCount; k++) {
      const from = Math.min(i, dists[k].j);
      const to = Math.max(i, dists[k].j);
      if (!edges.some((e) => e.from === from && e.to === to)) {
        edges.push({ from, to });
      }
    }
  }

  return { nodes, edges };
}

/* ─────────────────────────────────────────────────────────
   Interactive SVG constellation graph (the hero visual)
   ───────────────────────────────────────────────────────── */
function ConstellationGraph({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const W = 272;
  const H = Math.min(200, 90 + conversations.length * 18);

  const { nodes, edges } = useMemo(
    () => buildConstellation(conversations, activeId, W, H),
    [conversations, activeId, W, H]
  );

  if (conversations.length === 0) return null;

  return (
    <div className="relative mx-3 mt-2 mb-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(270, 50%, 75%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(280, 45%, 72%)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="activeGlow">
            <stop offset="0%" stopColor="hsl(270, 55%, 75%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(270, 55%, 75%)" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* ── Connecting lines ── */}
        {edges.map((e, i) => {
          const a = nodes[e.from];
          const b = nodes[e.to];
          const isActiveEdge =
            a.id === activeId || b.id === activeId;
          const isHoveredEdge =
            a.id === hoveredId || b.id === hoveredId;
          return (
            <motion.line
              key={`edge-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isActiveEdge ? "hsl(270, 55%, 72%)" : "hsl(270, 40%, 80%)"}
              strokeWidth={isActiveEdge ? 2 : 1.2}
              strokeOpacity={isHoveredEdge ? 0.6 : isActiveEdge ? 0.45 : 0.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
            />
          );
        })}

        {/* ── Node bubbles ── */}
        {nodes.map((node, i) => {
          const isActive = node.id === activeId;
          const isHovered = node.id === hoveredId;

          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onClick={() => onSelect(node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Active outer glow */}
              {isActive && (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 14}
                    fill="url(#activeGlow)"
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 6}
                    fill="none"
                    stroke="hsl(270, 55%, 75%)"
                    strokeWidth="1"
                    strokeOpacity="0.25"
                    animate={{
                      r: [node.r + 6, node.r + 10, node.r + 6],
                      strokeOpacity: [0.25, 0.08, 0.25],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </>
              )}

              {/* The bubble itself */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={
                  isActive
                    ? "hsl(270, 55%, 72%)"
                    : isHovered
                      ? "hsl(270, 45%, 78%)"
                      : "hsl(270, 40%, 82%)"
                }
                fillOpacity={isActive ? 0.95 : isHovered ? 0.65 : 0.35}
                stroke={isActive ? "hsl(270, 50%, 65%)" : "hsl(270, 35%, 80%)"}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.6 : isHovered ? 0.5 : 0.25}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  ...(isActive
                    ? { r: [node.r, node.r + 1.5, node.r] }
                    : {}),
                }}
                transition={
                  isActive
                    ? {
                        r: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 0.4, delay: i * 0.04 },
                        opacity: { duration: 0.4, delay: i * 0.04 },
                      }
                    : { duration: 0.4, delay: i * 0.04 }
                }
                whileHover={{ scale: 1.15, fillOpacity: 0.7 }}
              />

              {/* Sparkle icon inside active node */}
              {isActive && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <foreignObject
                    x={node.x - 7}
                    y={node.y - 7}
                    width="14"
                    height="14"
                  >
                    <Sparkles
                      style={{ width: 14, height: 14, color: "white", opacity: 0.9 }}
                    />
                  </foreignObject>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Hover / Active tooltip label ── */}
      <AnimatePresence>
        {(hoveredId || activeId) && (() => {
          const targetId = hoveredId || activeId;
          const node = nodes.find((n) => n.id === targetId);
          if (!node) return null;
          const isActive = node.id === activeId;

          return (
            <motion.div
              key={targetId}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20"
              style={{
                left: Math.min(Math.max(node.x - 60, 8), W - 128),
                top: node.y + node.r + 8,
              }}
            >
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-medium max-w-[140px] truncate backdrop-blur-md ${
                  isActive
                    ? "bg-[hsl(260,30%,18%)] text-white shadow-lg shadow-primary/10"
                    : "bg-white/80 dark:bg-card/80 text-foreground shadow-md border border-border/30"
                }`}
              >
                {node.title}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Sidebar Component
   ───────────────────────────────────────────────────────── */
export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
  isLoading,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = useCallback((conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title || "New Chat");
  }, []);

  const handleConfirmRename = useCallback(
    (id: string) => {
      if (editTitle.trim()) {
        onRename(id, editTitle.trim());
      }
      setEditingId(null);
    },
    [editTitle, onRename]
  );

  const handleCancelRename = useCallback(() => {
    setEditingId(null);
  }, []);

  return (
    <div className="w-80 flex-shrink-0 border-r border-border/40 bg-lilac-50/30 backdrop-blur-xl flex flex-col h-full z-10 relative overflow-hidden">

      {/* ── Atmospheric background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full bg-[hsl(265,80%,75%)] opacity-[0.10] blur-3xl" />
        <div className="absolute top-1/3 -right-8 w-36 h-36 rounded-full bg-[hsl(280,70%,70%)] opacity-[0.08] blur-2xl" />
        <div className="absolute bottom-32 -left-6 w-24 h-24 rounded-full bg-[hsl(250,75%,72%)] opacity-[0.10] blur-2xl" />
        <div className="absolute bottom-12 right-8 w-20 h-20 rounded-full bg-[hsl(270,65%,78%)] opacity-[0.08] blur-xl" />
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(265,60%,50%) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      {/* ── Header: New Chat button ── */}
      <div className="relative p-4 pt-6">
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-lilac-200/60 to-transparent" />
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2.5 gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all duration-300 h-11 px-4 rounded-xl font-medium group"
          variant="default"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span>New Chat</span>
        </Button>
      </div>

      {/* ── Constellation graph ── */}
      {!isLoading && conversations.length > 1 && (
        <>
          <div className="relative px-5 pt-3 pb-0">
            <p className="text-[10px] font-bold text-muted-foreground/45 uppercase tracking-widest">
              Your Thought Map
            </p>
          </div>
          <ConstellationGraph
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelect}
          />
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-lilac-200/40 to-transparent" />
        </>
      )}

      {/* ── Section header ── */}
      <div className="relative px-5 pt-3 pb-1">
        <p className="text-[10px] font-bold text-muted-foreground/45 uppercase tracking-widest">
          Recent Conversations
        </p>
      </div>

      {/* ── Conversation list ── */}
      <div className="relative flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
        {isLoading && conversations.length === 0 ? (
          <div className="flex flex-col gap-3 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 rounded-full bg-muted/30 animate-pulse w-3/4" />
                  <div className="h-2.5 rounded-full bg-muted/20 animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {conversations.map((conv, index) => {
              const isActive = activeId === conv.id;

              return (
                <motion.div
                  key={conv.id}
                  layout
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -12, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.025,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`group relative rounded-2xl transition-all duration-300 mb-1 ${
                    isActive
                      ? "bg-white/70 dark:bg-white/10 shadow-[0_2px_16px_-4px_rgba(139,92,246,0.12)]"
                      : "bg-transparent hover:bg-white/35 dark:hover:bg-white/5"
                  }`}
                >
                  {editingId === conv.id ? (
                    /* Rename mode */
                    <div className="flex items-center gap-2 p-2.5 pl-3">
                      <ListBubble isActive={isActive} />
                      <input
                        ref={inputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleConfirmRename(conv.id);
                          if (e.key === "Escape") handleCancelRename();
                        }}
                        onBlur={() => handleConfirmRename(conv.id)}
                        className="flex-1 bg-white dark:bg-white/10 px-3 py-1.5 rounded-xl text-sm outline-none ring-2 ring-primary/20 shadow-inner min-w-0"
                      />
                      <button
                        onClick={() => handleConfirmRename(conv.id)}
                        className="p-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Normal conversation item */
                    <div
                      className="flex items-center gap-3 p-2.5 pl-3 cursor-pointer"
                      onClick={() => onSelect(conv.id)}
                    >
                      <ListBubble isActive={isActive} />

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate leading-tight ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {conv.title || "New Chat"}
                        </p>
                        {conv.updated_at && (
                          <p className="text-[10px] text-muted-foreground/45 mt-0.5 font-medium">
                            {format(new Date(conv.updated_at), "MMM d • h:mm a")}
                          </p>
                        )}
                      </div>

                      {/* Three-dot menu */}
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`p-1.5 rounded-xl transition-all duration-300 ${
                                isActive
                                  ? "opacity-100 bg-black/5 dark:bg-white/10"
                                  : "opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-2xl p-1.5 border-border/40 backdrop-blur-xl bg-white/90 dark:bg-card/90 shadow-xl"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRename(conv);
                              }}
                              className="gap-2.5 py-2.5 rounded-xl focus:bg-lilac-50 dark:focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 opacity-70" />
                              <span className="font-medium text-sm">Rename chat</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(conv.id);
                              }}
                              className="gap-2.5 py-2.5 rounded-xl text-destructive focus:bg-destructive/5 focus:text-destructive transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 opacity-70" />
                              <span className="font-medium text-sm">Delete chat</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}

                  {/* Active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* ── Empty state ── */}
        {!isLoading && conversations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center px-4"
          >
            <EmptyConstellation />
            <p className="text-sm font-medium text-muted-foreground/60 mt-5">
              Start a conversation
            </p>
            <p className="text-xs text-muted-foreground/40 mt-1">
              Your thought map will grow here
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   List bubble indicator (small inline node per list item)
   ───────────────────────────────────────────────────────── */
function ListBubble({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(270,55%,72%,0.25) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className="flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: isActive ? 32 : 26,
          height: isActive ? 32 : 26,
          background: isActive
            ? "linear-gradient(135deg, hsl(270,55%,72%), hsl(280,50%,68%))"
            : "hsl(270,40%,82%,0.3)",
          border: isActive
            ? "2px solid hsl(270,50%,65%,0.5)"
            : "1.5px solid hsl(270,35%,80%,0.25)",
          boxShadow: isActive
            ? "0 0 12px -2px hsl(270,50%,68%,0.35)"
            : "none",
        }}
      >
        {isActive ? (
          <Sparkles style={{ width: 13, height: 13, color: "white", opacity: 0.9 }} />
        ) : (
          <div
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "hsl(270,45%,75%)",
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Empty-state mini constellation decoration
   ───────────────────────────────────────────────────────── */
function EmptyConstellation() {
  const nodes = useMemo(() => {
    const rand = seededRandom(99);
    return Array.from({ length: 7 }, (_, i) => ({
      x: 30 + rand() * 60,
      y: 20 + rand() * 60,
      r: 2 + rand() * 3,
      delay: rand() * 4,
    }));
  }, []);

  const edges = useMemo(() => {
    const e: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          e.push({ from: i, to: j });
        }
      }
    }
    return e;
  }, [nodes]);

  return (
    <svg viewBox="0 0 120 100" className="w-28 h-24" aria-hidden>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={nodes[e.from].x}
          y1={nodes[e.from].y}
          x2={nodes[e.to].x}
          y2={nodes[e.to].y}
          stroke="hsl(270,45%,78%)"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="hsl(270,50%,76%)"
          animate={{
            r: [n.r, n.r + 0.6, n.r],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
