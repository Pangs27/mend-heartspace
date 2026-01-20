import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SOSModal({ isOpen, onClose }: SOSModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card w-full max-w-md rounded-3xl p-8 shadow-hover relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <div className="text-center">
                {/* Breathing Animation Circle */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-lilac-200 to-mint-200"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="absolute inset-3 rounded-full bg-gradient-to-br from-lilac-100 to-mint-100"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute inset-6 rounded-full bg-card flex items-center justify-center"
                  >
                    <span className="text-2xl font-serif text-primary">Breathe</span>
                  </motion.div>
                </div>
                
                <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                  Let's slow this moment down together
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Take a deep breath. You're safe here. Follow the breathing circle above — inhale as it expands, exhale as it contracts.
                </p>
                
                <Button className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-8">
                  Help me calm down
                </Button>
                
                <p className="text-xs text-muted-foreground mt-6">
                  If you're in crisis, please reach out to{" "}
                  <a href="tel:9152987821" className="text-primary hover:underline">iCall: 9152987821</a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
