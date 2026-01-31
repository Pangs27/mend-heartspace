import { motion } from "framer-motion";
import { TrendingUp, Calendar, Lightbulb, Repeat, Heart, Sparkles, MessageCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { usePatternSignals, PatternCard as PatternCardType, TimelineEntry } from "@/hooks/usePatternSignals";
import { format } from "date-fns";

const variantStyles = {
  lilac: "bg-lilac-100",
  mint: "bg-mint-100",
  peach: "bg-peach-200",
};

const variantTextStyles = {
  lilac: "text-lilac-600",
  mint: "text-mint-500",
  peach: "text-peach-400",
};

// Map pattern types to icons and variants
const patternConfig: Record<string, { icon: typeof TrendingUp; variant: "lilac" | "mint" | "peach" }> = {
  emotion: { icon: Heart, variant: "lilac" },
  time: { icon: Clock, variant: "mint" },
  context: { icon: Lightbulb, variant: "peach" },
  weekly: { icon: Calendar, variant: "lilac" },
};

function PatternCard({ pattern, index }: { pattern: PatternCardType; index: number }) {
  const config = patternConfig[pattern.type] || { icon: Sparkles, variant: "lilac" as const };
  const Icon = config.icon;
  const variant = config.variant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <div className={`w-12 h-12 rounded-xl ${variantStyles[variant]} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${variantTextStyles[variant]}`} />
      </div>
      <h3 className="text-lg font-serif font-medium text-foreground mb-2">{pattern.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{pattern.body}</p>
    </motion.div>
  );
}

function TimelinePlaceholder({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${variantStyles.mint} flex items-center justify-center`}>
          <Calendar className={`w-5 h-5 ${variantTextStyles.mint}`} />
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground">Recent reflections</h3>
      </div>
      <div className="space-y-3">
        {timeline.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground w-20 shrink-0">
              {format(new Date(entry.date), "MMM d")}
            </span>
            <span className="text-foreground capitalize">{entry.emotion}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-card rounded-3xl p-8 lg:p-12 shadow-card text-center"
        >
          {/* Soft progress indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lilac-100/60 mb-6">
            <Sparkles className="w-4 h-4 text-lilac-600" />
            <span className="text-sm text-lilac-600 font-medium">Listening and learning</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lilac-100 to-mint-100 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-lilac-600" />
          </div>

          <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
            Your patterns are still forming
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
            MEND is still listening. Patterns start showing up after a few conversations.
          </p>

          <Link to="/companion">
            <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
              Talk to MEND
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-lilac-600" />
          <p className="text-sm text-muted-foreground">Loading your patterns...</p>
        </div>
      </div>
    </section>
  );
}

function DynamicPatterns({ patterns, timeline }: { patterns: PatternCardType[]; timeline: TimelineEntry[] }) {
  return (
    <>
      {/* Dynamic pattern cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-3">
              What's been showing up
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Based on your recent conversations with MEND.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {patterns.map((pattern, index) => (
              <PatternCard key={pattern.type} pattern={pattern} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline placeholder */}
      {timeline.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <TimelinePlaceholder timeline={timeline} />
            </div>
          </div>
        </section>
      )}

      {/* Continue CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/companion">
            <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
              <MessageCircle className="w-5 h-5 mr-2" />
              Continue with MEND
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function PatternsInsights() {
  const { data, isLoading, error } = usePatternSignals();

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6"
            >
              Understanding grows with time
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              MEND learns alongside you. The more you share, the clearer your emotional patterns become—gently, without pressure.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content based on state */}
      {isLoading ? (
        <LoadingState />
      ) : error || !data?.hasEnoughData ? (
        <EmptyState />
      ) : (
        <DynamicPatterns patterns={data.patterns} timeline={data.timeline} />
      )}
    </Layout>
  );
}
