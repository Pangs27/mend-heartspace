import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateAlias } from "@/lib/aliasGenerator";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  body: string;
  alias: string;
  support_type: string | null;
  created_at: string;
}

interface Reply {
  id: string;
  alias: string;
  body: string;
  created_at: string;
}

export default function PostDetail() {
  const { circleId, postId } = useParams<{ circleId: string; postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!postId) return;
    const [postRes, repliesRes] = await Promise.all([
      supabase.from("circle_posts").select("id, title, body, alias, support_type, created_at").eq("id", postId).maybeSingle(),
      supabase.from("post_replies").select("id, alias, body, created_at").eq("post_id", postId).order("created_at", { ascending: true }),
    ]);
    setPost(postRes.data);
    setReplies(repliesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handleReply = async () => {
    if (!replyBody.trim() || !user || !postId) return;
    setSubmitting(true);
    const { error } = await supabase.from("post_replies").insert({
      post_id: postId,
      user_id: user.id,
      alias: generateAlias(),
      body: replyBody.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send reply. Please try again.");
      return;
    }
    setReplyBody("");
    fetchData();
  };

  if (!loading && !post) {
    return (
      <Layout>
        <div className="py-24 text-center text-muted-foreground">Post not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10 lg:py-14 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <button
            onClick={() => navigate(`/circles/${circleId}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {loading ? (
            <div className="h-40 rounded-2xl bg-muted/50 animate-pulse" />
          ) : post && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
                {post.title}
              </h1>
              <p className="text-foreground/80 leading-[1.8] whitespace-pre-wrap mb-4">
                {post.body}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                <span>{post.alias}</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Replies */}
      <section className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {replies.length > 0 && (
            <div className="space-y-4 mb-10">
              {replies.map((reply, i) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="p-4 rounded-xl bg-card border border-border/40"
                >
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap mb-2">
                    {reply.body}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                    <span>{reply.alias}</span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reply input */}
          <div className="space-y-3">
            <Textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Respond thoughtfully..."
              className="min-h-[100px] rounded-xl border-border/60 bg-card focus-visible:ring-primary/30 resize-none"
              maxLength={2000}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleReply}
                disabled={!replyBody.trim() || submitting}
                className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all"
              >
                {submitting ? "Sending…" : "Reply"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
