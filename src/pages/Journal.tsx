import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const prompts = [
  "What's been weighing on you?",
  "Something you're avoiding",
  "A moment that stayed with you",
  "One thing you handled better than before",
  "Something you wish you'd said",
];

export default function Journal() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  
  // Placeholder: will be replaced with real data
  const recentEntries: unknown[] = [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-serif text-foreground mb-2">Journal</h1>
          <p className="text-muted-foreground/70">
            A place to put things down, without needing a response.
          </p>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-soft mb-8">
            <CardContent className="p-8 text-center">
              <Button 
                size="lg" 
                className="gradient-lilac text-primary-foreground shadow-soft hover:shadow-hover transition-all duration-300 border-0 mb-4 gap-2"
              >
                <PenLine className="w-4 h-4" />
                Write a check-in
              </Button>
              <p className="text-sm text-muted-foreground/60 mb-4">
                No structure. No right way to do this.
              </p>
              <button 
                className="text-sm text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1.5"
                onClick={() => setSelectedPrompt(prompts[0])}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Use a prompt
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prompt Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {prompts.map((prompt, index) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                onClick={() => setSelectedPrompt(prompt)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                  selectedPrompt === prompt
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/30 border-border/40 text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground/80"
                }`}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Entries Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-[11px] text-muted-foreground/40 tracking-wide mb-4 text-center">
            recent entries
          </p>
          
          {recentEntries.length === 0 ? (
            <Card className="border-border/30 bg-muted/20 shadow-none">
              <CardContent className="p-10 text-center">
                <p className="text-foreground/70 font-medium mb-2">
                  This space stays quiet until you use it.
                </p>
                <p className="text-sm text-muted-foreground/50">
                  You don't need to write often. Just when it helps.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Placeholder for future entries */}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
