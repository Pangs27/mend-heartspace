import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-lilac flex items-center justify-center shadow-soft">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-serif font-medium text-foreground">MEND</span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-3xl p-8 shadow-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-medium text-foreground mb-2">Reset password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
              </div>
            </div>

            <Button className="w-full gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all">
              Send Reset Link
            </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
