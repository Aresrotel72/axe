"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, GlassWater, Zap } from "lucide-react";

export const IdentityOnboarding = ({ onComplete }: { onComplete: (name: string, title: string) => void }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Director");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("axe_user_name", name);
      localStorage.setItem("axe_user_title", title);
      setStep(2);
      setTimeout(() => onComplete(name, title), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* WAGS COLUMN */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="relative w-full aspect-square max-w-[400px] mx-auto rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-[0_0_80px_rgba(234,179,8,0.15)]">
            <Image
              src="/avatars/wags.png"
              alt="Mike Wags Wagner"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
               <div className="text-[#EAB308] font-black tracking-widest uppercase text-xl">Wags Wagner</div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl relative">
             <div className="absolute -top-3 -left-3">
                <GlassWater className="text-[#EAB308]" size={32} />
             </div>
             <p className="text-gray-300 italic text-lg leading-relaxed">
               "Добро пожаловать в высшую лигу. Акс не терпит анонимности. Прежде чем мы начнем потрошить рынок, мне нужно знать, как тебя называть, когда мы будем праздновать твой первый миллион."
             </p>
          </div>
        </motion.div>

        {/* FORM COLUMN */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                  Identity <span className="text-[#22c55e]">Protocol</span>
                </h1>
                <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                  Axe Capital | Security Clearance Level 1
                </p>
                
                <form onSubmit={(e) => { e.preventDefault(); setStep(1); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Full Name / Alias</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border-2 border-white/10 focus:border-[#22c55e] outline-none rounded-2xl py-4 px-6 text-xl text-white transition-all uppercase font-mono"
                      placeholder="Enter Identity..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-95"
                  >
                    Confirm <ArrowRight size={20} />
                  </button>
                </form>
              </motion.div>
            ) : step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                  Select <span className="text-[#EAB308]">Status</span>
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  {["LEGEND", "DIRECTOR", "AMBASSADOR", "ELITE", "SHARP", "QUANT"].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTitle(t)}
                      className={`py-4 rounded-2xl text-[10px] font-black tracking-widest border-2 transition-all ${
                        title === t ? "bg-[#EAB308] border-[#EAB308] text-black" : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-[#EAB308] hover:bg-[#d4a017] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-95"
                >
                  Finalize Access <ShieldCheck size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                >
                  <Zap size={40} fill="currentColor" />
                </motion.div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Identity Secured</h2>
                <div className="text-[#22c55e] font-mono uppercase tracking-[0.3em] text-xs">Welcome home, {title} {name}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};
