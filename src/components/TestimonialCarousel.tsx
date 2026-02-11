import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "MEND helped me understand patterns I never noticed before. It's like having a gentle friend who really listens.",
    author: "Priya S.",
    context: "Mumbai",
  },
  {
    quote: "The reflection sessions are perfect for my busy schedule. 20 minutes that genuinely help me reset.",
    author: "Arjun M.",
    context: "Bengaluru",
  },
  {
    quote: "I was skeptical about talking to an AI, but MEND feels different. It's warm, not clinical.",
    author: "Neha R.",
    context: "Delhi",
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center px-8"
          >
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 font-serif italic">
              "{testimonials[current].quote}"
            </p>
            <div>
              <p className="font-medium text-foreground">{testimonials[current].author}</p>
              <p className="text-sm text-muted-foreground">{testimonials[current].context}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => navigate("prev")}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => navigate("next")}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
