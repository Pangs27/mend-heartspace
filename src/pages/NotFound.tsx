import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOSModal } from "@/components/ui/SOSModal";

export default function NotFound() {
  const [sosOpen, setSosOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-peach-200 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-peach-400" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-foreground mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-6">
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setSosOpen(true)}>
            Need support?
          </Button>
        </div>
      </motion.div>

      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
