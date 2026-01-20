import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-lilac flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-serif font-medium">MEND</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your everyday emotional support system. Private, non-judgmental, always here.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/how-mend-helps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How MEND Helps</Link></li>
              <li><Link to="/companion" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Companion</Link></li>
              <li><Link to="/patterns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Patterns & Insights</Link></li>
              <li><Link to="/sessions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Micro-Sessions</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support Circles</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left font-medium">
            MEND — Because your emotions deserve care.
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} MEND. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
