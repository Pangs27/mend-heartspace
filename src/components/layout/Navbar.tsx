import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, LogOut, User, Sun, MessageCircle, TrendingUp, Clock, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavLink {
  name: string;
  path: string;
  icon?: LucideIcon;
}

// Links for logged-out users
const publicNavLinks: NavLink[] = [
  { name: "Home", path: "/" },
  { name: "How MEND Helps", path: "/how-mend-helps" },
  { name: "Pricing", path: "/pricing" },
];

// Links for logged-in users
const protectedNavLinks: NavLink[] = [
  { name: "Today", path: "/app", icon: Sun },
  { name: "Companion", path: "/companion", icon: MessageCircle },
  { name: "Patterns", path: "/patterns", icon: TrendingUp },
  { name: "Micro-sessions", path: "/sessions", icon: Clock },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();

  // Determine which nav links to show based on auth state
  const navLinks = isAuthenticated ? protectedNavLinks : publicNavLinks;

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to={isAuthenticated ? "/app" : "/"} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-lilac flex items-center justify-center shadow-soft group-hover:shadow-hover transition-shadow duration-300">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-medium text-foreground">MEND</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/app">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="w-7 h-7 rounded-full gradient-lilac flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                        {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                      </span>
                    </div>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="gradient-lilac text-primary-foreground shadow-soft hover:shadow-hover transition-all duration-300 border-0">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors z-50"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Subtle Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-foreground/8 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden fixed top-16 left-0 right-0 z-40 max-h-[65vh] overflow-y-auto bg-gradient-to-b from-lilac-50 to-background rounded-b-3xl shadow-card border-b border-border/50"
            >
              <div className="px-5 py-6 space-y-1">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 ${
                          location.pathname === link.path
                            ? "text-primary bg-primary/10"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Auth Section - Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                  className="pt-5 mt-4 border-t border-border/50 flex flex-col gap-3"
                >
                  {isAuthenticated ? (
                    <>
                      <Link to="/app" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-2">
                          <div className="w-10 h-10 rounded-full gradient-lilac flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user?.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-base rounded-xl gap-2"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 text-base rounded-xl">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-12 text-base rounded-xl gradient-lilac text-primary-foreground border-0 shadow-soft">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
