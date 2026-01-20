import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  delay?: number;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  ctaText = "Get Started",
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
        highlighted
          ? "bg-card shadow-hover border-2 border-primary/30"
          : "bg-card shadow-card hover:shadow-hover"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-serif font-medium text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-serif font-semibold text-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground ml-1">/{period}</span>}
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-mint-500" />
            </div>
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        className={`w-full ${
          highlighted
            ? "gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover"
            : ""
        }`}
        variant={highlighted ? "default" : "outline"}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
}