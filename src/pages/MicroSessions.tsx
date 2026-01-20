import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ExpertCard } from "@/components/ui/ExpertCard";
import { Button } from "@/components/ui/button";

const filters = ["All", "Relationship", "Anxiety", "Stress", "Work", "Self-worth"];

const experts = [
  { name: "Dr. Ananya Sharma", specialty: "Anxiety & Stress", rating: 4.9, sessionPrice: "₹399" },
  { name: "Ravi Menon", specialty: "Relationship Issues", rating: 4.8, sessionPrice: "₹349" },
  { name: "Dr. Priya Patel", specialty: "Work-Life Balance", rating: 4.9, sessionPrice: "₹449" },
  { name: "Kavitha Rajan", specialty: "Self-worth & Confidence", rating: 4.7, sessionPrice: "₹299" },
  { name: "Dr. Vikram Rao", specialty: "Anxiety & Depression", rating: 4.9, sessionPrice: "₹499" },
  { name: "Meera Iyer", specialty: "Stress Management", rating: 4.8, sessionPrice: "₹349" },
];

export default function MicroSessions() {
  const [activeFilter, setActiveFilter] = useState("All");

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
              Micro-Sessions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Connect with verified mental health professionals for focused 20-minute sessions. Affordable, accessible, and designed for busy lives.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
            <div className="text-center">
              <span className="text-2xl font-serif font-medium text-foreground">₹299–₹499</span>
              <p className="text-sm text-muted-foreground">20 min session</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-serif font-medium text-foreground">₹599–₹999</span>
              <p className="text-sm text-muted-foreground">Weekly chat support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-background sticky top-16 lg:top-18 z-30 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "gradient-lilac text-primary-foreground border-0" : ""}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <ExpertCard
                key={expert.name}
                {...expert}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
              Not sure who to talk to?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Let MEND recommend an expert based on your recent conversations and needs.
            </p>
            <Button size="lg" className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-8">
              Get Recommendation
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
