import { motion } from "framer-motion";
import { Sparkles, Activity, Users, Shield, Heart, Clock, MessageCircle, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FeatureCard } from "@/components/ui/FeatureCard";
export default function HowMendHelps() {
  return <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
              How MEND Helps You
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} className="text-lg text-muted-foreground leading-relaxed">
              MEND helps you slow down and make sense of what you’re feeling. It offers a safe space to reflect, notice patterns, and grow at your own pace.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Sparkles} title="Emotional Mirror" description="Express yourself freely. Our AI companion reflects back your emotions with clarity and understanding, helping you see what you're truly feeling." variant="lilac" delay={0} />
            <FeatureCard icon={Activity} title="Pattern Recognition" description="Over time, MEND identifies emotional patterns — recurring triggers, mood cycles, and behavioral tendencies that shape your wellbeing." variant="mint" delay={0.1} />
            <FeatureCard icon={TrendingUp} title="Insights Dashboard" description="Visual representations of your emotional journey. Track progress, celebrate wins, and understand your growth over weeks and months." variant="peach" delay={0.2} />
            <FeatureCard icon={Users} title="Expert Support" description="When you need human guidance, connect with verified mental health professionals for focused 20-minute reflection sessions." variant="lilac" delay={0.3} />
            <FeatureCard icon={MessageCircle} title="Community Circles" description="Join anonymous support circles with others who understand. Share experiences, find connection, and never feel alone." variant="mint" delay={0.4} />
            <FeatureCard icon={Clock} title="Always Available" description="MEND is here 24/7. Whether it's 3 AM anxiety or lunchtime overwhelm, support is just a message away." variant="peach" delay={0.5} />
          </div>
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="text-center mb-12">
              <div className="w-14 h-14 rounded-2xl bg-lilac-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-lilac-600" />
              </div>
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
                Your Privacy Matters
              </h2>
              <p className="text-muted-foreground">
                Everything you share with MEND stays private. We use end-to-end encryption and never share your data with third parties.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }} viewport={{
              once: true
            }} className="bg-card rounded-2xl p-6 shadow-card">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-serif font-medium text-foreground mb-2">Support, Not Therapy</h3>
                <p className="text-sm text-muted-foreground">
                  MEND provides emotional support and self-reflection tools. We're here to complement, not replace, professional mental health care.
                </p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} viewport={{
              once: true
            }} className="bg-card rounded-2xl p-6 shadow-card">
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
    </Layout>;
}