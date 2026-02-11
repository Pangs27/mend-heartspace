import { motion } from "framer-motion";
import { Waves, Compass, PenLine } from "lucide-react";
import type { BaselineState, PatternSnapshot } from "@/lib/patternSnapshot";
import { getThemeLabel } from "@/lib/patternSnapshot";

// Human-language baseline descriptions — no numbers, no diagnosis
const baselineCopy: Record<BaselineState, { title: string; body: string }> = {
  calm: {
    title: "A quieter pace",
    body: "Over the past two weeks, things have felt more settled. Your emotional rhythm has been gentle.",
  },
  elevated: {
    title: "A bit more active",
    body: "Recently, there's been more emotional movement — not bad, just present. It shows you're processing.",
  },
  fluctuating: {
    title: "Some ups and downs",
    body: "Over the past two weeks, your feelings have been shifting more than usual. That's a natural part of processing.",
  },
  high: {
    title: "A lot going on",
    body: "Recently, there's been a lot of emotional energy. It's okay to feel it all — you've been carrying a lot.",
  },
};

function getThemeCopy(themes: string[]): { title: string; body: string } {
  if (themes.length === 0) {
    return {
      title: "Themes forming",
      body: "As you share more, patterns in what you reflect on will gently surface here.",
    };
  }
  const top = getThemeLabel(themes[0]);
  return {
    title: `Around ${top}`,
    body: `Over the past two weeks, a lot of your reflections seem to circle back to ${top}. It might be worth sitting with that gently.`,
  };
}

function getStabilizerCopy(recentWeek: number, priorWeek: number): { title: string; body: string } {
  if (recentWeek > priorWeek && recentWeek >= 3) {
    return {
      title: "Writing seems to be helping",
      body: "Compared to earlier entries, you've been reflecting more this week. That kind of consistency can quietly make a difference.",
    };
  }
  return {
    title: "Small moments matter",
    body: "Recently, even a few minutes of reflection can help things feel a little clearer over time.",
  };
}

interface InsightCardsProps {
  snapshot: PatternSnapshot;
}

export function InsightCards({ snapshot }: InsightCardsProps) {
  const baseline = baselineCopy[snapshot.baselineState];
  const theme = getThemeCopy(snapshot.dominantThemes);
  const stabilizer = getStabilizerCopy(snapshot.recentWeekCount, snapshot.priorWeekCount);

  const cards = [
    { icon: Waves, ...baseline, accent: "bg-lilac-100/60" },
    { icon: Compass, ...theme, accent: "bg-mint-100/60" },
    { icon: PenLine, ...stabilizer, accent: "bg-peach-100/60" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
            className="rounded-2xl bg-card p-5 shadow-card"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${card.accent}`}>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-[15px] font-serif font-semibold text-foreground mb-1.5">
              {card.title}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {card.body}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
