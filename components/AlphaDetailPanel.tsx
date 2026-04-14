"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ShieldAlert, Target, Zap, Waves } from "lucide-react";

export const AlphaDetailPanel = ({ symbol = "BTC", potential = "+10.4x" }) => {
  // Mock data for the graphs
  const gainData = [10, 25, 15, 45, 60, 55, 90, 100];
  const riskData = [80, 70, 60, 50, 40, 30, 20, 10];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/[0.05] to-transparent border-indigo-500/20"
    >
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
               <Zap size={20} fill="currentColor" />
            </div>
            <div>
               <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black leading-none">Alpha Breakdown</h3>
               <span className="text-sm font-black text-white">{symbol} / QUANT_V7</span>
            </div>
         </div>
         <div className="text-right">
            <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Growth Potential</div>
            <div className="text-xl font-black text-[#22c55e]">{potential}</div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* GRAPH 1: CONVICTION TREND */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest flex items-center gap-2">
              <Waves size={10} className="text-indigo-400" /> Accumulation
            </span>
            <span className="text-[10px] font-mono text-white">94.2%</span>
          </div>
          <div className="h-24 w-full bg-white/[0.02] rounded-xl border border-white/5 relative overflow-hidden flex items-end px-2 gap-1">
            {gainData.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400/10 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* GRAPH 2: RISK REDUCTION */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
             <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest flex items-center gap-2">
              <ShieldAlert size={10} className="text-red-400" /> Exposure Risk
            </span>
            <span className="text-[10px] font-mono text-white">12.5%</span>
          </div>
          <div className="h-24 w-full bg-white/[0.02] rounded-xl border border-white/5 relative overflow-hidden">
            <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full p-2 overflow-visible">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 0 35 Q 25 30, 50 15 T 100 5"
                fill="none"
                stroke="#ff3e3e"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="opacity-50"
              />
              <circle cx="100" cy="5" r="3" fill="#ff3e3e" className="animate-pulse shadow-[0_0_10px_#ff3e3e]" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <TrendingDown size={40} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* TOP FACTOR BOX */}
      <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-5 rounded-2xl relative overflow-hidden group hover:bg-[#22c55e]/10 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
           <Target size={40} className="text-[#22c55e]" />
        </div>
        <h4 className="text-[9px] text-[#22c55e] mb-2 font-black uppercase tracking-[0.4em]">Primary Buy Factor</h4>
        <div className="text-[11px] text-gray-300 font-medium leading-relaxed">
           <span className="text-white font-black">WHALE_VORTEX_DETECTED:</span> Институциональное накопление на 89% выше среднего за 30 дней. Ликвидность на стороне продажи исчерпана.
        </div>
      </div>
    </motion.div>
  );
};
