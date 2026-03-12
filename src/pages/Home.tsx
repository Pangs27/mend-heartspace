import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useMemo } from "react";
import ScrollStorytelling from "@/components/home/ScrollStorytelling";

/* ── clustered neural constellation (background decoration) ── */
interface ConstellationNode {
  id: number;
  x: number;
  y: number;
  primary: boolean;
  blur: number;
  driftX: number;
  driftY: number;
  duration: number;
}

function NeuralCluster() {
  const { nodes, edges } = useMemo(() => {
    const rand = ((s: number) => () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    })(42);

    const nodeCount = 36;
    const n: ConstellationNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Gaussian-ish clustering: sum multiple randoms for center bias
      const isPrimary = i < 16;
      let x: number, y: number;

      if (isPrimary) {
        // Central cluster with organic spread
        const angle = rand() * Math.PI * 2;
        const radius = (rand() + rand()) * 0.5 * 18; // clustered near center
        x = 50 + Math.cos(angle) * radius * (0.8 + rand() * 0.4);
        y = 50 + Math.sin(angle) * radius * (0.7 + rand() * 0.5);
      } else {
        // Secondary nodes spread outward
        const angle = rand() * Math.PI * 2;
        const radius = 14 + rand() * 30;
        x = 50 + Math.cos(angle) * radius;
        y = 50 + Math.sin(angle) * radius;
      }

      // Clamp to viewbox
      x = Math.max(4, Math.min(96, x));
      y = Math.max(4, Math.min(96, y));

      n.push({
        id: i,
        x,
        y,
        primary: isPrimary,
        blur: isPrimary ? 0 : rand() > 0.5 ? 1 + rand() : 0,
        driftX: (rand() - 0.5) * (isPrimary ? 8 : 12),
        driftY: (rand() - 0.5) * (isPrimary ? 6 : 10),
        duration: 20 + rand() * 10,
      });
    }

    // Sparse connections, mostly between central nodes
    const e: { from: number; to: number }[] = [];
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const d = Math.hypot(n[i].x - n[j].x, n[i].y - n[j].y);
        const bothPrimary = n[i].primary && n[j].primary;
        const threshold = bothPrimary ? 18 : 12;
        const chance = bothPrimary ? 0.35 : 0.75;
        if (d < threshold && rand() > chance) {
          e.push({ from: i, to: j });
        }
      }
    }

    return { nodes: n, edges: e };
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
      <defs>
        <filter id="node-blur-1">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
        <filter id="node-blur-2">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Connection lines */}
      {edges.map((e, i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[e.from].x}
          y1={nodes[e.from].y}
          x2={nodes[e.to].x}
          y2={nodes[e.to].y}
          stroke="hsl(270 45% 80%)"
          strokeWidth={0.18}
          strokeOpacity={0.18}
          animate={{
            strokeOpacity: [0.14, 0.22, 0.14],
          }}
          transition={{
            duration: 25,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Nodes with slow drift */}
      {nodes.map((n) => {
        const r = n.primary ? 1.4 : 0.85;
        const baseOpacity = n.primary ? 0.45 : 0.3;
        const blurFilter =
          n.blur > 1 ? "url(#node-blur-2)" : n.blur > 0 ? "url(#node-blur-1)" : undefined;

        return (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={r}
            fill="hsl(270 45% 78%)"
            filter={blurFilter}
            animate={{
              cx: [n.x, n.x + n.driftX * 0.5, n.x - n.driftX * 0.3, n.x],
              cy: [n.y, n.y - n.driftY * 0.4, n.y + n.driftY * 0.5, n.y],
              opacity: [baseOpacity, baseOpacity * 1.15, baseOpacity * 0.85, baseOpacity],
            }}
            transition={{
              duration: n.duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: n.id * 0.6,
            }}
          />
        );
      })}
    </svg>
  );
}

/* ── fade-in wrapper ── */
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <Layout>
      {/* ─── SECTION 1 — Hero ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden gradient-hero">
        {/* Background neural cluster */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
            <NeuralCluster />
          </div>
        </div>
        {/* Soft gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-lilac-200/20 blur-3xl animate-float" />
          <div className="absolute bottom-16 right-12 w-80 h-80 rounded-full bg-mint-200/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif font-medium text-foreground leading-snug text-balance">
                Some thoughts don't need fixing.
                <br className="hidden sm:block" />
                They need understanding.
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-balance max-w-xl mx-auto">
                A private space to reflect, notice patterns, and make sense of what you're carrying.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/companion">
                  <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all duration-300 px-8">
                    Begin Reflecting
                  </Button>
                </Link>
                <Link to="/how-mend-helps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  See how it works
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2 — Scroll Storytelling ─── */}
      <ScrollStorytelling />

      {/* ─── SECTION 3 — Emotional Close ─── */}
      <section className="py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-lilac-100 via-mint-50 to-peach-100 rounded-3xl p-12 md:p-16 shadow-card">
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
                You don't have to figure yourself out alone.
              </h2>
              <p className="text-muted-foreground mb-8">
                Start noticing. Start understanding. Start gently.
              </p>
              <Link to="/companion">
                <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all duration-300 px-8">
                  Begin Reflecting
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
