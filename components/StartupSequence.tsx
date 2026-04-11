"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Zap } from "lucide-react";

export const StartupSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    // Check if seen this session
    const hasSeen = sessionStorage.getItem("axe_terminal_started");
    if (hasSeen) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= 5) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinishing(true);
            sessionStorage.setItem("axe_terminal_started", "true");
            setTimeout(onComplete, 1000);
          }, 1500);
          return s;
        }
        return s + 1;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [onComplete]);

  const userName = (typeof window !== "undefined" ? localStorage.getItem("axe_user_name") : null) || "GUEST";
  const userTitle = (typeof window !== "undefined" ? localStorage.getItem("axe_user_title") : null) || "DIRECTOR";

  const steps = [
    "INITIALIZING AXE_NET SECURE PROTOCOL...",
    "ESTABLISHING ENCRYPTED LINK TO GLOBAL NODES...",
    "LOADING QUANTITATIVE MODELS (TAYLOR_V4)...",
    "SYCHRONIZING PSYCHOLOGICAL ANCHORS (WENDY)...",
    `IDENTITY VERIFIED: ${userTitle} ${userName.toUpperCase()}`,
    "THE MARKET IS VULNERABLE. THE TEAM IS READY."
  ];

  return (
    <AnimatePresence>
      {!isFinishing && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center font-mono p-4"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-tr from-[#22c55e] to-[#EAB308] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
          >
            <Zap size={48} className="text-black fill-black" />
          </motion.div>

          <div className="w-full max-w-lg space-y-3">
            {steps.slice(0, step + 1).map((text, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xs tracking-[0.2em] flex items-center gap-2 ${i === 5 ? "text-[#EAB308] font-black mt-4" : "text-[#22c55e]"}`}
              >
                <ChevronRight size={12} />
                {text}
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-12 text-[10px] text-gray-700 tracking-[0.5em] uppercase">
            Axe Capital © 2026 | No Mercy
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
