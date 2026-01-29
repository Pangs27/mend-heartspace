import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, MessageCircle, Home, ChevronLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mood = "Calm" | "Heavy" | "Anxious" | "Drained" | "Hopeful" | "Restless" | "Numb" | "Grateful";
type Need = "Clarity" | "Comfort" | "Energy" | "Less noise" | "Courage" | "Rest";

const moods: { label: Mood; emoji: string }[] = [
  { label: "Calm", emoji: "🌊" },
  { label: "Heavy", emoji: "🪨" },
  { label: "Anxious", emoji: "🌀" },
  { label: "Drained", emoji: "🔋" },
  { label: "Hopeful", emoji: "🌱" },
  { label: "Restless", emoji: "💨" },
  { label: "Numb", emoji: "🌫️" },
  { label: "Grateful", emoji: "💛" },
];

const needs: { label: Need; emoji: string }[] = [
  { label: "Clarity", emoji: "💡" },
  { label: "Comfort", emoji: "🧸" },
  { label: "Energy", emoji: "⚡" },
  { label: "Less noise", emoji: "🤫" },
  { label: "Courage", emoji: "🦁" },
  { label: "Rest", emoji: "😴" },
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [reflection, setReflection] = useState("");
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const toggleMood = (mood: Mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else if (selectedMoods.length < 2) {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Fake save
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/app");
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedMoods.length > 0;
    if (step === 2) return true; // Reflection is optional
    if (step === 3) return selectedNeed !== null;
    return false;
  };

  const stepTitles = [
    "What's present right now?",
    "One line about today",
    "What would help a little right now?"
  ];

  if (isComplete) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 pb-16 gradient-hero flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-card rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full gradient-lilac flex items-center justify-center mx-auto mb-6 shadow-soft"
                >
                  <Check className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                
                <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                  Saved.
                </h2>
                <p className="text-muted-foreground mb-8">
                  Thanks for checking in with yourself today.
                </p>

                <div className="space-y-3">
                  <Link to="/companion" className="block">
                    <Button className="w-full gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all active:scale-[0.97]">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Want to reflect a bit deeper?
                    </Button>
                  </Link>
                  <Link to="/app" className="block">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Today
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-16 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Back to Today" : "Back"}
            </button>
            
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? "gradient-lilac" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Step {step} of 3
            </p>
            <h1 className="text-2xl font-serif font-medium text-foreground">
              {stepTitles[step - 1]}
            </h1>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Select up to 2 that feel true right now.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => toggleMood(mood.label)}
                        className={`p-4 rounded-2xl border-2 transition-all active:scale-[0.97] ${
                          selectedMoods.includes(mood.label)
                            ? "border-primary bg-primary/10 shadow-soft"
                            : "border-border/50 bg-card/50 hover:bg-card/80 hover:border-border"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{mood.emoji}</span>
                        <span className="text-sm font-medium text-foreground">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    No pressure—just a sentence is enough. Or skip if nothing comes.
                  </p>
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Just a sentence is enough…"
                    className="min-h-[120px] rounded-2xl border-border/50 bg-card/50 resize-none focus:bg-card"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose one thing that would help, even just a little.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {needs.map((need) => (
                      <button
                        key={need.label}
                        onClick={() => setSelectedNeed(need.label)}
                        className={`p-4 rounded-2xl border-2 transition-all active:scale-[0.97] ${
                          selectedNeed === need.label
                            ? "border-primary bg-primary/10 shadow-soft"
                            : "border-border/50 bg-card/50 hover:bg-card/80 hover:border-border"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{need.emoji}</span>
                        <span className="text-sm font-medium text-foreground">{need.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all active:scale-[0.97] disabled:opacity-50"
            >
              {step === 3 ? "Save check-in" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {step === 2 && (
              <button
                onClick={handleNext}
                className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip this step
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
