import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpertCardProps {
  name: string;
  specialty: string;
  rating: number;
  sessionPrice: string;
  imageUrl?: string;
  delay?: number;
}

export function ExpertCard({ name, specialty, rating, sessionPrice, imageUrl, delay = 0 }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-lilac-200 to-mint-200 flex items-center justify-center text-lg font-medium text-foreground">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{name}</h4>
          <p className="text-sm text-muted-foreground">{specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-muted-foreground">{rating}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>20 min</span>
        </div>
        <span className="text-sm font-medium text-foreground">{sessionPrice}</span>
      </div>
      
      <Button className="w-full mt-4 gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
        Book Session
      </Button>
    </motion.div>
  );
}
