import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, Cloud, Zap, Moon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const quickEmotions = [
  { label: "I feel anxious", icon: Zap },
  { label: "I feel overwhelmed", icon: Cloud },
  { label: "I can't sleep", icon: Moon },
  { label: "I feel lonely", icon: Heart },
  { label: "I need to talk", icon: Sparkles },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

// Placeholder for auth check - replace with actual Supabase auth later
const useAuth = () => {
  // TODO: Replace with actual auth check from Supabase
  // const { user } = useSupabaseAuth();
  // return { isAuthenticated: !!user, user };
  
  // For now, check localStorage for a mock auth state (for testing)
  const isAuthenticated = localStorage.getItem("mend_mock_auth") === "true";
  return { isAuthenticated, user: isAuthenticated ? { id: "mock" } : null };
};

// Placeholder assistant response - replace with Edge Function call later
const getAssistantResponse = async (userMessage: string): Promise<string> => {
  // TODO: Replace with Supabase Edge Function call
  // const { data } = await supabase.functions.invoke('mend_chat', { body: { message: userMessage } });
  // return data.response;
  
  // Simulate response delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return "I hear you, and I'm glad you're reaching out. What you're feeling is valid, and it takes courage to express it. I'd love to continue supporting you through this.";
};

export default function AICompanion() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isDisabled || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setHasInteracted(true);
    setIsLoading(true);

    // If not authenticated, disable further input after first message
    if (!isAuthenticated) {
      setIsDisabled(true);
    }

    try {
      // Get assistant response (placeholder - replace with Edge Function)
      const response = await getAssistantResponse(content);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If not authenticated, show redirect message and navigate
      if (!isAuthenticated) {
        setTimeout(() => {
          setShowRedirectMessage(true);
        }, 800);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDisabled, isLoading, navigate]);

  const handleQuickEmotion = (emotion: string) => {
    if (!isDisabled && !isLoading) {
      handleSendMessage(emotion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message);
    }
  };

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
                onClick={() => handleQuickEmotion(emotion.label)}
                disabled={isDisabled || isLoading}
                className={`flex items-center gap-3 px-4 py-3 bg-card rounded-xl transition-all whitespace-nowrap lg:whitespace-normal text-left group ${
                  isDisabled || isLoading 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:shadow-soft cursor-pointer"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-lilac-100 flex items-center justify-center transition-colors ${
                  !isDisabled && !isLoading ? "group-hover:bg-lilac-200" : ""
                }`}>
                  <emotion.icon className="w-4 h-4 text-lilac-600" />
                </div>
                <span className="text-sm text-foreground">{emotion.label}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Disabled state helper text */}
          <AnimatePresence>
            {isDisabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-lilac-50 rounded-xl border border-lilac-200"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-lilac-500" />
                  <span>Sign up or log in to continue chatting with MEND.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {messages.length === 0 ? (
              /* Empty State */
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
            ) : (
              /* Chat Messages */
              <div className="max-w-2xl mx-auto space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card shadow-soft border border-border rounded-bl-md"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg gradient-lilac flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-primary-foreground" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">MEND</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="bg-card shadow-soft border border-border rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg gradient-lilac flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-primary-foreground" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">MEND</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-lilac-300 animate-pulse" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Redirect system message */}
                <AnimatePresence>
                  {showRedirectMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span>Create an account to continue this conversation.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
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
                    onKeyDown={handleKeyDown}
                    placeholder={isDisabled ? "Sign up to continue..." : "How are you feeling today?"}
                    disabled={isDisabled || isLoading}
                    className={`w-full min-h-[52px] max-h-32 px-4 py-3 bg-muted rounded-xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground transition-opacity ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    rows={1}
                  />
                </div>
                <Button 
                  size="lg" 
                  className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all h-[52px] px-6"
                  disabled={!message.trim() || isDisabled || isLoading}
                  onClick={() => handleSendMessage(message)}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Helper text for disabled state */}
              <AnimatePresence>
                {isDisabled && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-center text-muted-foreground mt-3"
                  >
                    Sign up or log in to continue chatting with MEND.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
