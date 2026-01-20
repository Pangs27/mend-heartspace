import { motion } from "framer-motion";
import { TrendingUp, Calendar, Lightbulb, BarChart3, Target, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const insightCards = [
  {
    icon: TrendingUp,
    title: "Mood Timeline",
    description: "Track your emotional journey day by day. See how your moods shift and flow over time.",
    variant: "lilac" as const,
  },
  {
    icon: Repeat,
    title: "Emotional Patterns",
    description: "Discover recurring emotional cycles. Understand when and why certain feelings arise.",
    variant: "mint" as const,
  },
  {
    icon: Lightbulb,
    title: "Trigger Insights",
    description: "Identify what triggers different emotions. Build awareness of your emotional responses.",
    variant: "peach" as const,
  },
  {
    icon: Calendar,
    title: "Weekly Reflections",
    description: "Review your week's emotional landscape. Celebrate progress and identify areas of growth.",
    variant: "lilac" as const,
  },
  {
    icon: BarChart3,
    title: "Emotion Breakdown",
    description: "See which emotions appear most frequently. Understand your emotional baseline.",
    variant: "mint" as const,
  },
  {
    icon: Target,
    title: "Growth Goals",
    description: "Set and track emotional wellness goals. Small steps lead to meaningful change.",
    variant: "peach" as const,
  },
];

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

export default function PatternsInsights() {
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
              Patterns & Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              Understanding your emotions is the first step to growth. MEND helps you discover patterns, identify triggers, and track your journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-8">
                View My Insights
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insightCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${variantStyles[card.variant]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-6 h-6 ${variantTextStyles[card.variant]}`} />
                </div>
                <h3 className="text-lg font-serif font-medium text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Placeholder */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-card rounded-3xl p-8 lg:p-12 shadow-card"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                Your insights will appear here
              </h2>
              <p className="text-muted-foreground">
                Start conversations with MEND to build your emotional profile
              </p>
            </div>

            {/* Placeholder Graph */}
            <div className="h-48 bg-gradient-to-br from-lilac-100/50 to-mint-100/50 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mood trends will show here</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
