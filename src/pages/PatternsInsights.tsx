import { motion } from "framer-motion";
import { TrendingUp, Calendar, Lightbulb, Repeat, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const insightCards = [
  {
    icon: TrendingUp,
    title: "Your Emotional Journey",
    description: "Over time, you'll see how your feelings shift and evolve—a gentle map of where you've been.",
    variant: "lilac" as const,
  },
  {
    icon: Repeat,
    title: "Patterns Worth Knowing",
    description: "As you share more, MEND will help you notice rhythms in your emotions you may not have seen before.",
    variant: "mint" as const,
  },
  {
    icon: Lightbulb,
    title: "Moments of Clarity",
    description: "Sometimes a small insight can shift everything. These will surface naturally through reflection.",
    variant: "peach" as const,
  },
  {
    icon: Calendar,
    title: "Reflections Over Time",
    description: "Looking back can be powerful. You'll be able to see how far you've come, one conversation at a time.",
    variant: "lilac" as const,
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
              Understanding grows with time
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              MEND learns alongside you. The more you share, the clearer your emotional patterns become—gently, without pressure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <Link to="/companion">
                <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-8">
                  Start building my insights
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Insights grow through conversation—there's no rush.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's possible section */}
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
              What becomes possible
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These insights will unfold naturally as you continue your journey with MEND.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {insightCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className={`w-12 h-12 rounded-xl ${variantStyles[card.variant]} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${variantTextStyles[card.variant]}`} />
                </div>
                <h3 className="text-lg font-serif font-medium text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State - Intentional beginning */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
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
              This is where your story takes shape
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
              MEND builds understanding through conversation. There's nothing to track or complete—just space to reflect, whenever you're ready.
            </p>

            <Link to="/companion">
              <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
                Begin a conversation
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground mt-4">
              Your first insights will appear after a few conversations.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
