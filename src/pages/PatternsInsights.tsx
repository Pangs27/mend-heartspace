import { motion } from "framer-motion";
import { Heart, Sparkles, MessageCircle, Clock, Loader2, Lightbulb, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { usePatternSignals, PatternCard as PatternCardType, TimelineEntry } from "@/hooks/usePatternSignals";
import { format } from "date-fns";

// Map pattern types to icons
const patternIcons: Record<string, typeof Heart> = {
  emotion: Heart,
  time: Clock,
  context: Lightbulb,
  weekly: Calendar,
};

function getStatusPill(signalCount: number): { label: string; className: string } {
  if (signalCount >= 16) {
    return { label: "Steady", className: "bg-mint-100 text-mint-500" };
  } else if (signalCount >= 8) {
    return { label: "Emerging", className: "bg-lilac-100 text-lilac-600" };
  } else if (signalCount >= 3) {
    return { label: "Forming", className: "bg-peach-100 text-peach-400" };
  }
  return { label: "Listening", className: "bg-muted text-muted-foreground" };
}

function StatusPill({ signalCount }: { signalCount: number }) {
  const { label, className } = getStatusPill(signalCount);
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function InsightCard({ pattern, index }: { pattern: PatternCardType; index: number }) {
  const Icon = patternIcons[pattern.type] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-serif font-medium text-foreground mb-1">{pattern.title}</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{pattern.body}</p>
          <p className="text-xs text-muted-foreground mt-2">Based on recent reflections</p>
        </div>
      </div>
    </motion.div>
  );
}

function RecentMoments({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-8"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent moments</h3>
      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="space-y-2.5">
          {timeline.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-8 shrink-0 font-medium">
                {format(new Date(entry.date), "EEE")}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-foreground capitalize">{entry.emotion}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">{entry.timeBucket}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CheckInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-muted/40 rounded-xl p-4 flex items-center justify-between gap-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">Want to add a check-in?</p>
        <p className="text-xs text-muted-foreground mt-0.5">Even 2 minutes helps patterns form.</p>
      </div>
      <Link to="/companion">
        <Button size="sm" variant="outline" className="shrink-0 text-xs h-8 px-3 rounded-lg">
          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
          Talk to MEND
        </Button>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl p-8 shadow-card text-center max-w-md mx-auto"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lilac-100 to-mint-100 flex items-center justify-center mx-auto mb-5">
        <Heart className="w-7 h-7 text-lilac-600" />
      </div>

      <h2 className="text-xl font-serif font-medium text-foreground mb-2">
        Your patterns are still forming
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        MEND is still listening. Patterns show up after a few honest conversations.
      </p>

      <Link to="/companion">
        <Button className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
          Start a conversation
        </Button>
      </Link>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-lilac-600" />
      <p className="text-sm text-muted-foreground">Loading your patterns...</p>
    </div>
  );
}

function DynamicInsights({ patterns, timeline }: { patterns: PatternCardType[]; timeline: TimelineEntry[] }) {
  // Show max 4 insights
  const visiblePatterns = patterns.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePatterns.map((pattern, index) => (
          <InsightCard key={pattern.type} pattern={pattern} index={index} />
        ))}
      </div>

      {timeline.length >= 5 && <RecentMoments timeline={timeline} />}
    </>
  );
}

export default function PatternsInsights() {
  const { data, isLoading } = usePatternSignals();
  
  const signalCount = data?.signals?.length ?? 0;
  const hasEnoughData = signalCount >= 3;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header section */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground">
                Patterns & Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Small patterns, over time. Nothing rushed.
              </p>
            </div>
            <StatusPill signalCount={signalCount} />
          </motion.header>

          {/* Check-in CTA card */}
          <div className="mb-8">
            <CheckInCard />
          </div>

          {/* Main content */}
          {isLoading ? (
            <LoadingState />
          ) : !hasEnoughData ? (
            <EmptyState />
          ) : (
            <DynamicInsights 
              patterns={data?.patterns || []} 
              timeline={data?.timeline || []} 
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
