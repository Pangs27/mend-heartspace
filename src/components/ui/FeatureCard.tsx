import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "lilac" | "mint" | "peach";
  delay?: number;
}

const variantStyles = {
  lilac: "bg-lilac-100 text-lilac-600",
  mint: "bg-mint-100 text-mint-500",
  peach: "bg-peach-200 text-peach-400",
};

export function FeatureCard({ icon: Icon, title, description, variant = "lilac", delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-xl ${variantStyles[variant]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-serif font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}