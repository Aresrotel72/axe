"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Key, Settings, Zap, Headphones, ShieldCheck, Save } from "lucide-react";

export const VoiceSettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [apiKey, setApiKey] = useState("");
  const [axeVoiceId, setAxeVoiceId] = useState("");
  const [isElevenLabsActive, setIsElevenLabsActive] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem("eleven_labs_api_key") || "");
      setAxeVoiceId(localStorage.getItem("eleven_labs_axe_voice_id") || "pNInz6obpg8nEmeW44wi"); // Default "Josh"
      setIsElevenLabsActive(localStorage.getItem("eleven_labs_active") === "true");
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("eleven_labs_api_key", apiKey);
    localStorage.setItem("eleven_labs_axe_voice_id", axeVoiceId);
    localStorage.setItem("eleven_labs_active", isElevenLabsActive.toString());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-panel w-full max-w-xl overflow-hidden rounded-[3rem] border-[#EAB308]/30 shadow-[0_0_100px_rgba(234,179,8,0.1)]"
        >
          <div className="flex justify-between items-center p-8 border-b border-white/10 bg-white/5">
            <h3 className="text-xl font-black flex items-center gap-3 text-[#EAB308] tracking-tighter uppercase italic">
              <Mic size={24} /> Voice_Sync Engine
            </h3>
            <button onClick={onClose} className="hover:text-[#EAB308] transition-colors p-2 bg-white/5 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="p-10 space-y-8">
            {/* TOGGLE */}
            <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-3xl border border-white/5">
               <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Elite AI Voices (ElevenLabs)</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Switch from browser TTS to professional character voices.</p>
               </div>
               <button 
                  onClick={() => setIsElevenLabsActive(!isElevenLabsActive)}
                  className={`relative w-14 h-8 rounded-full transition-all flex items-center px-1 ${
                    isElevenLabsActive ? "bg-[#22c55e]" : "bg-gray-800"
                  }`}
               >
                  <motion.div 
                    animate={{ x: isElevenLabsActive ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
               </button>
            </div>

            <div className={`space-y-6 transition-all ${isElevenLabsActive ? "opacity-100" : "opacity-30 pointer-events-none grayscale"}`}>
              {/* API KEY */}
              <div className="space-y-2">
                <label className="text-[9px] text-gray-600 font-extrabold uppercase tracking-[0.3em] flex items-center gap-2">
                  <Key size={12} className="text-[#EAB308]" /> ElevenLabs API Key
                </label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="w-full bg-black/40 border-2 border-white/10 focus:border-[#EAB308] outline-none rounded-2xl py-4 px-6 text-sm text-white transition-all font-mono"
                />
                <p className="text-[9px] text-gray-500 italic">Get your key from elevenlabs.io profile settings.</p>
              </div>

              {/* VOICE ID */}
              <div className="space-y-2">
                <label className="text-[9px] text-gray-600 font-extrabold uppercase tracking-[0.3em] flex items-center gap-2">
                  <Headphones size={12} className="text-[#00A3FF]" /> Axe Voice ID (Custom Clone)
                </label>
                <input 
                  type="text"
                  value={axeVoiceId}
                  onChange={(e) => setAxeVoiceId(e.target.value)}
                  placeholder="Voice ID from your Voice Lab..."
                  className="w-full bg-black/40 border-2 border-white/10 focus:border-[#00A3FF] outline-none rounded-2xl py-4 px-6 text-sm text-white transition-all font-mono"
                />
                <p className="text-[9px] text-gray-500 italic">This is the ID of your cloned voice or a chosen preset.</p>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                  saved ? "bg-[#22c55e] text-black" : "bg-[#EAB308] text-black hover:bg-[#d4a017] shadow-[0_0_40px_rgba(234,179,8,0.2)]"
                }`}
              >
                {saved ? <><ShieldCheck size={20} /> Identity Stored</> : <><Save size={20} /> Sync Profiles</>}
              </button>
            </div>

            <p className="text-center text-[9px] text-gray-700 uppercase tracking-widest font-bold">
              Secure_Channel: All keys are stored locally in your browser.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
