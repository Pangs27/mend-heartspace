import { motion } from "framer-motion";
import { Sparkles, Activity, TrendingUp, Users, MessageCircle, Clock, Shield, Heart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export default function HowMendHelps() {
  return (
    <Layout>
      {/* 1️⃣ Hero — Emotional, Not Descriptive */}
      <section className="gradient-hero py-28 lg:py-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-medium text-foreground mb-6 leading-tight"
            >
              Slow down. Make sense. Move forward.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              MEND helps you reflect clearly, notice patterns over time, and grow at your own pace. Without judgment, pressure, or noise.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/signup">Start reflecting</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
                <Link to="/companion">Explore the companion</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Spotlight — Emotional Mirror (Full Width) */}
      <section className="py-24 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-card"
          >
            <div className="w-14 h-14 rounded-2xl bg-lilac-100 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-lilac-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
              A mirror that helps you hear yourself.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Express freely. MEND reflects back your emotional tone and intent with clarity, helping you see what you're actually feeling, not just what you're saying.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3️⃣ System Features — Patterns + Insights (2-col) */}
      <section className="py-24 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-serif font-medium text-foreground mb-4"
            >
              Over time, clarity compounds.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground leading-relaxed"
            >
              Every conversation generates structured emotional signals. Over time, these patterns help you understand triggers, growth, and change.
            </motion.p>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Activity}
              title="Pattern Recognition"
              description="Over time, MEND identifies emotional patterns such as recurring triggers, mood cycles, and behavioral tendencies that shape your wellbeing."
              variant="mint"
              delay={0}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Insights Dashboard"
              description="Visual representations of your emotional journey. Track progress, celebrate wins, and understand your growth over weeks and months."
              variant="peach"
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* 4️⃣ Human Layer — Support + Circles + Availability */}
      <section className="py-24 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-serif font-medium text-foreground"
            >
              Support that meets you where you are.
            </motion.h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Users}
              title="Expert Support"
              description="When you need human guidance, connect with verified mental health professionals for focused 20 minute reflection sessions."
              variant="lilac"
              delay={0}
            />
            <FeatureCard
              icon={MessageCircle}
              title="Community Circles"
              description="Join anonymous support circles with others who understand. Share experiences, find connection, and never feel alone."
              variant="mint"
              delay={0.1}
            />
            <FeatureCard
              icon={Clock}
              title="Always Available"
              description="MEND is here 24/7. Whether it's 3 AM anxiety or lunchtime overwhelm, support is just a message away."
              variant="peach"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* 5️⃣ Privacy — Emotional Trust Moment */}
      <section className="py-24 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Separator className="max-w-3xl mx-auto mb-16 opacity-40" />
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-lilac-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-lilac-600" />
              </div>
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
                Your thoughts stay yours.
              </h2>
              <p className="text-muted-foreground">
                Everything you share with MEND stays private. End-to-end encrypted. Never sold. Never shared.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-serif font-medium text-foreground mb-2">Support, Not Therapy</h3>
                <p className="text-sm text-muted-foreground">
                  MEND provides emotional support and self-reflection tools. We're here to complement, not replace, professional mental health care.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <Shield className="w-8 h-8 text-mint-500 mb-3" />
                <h3 className="font-serif font-medium text-foreground mb-2">Crisis Support</h3>
                <p className="text-sm text-muted-foreground">
                  In moments of crisis, MEND provides immediate grounding techniques and connects you with professional helplines in India.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ Final Conversion Block */}
      <section className="py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-8"
            >
              Ready to begin?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-10">
                <Link to="/signup">Start your first reflection</Link>
              </Button>
              <p className="text-sm text-muted-foreground">No pressure. Just noticing.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
