import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

interface Circle {
  id: string;
  name: string;
  description: string | null;
}

export default function Circles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("circles")
      .select("id, name, description")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setCircles(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4"
          >
            Quiet Spaces
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-lg text-muted-foreground leading-relaxed mb-4"
          >
            Some things are easier to carry together. You can listen. You can share. You can stay anonymous.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base text-muted-foreground/80 leading-relaxed"
          >
            These spaces are for shared reflection. There is no pressure to post.
            You can read quietly or start a conversation when you feel ready.
          </motion.p>
        </div>
      </section>

      {/* Circles list */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse" />
              ))
            : circles.map((circle, i) => (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link
                    to={`/circles/${circle.id}`}
                    className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-soft transition-all duration-300 tap-scale-sm"
                  >
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-medium text-foreground mb-1">
                        {circle.name}
                      </h3>
                      {circle.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {circle.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>
    </Layout>
  );
}
