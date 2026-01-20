import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CommunityTile } from "@/components/ui/CommunityTile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const circles = [
  { name: "Breakups & Moving On", memberCount: 2340, color: "lilac" as const },
  { name: "Overthinking Club", memberCount: 5620, color: "mint" as const },
  { name: "Founder Burnout", memberCount: 890, color: "peach" as const },
  { name: "Exam Pressure", memberCount: 4200, color: "lilac" as const },
  { name: "Loneliness & Connection", memberCount: 3100, color: "mint" as const },
  { name: "Work Stress", memberCount: 2850, color: "peach" as const },
  { name: "Family Dynamics", memberCount: 1950, color: "lilac" as const },
  { name: "Self-Discovery", memberCount: 2100, color: "mint" as const },
];

export default function Community() {
  const [showGuidelines, setShowGuidelines] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6"
            >
              Community Circles
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed mb-6"
            >
              Find your people. Join anonymous support circles where you can share, listen, and heal together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={() => setShowGuidelines(true)}
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Community Guidelines
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Circle Tiles */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {circles.map((circle, index) => (
              <CommunityTile
                key={circle.name}
                {...circle}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Anonymous Posting */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-card rounded-3xl p-8 shadow-card text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-lilac-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-lilac-600" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
              Share Anonymously
            </h2>
            <p className="text-muted-foreground mb-6">
              Your identity is always protected. Share your thoughts, ask questions, and support others — all without revealing who you are.
            </p>
            <Button className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
              Create Anonymous Post
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Community Guidelines Modal */}
      <Dialog open={showGuidelines} onOpenChange={setShowGuidelines}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Community Guidelines</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Our community is built on respect, empathy, and support.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Be Kind & Supportive</h4>
              <p className="text-sm text-muted-foreground">Listen without judgment. Offer support, not solutions.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Respect Privacy</h4>
              <p className="text-sm text-muted-foreground">What's shared in circles stays in circles. Never share others' stories.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">No Medical Advice</h4>
              <p className="text-sm text-muted-foreground">We support, not diagnose. Encourage professional help when needed.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Report Concerns</h4>
              <p className="text-sm text-muted-foreground">If you see harmful content, report it. We're here to keep everyone safe.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
