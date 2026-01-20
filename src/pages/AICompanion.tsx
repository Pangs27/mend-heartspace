import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Heart, Cloud, Zap, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const quickEmotions = [
  { label: "I feel anxious", icon: Zap },
  { label: "I feel overwhelmed", icon: Cloud },
  { label: "I can't sleep", icon: Moon },
  { label: "I feel lonely", icon: Heart },
  { label: "I need to talk", icon: Sparkles },
];

export default function AICompanion() {
  const [message, setMessage] = useState("");

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        {/* Sidebar - Emotional Shortcuts */}
        <aside className="w-full lg:w-72 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick start</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {quickEmotions.map((emotion, index) => (
              <motion.button
                key={emotion.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setMessage(emotion.label)}
                className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl hover:shadow-soft transition-all whitespace-nowrap lg:whitespace-normal text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-lilac-100 flex items-center justify-center group-hover:bg-lilac-200 transition-colors">
                  <emotion.icon className="w-4 h-4 text-lilac-600" />
                </div>
                <span className="text-sm text-foreground">{emotion.label}</span>
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {/* Empty State */}
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-2xl gradient-lilac flex items-center justify-center mb-6 shadow-soft"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-serif font-medium text-foreground mb-3"
              >
                Hi, I'm here for you
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mb-6 leading-relaxed"
              >
                Whatever you're feeling right now, you can share it here. This is a safe, private space. Take your time.
              </motion.p>

              {/* Typing Indicator Placeholder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Ready to listen</span>
              </motion.div>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="px-6 pb-2">
            <p className="text-xs text-muted-foreground text-center">
              MEND provides emotional support, not medical advice. If you're in crisis, please contact a mental health professional or helpline.
            </p>
          </div>

          {/* Message Input */}
          <div className="p-4 lg:p-6 border-t border-border bg-card/50">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How are you feeling today?"
                    className="w-full min-h-[52px] max-h-32 px-4 py-3 bg-muted rounded-xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                    rows={1}
                  />
                </div>
                <Button 
                  size="lg" 
                  className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all h-[52px] px-6"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
