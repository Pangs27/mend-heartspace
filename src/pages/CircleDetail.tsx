import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CreatePostDialog from "@/components/circles/CreatePostDialog";

interface Post {
  id: string;
  title: string;
  body: string;
  alias: string;
  support_type: string | null;
  created_at: string;
}

interface Circle {
  id: string;
  name: string;
  description: string | null;
}

export default function CircleDetail() {
  const { circleId } = useParams<{ circleId: string }>();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchData = async () => {
    if (!circleId) return;
    const [circleRes, postsRes] = await Promise.all([
      supabase.from("circles").select("id, name, description").eq("id", circleId).maybeSingle(),
      supabase
        .from("circle_posts")
        .select("id, title, body, alias, support_type, created_at")
        .eq("circle_id", circleId)
        .order("created_at", { ascending: false }),
    ]);
    setCircle(circleRes.data);
    setPosts(postsRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [circleId]);

  const supportTypeLabel: Record<string, string> = {
    vent: "Venting",
    perspective: "Seeking perspective",
    ideas: "Looking for ideas",
  };

  if (!loading && !circle) {
    return (
      <Layout>
        <div className="py-24 text-center text-muted-foreground">Circle not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10 lg:py-14 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <button
            onClick={() => navigate("/circles")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quiet Spaces
          </button>

          {circle && (
            <>
              <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-2">
                {circle.name}
              </h1>
              {circle.description && (
                <p className="text-muted-foreground leading-relaxed mb-5">{circle.description}</p>
              )}
            </>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-6">
            <Shield className="w-4 h-4" />
            <span>You are anonymous here. This is peer support, not professional advice.</span>
          </div>

          <Button
            onClick={() => setShowCreate(true)}
            className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all gap-2"
          >
            <Plus className="w-4 h-4" />
            Start a conversation
          </Button>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted/50 animate-pulse" />
            ))
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No conversations yet. Be the first to share.
            </p>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  to={`/circles/${circleId}/post/${post.id}`}
                  className="block p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-soft transition-all duration-300 tap-scale-sm"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground mb-1.5">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {post.body}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                    {post.support_type && supportTypeLabel[post.support_type] && (
                      <span className="px-2.5 py-1 rounded-full bg-secondary/60 text-secondary-foreground/70">
                        {supportTypeLabel[post.support_type]}
                      </span>
                    )}
                    <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {circleId && (
        <CreatePostDialog
          open={showCreate}
          onOpenChange={setShowCreate}
          circleId={circleId}
          onCreated={fetchData}
        />
      )}
    </Layout>
  );
}
