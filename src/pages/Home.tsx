import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Layout } from "@/components/layout/Layout";
export default function Home() {
  return <Layout>
      {/* Hero Section */}
      <section className="gradient-hero min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-lilac-200/30 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-mint-200/30 blur-3xl animate-float" style={{
          animationDelay: "1s"
        }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-peach-200/20 blur-3xl animate-pulse-soft" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6 leading-tight text-balance">
                MEND — Your Everyday Emotional Support System
              </h1>
            </motion.div>
            
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.15
          }} className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-balance">
              Private, non judgmental, and always here when you need to talk.
            </motion.p>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/companion">
                <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all duration-300 px-8">
                  Start Talking
                </Button>
              </Link>
              <Link to="/how-mend-helps">
                <Button size="lg" variant="outline" className="px-8">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Preview */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
              How MEND Supports You
            </motion.h2>
            <motion.p initial={{
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
          }} className="text-muted-foreground max-w-xl mx-auto">
              A gentle companion for your emotional wellness journey
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard icon={Sparkles} title="Emotional Mirror" description="Reflect on your feelings through gentle, guided conversations. MEND listens without judgment and helps you understand what you're experiencing." variant="lilac" delay={0} />
            <FeatureCard icon={Activity} title="Pattern Intelligence" description="Discover emotional patterns over time. Understand your triggers, track your moods, and gain insights that empower positive change." variant="mint" delay={0.1} />
            <FeatureCard icon={Users} title="Human Support" description="Connect with verified mental health experts for focused reflection sessions when you need professional guidance and support." variant="peach" delay={0.2} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="text-3xl font-serif font-medium text-foreground text-center mb-12">
            What People Say
          </motion.h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          scale: 0.98
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="max-w-2xl mx-auto text-center bg-gradient-to-br from-lilac-100 via-mint-50 to-peach-100 rounded-3xl p-10 shadow-card">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-muted-foreground mb-6">
              Take the first step towards understanding your emotions better. It's free, private, and always here for you.
            </p>
            <Link to="/companion">
              <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all duration-300 px-8">
                Begin Your Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>;
}