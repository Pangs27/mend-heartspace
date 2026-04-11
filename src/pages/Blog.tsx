import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Heart, Brain, Sparkles, Sun } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Emotional Patterns: A Guide to Self-Awareness",
    excerpt:
      "Discover how recognizing recurring emotional patterns can help you build healthier responses and deeper self-understanding.",
    category: "Self-Awareness",
    date: "April 8, 2026",
    readTime: "6 min read",
    icon: Brain,
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-400",
  },
  {
    id: 2,
    title: "The Science Behind Daily Check-Ins",
    excerpt:
      "Research shows that regular emotional check-ins can reduce stress by up to 23%. Learn why this simple habit makes such a big difference.",
    category: "Wellness",
    date: "April 5, 2026",
    readTime: "4 min read",
    icon: Heart,
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
  {
    id: 3,
    title: "How AI Companions Are Changing Mental Health Support",
    excerpt:
      "Exploring the intersection of artificial intelligence and emotional wellness — how technology can complement traditional therapy.",
    category: "Technology",
    date: "April 2, 2026",
    readTime: "8 min read",
    icon: Sparkles,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    id: 4,
    title: "Building Emotional Resilience: 5 Practices That Work",
    excerpt:
      "Practical, evidence-based techniques you can start using today to strengthen your emotional resilience and well-being.",
    category: "Practices",
    date: "March 28, 2026",
    readTime: "5 min read",
    icon: Sun,
    gradient: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-400",
  },
];

export default function Blog() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                MEND Blog
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 tracking-tight">
                Insights for Your{" "}
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Emotional Journey
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Explore articles on emotional wellness, self-awareness, and the
                science behind building healthier emotional habits.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {blogPosts.map((post) => {
                const IconComponent = post.icon;
                return (
                  <article
                    key={post.id}
                    className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    {/* Card Header with Gradient */}
                    <div
                      className={`h-40 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      <IconComponent
                        className={`w-12 h-12 ${post.iconColor} relative z-10 group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </div>
                      </div>

                      <h2 className="text-xl font-serif font-medium mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Coming Soon Note */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-border/50">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  More articles coming soon. Stay tuned for weekly insights!
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
