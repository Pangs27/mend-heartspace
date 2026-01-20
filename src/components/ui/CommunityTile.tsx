import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityTileProps {
  name: string;
  memberCount: number;
  color: "lilac" | "mint" | "peach";
  delay?: number;
}

const colorStyles = {
  lilac: "from-lilac-200 to-lilac-100",
  mint: "from-mint-200 to-mint-100",
  peach: "from-peach-200 to-peach-100",
};

export function CommunityTile({ name, memberCount, color, delay = 0 }: CommunityTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorStyles[color]} rounded-2xl p-5 cursor-pointer transition-all duration-300`}
    >
      <h4 className="font-serif font-medium text-foreground mb-2">{name}</h4>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Users className="w-4 h-4" />
        <span>{memberCount.toLocaleString()} members</span>
      </div>
      <Button size="sm" variant="secondary" className="w-full">
        Join Circle
      </Button>
    </motion.div>
  );
}
