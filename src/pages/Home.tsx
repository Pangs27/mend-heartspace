import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

/* ── fade-in wrapper ── */
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
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
        {/* Radial atmospheric field */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(270 40% 78% / 0.15) 0%, hsl(270 35% 82% / 0.06) 40%, transparent 70%)",
            }}
            animate={{ opacity: [1, 0.96, 1] }}
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          />
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

      {/* ─── SECTION 2 — The Experience ─── */}
      <section className="py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground text-center mb-16 lg:mb-20">
              Here's what happens over time.
            </h2>
          </Reveal>

          {/* Step 1 — Chat snippet */}
          <Reveal delay={0.05} className="mb-16 lg:mb-20">
            <div className="space-y-4 max-w-md mx-auto">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-lilac-100 text-foreground rounded-2xl rounded-br-md px-5 py-3.5 text-[15px] leading-relaxed max-w-[85%] shadow-soft">
                  I've been feeling overwhelmed at work lately.
                </div>
              </div>
              {/* MEND reply */}
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-5 py-3.5 text-[15px] leading-relaxed max-w-[85%] shadow-soft">
                  That sounds heavy. What part of work feels the most draining right now?
                </div>
              </div>
            </div>
          </Reveal>

          {/* Step 2 — Pattern formation */}
          <Reveal delay={0.05} className="mb-16 lg:mb-20">
            <div className="max-w-xs mx-auto aspect-square flex items-center justify-center">
              <motion.div
                className="w-48 h-48 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(270 40% 78% / 0.18) 0%, hsl(270 35% 82% / 0.07) 50%, transparent 75%)",
                }}
                animate={{ opacity: [0.6, 0.56, 0.6] }}
                transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 max-w-sm mx-auto">
              Recently, work pressure has shown up often in your reflections.
            </p>
          </Reveal>

          {/* Step 3 — Insight card */}
          <Reveal delay={0.05}>
            <div className="max-w-md mx-auto bg-card rounded-2xl p-7 shadow-card">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Insight</p>
              <h3 className="font-serif text-lg text-foreground mb-2">Over the past two weeks…</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
                You've mentioned feeling stretched thin in the evenings.
              </p>
              <p className="text-sm text-primary italic">
                What changes when the workday ends?
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SECTION 3 — Go Deeper ─── */}
      <section className="py-28 lg:py-36 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-6">
              And when you want to go deeper.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              You can speak with someone trained to listen.
              <br />
              Or join others navigating similar experiences.
              <br />
              <span className="mt-2 inline-block">Only if and when you're ready.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── SECTION 4 — Emotional Close ─── */}
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
