import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { PricingCard } from "@/components/ui/PricingCard";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Start your emotional wellness journey",
    features: [
      "AI companion conversations",
      "Basic mood tracking",
      "Limited pattern insights",
      "Community access",
    ],
    ctaText: "Start Free",
  },
  {
    name: "MEND Plus",
    price: "₹499",
    period: "month",
    description: "Deeper insights and unlimited support",
    features: [
      "Unlimited AI conversations",
      "Advanced pattern intelligence",
      "Weekly reflection reports",
      "Priority community support",
      "1 reflection session credit/month",
    ],
    highlighted: true,
    ctaText: "Upgrade to Plus",
  },
  {
    name: "Add-ons",
    price: "₹299+",
    description: "Flexible options for extra support",
    features: [
      "Additional reflection sessions",
      "Weekly expert chat support",
      "Group therapy sessions",
      "Personalized wellness plans",
    ],
    ctaText: "View Add-ons",
  },
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6"
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} {...plan} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl font-serif font-medium text-foreground mb-8"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-4 text-left">
              {[
                {
                  q: "Can I try MEND for free?",
                  a: "Yes! Our free plan includes unlimited AI conversations and basic features. Upgrade anytime for deeper insights.",
                },
                {
                  q: "What are reflection sessions?",
                  a: "20-minute focused sessions with verified mental health professionals. Perfect for specific issues or check-ins.",
                },
                {
                  q: "Is my data private?",
                  a: "Absolutely. We use end-to-end encryption and never share your data. Your conversations stay between you and MEND.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-5 shadow-soft"
                >
                  <h4 className="font-medium text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
