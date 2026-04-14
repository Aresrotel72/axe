"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  Terminal, 
  LineChart, 
  Users, 
  Globe, 
  Skull,
  Search,
  MessageSquare,
  ArrowUpRight,
  Target,
  RefreshCw,
  Loader2,
  X,
  Workflow,
  BrainCircuit,
  Activity,
  ChevronRight,
  Coins,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  HelpCircle,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateDualIntel, AgentResponse, AgentRole } from "@/lib/agents";
import { StartupSequence } from "@/components/StartupSequence";
import { IdentityOnboarding } from "@/components/IdentityOnboarding";
import { AlphaDetailPanel } from "@/components/AlphaDetailPanel";
import { VoiceSettingsModal } from "@/components/VoiceSettingsModal";

// --- COMPONENTS ---

const DecisionTreeModal = ({ isOpen, onClose, message }: { isOpen: boolean, onClose: () => void, message: AgentResponse | null }) => {
  if (!isOpen || !message) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-panel w-full max-w-2xl overflow-hidden rounded-3xl border-[#EAB308]/30"
          style={{ border: '1px solid rgba(234, 179, 8, 0.3)' }}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
            <h3 className="text-xl font-black flex items-center gap-2 text-[#EAB308] tracking-tighter">
              <Workflow size={24} /> LOGIC DECONSTRUCTION
            </h3>
            <button onClick={onClose} className="hover:text-[#EAB308] transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8 space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Target size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] text-gray-500 mb-1 uppercase tracking-[0.3em] font-black">Proposition Input</h4>
                <div className="text-sm bg-black/60 p-4 rounded-2xl border border-white/5 italic text-gray-300">
                  "Analyzing user liquidity proposition vs market maker depth and psychological baseline."
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="w-px h-10 bg-gradient-to-b from-[#EAB308] to-[#22c55e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#EAB308] shadow-[0_0_20px_#EAB308]"></div>
              <div className="w-px h-10 bg-gradient-to-b from-[#22c55e] to-transparent"></div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { name: "Wendy", label: "Psychology", icon: BrainCircuit, color: "text-[#00A3FF]", res: "EGO_CHECK" },
                { name: "Axe", label: "Opportunity", icon: TrendingUp, color: "text-[#EAB308]", res: "HIGH_ALPHA" },
                { name: "Taylor", label: "Probability", icon: ShieldAlert, color: "text-[#ff3e3e]", res: "RISK_LOCK" },
              ].map((agent) => (
                <div key={agent.name} className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-center group hover:bg-white/10 transition-all">
                  <agent.icon className={`mx-auto mb-3 ${agent.color}`} size={24} />
                  <span className="text-[9px] text-gray-500 block uppercase font-black mb-1">{agent.name}</span>
                  <p className="text-[10px] font-mono text-white tracking-widest">{agent.res}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 p-5 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <ShieldCheck size={40} className="text-[#22c55e]" />
               </div>
              <h4 className="text-[10px] text-[#22c55e] mb-2 font-black uppercase tracking-[0.3em]">Verified Verdict</h4>
              <p className="text-sm text-gray-200 leading-relaxed">{message.content}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---

export default function Home() {
  const [activeTab, setActiveTab] = useState("terminal");
  const [altseasonIndex, setAltseasonIndex] = useState(68);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<AgentResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [user, setUser] = useState({ name: "", title: "" });
  
  // Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [prices, setPrices] = useState({ btc: 65421.12, eth: 3241.84, sol: 142.12 });
  const [isElevenLabsActive, setIsElevenLabsActive] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check for user
    const savedName = localStorage.getItem("axe_user_name");
    const savedTitle = localStorage.getItem("axe_user_title");
    setIsElevenLabsActive(localStorage.getItem("eleven_labs_active") === "true");

    if (!savedName) {
      setNeedsOnboarding(true);
    } else {
      setUser({ name: savedName, title: savedTitle || "Director" });
    }

    const interval = setInterval(() => {
      setPrices(prev => ({
        btc: prev.btc + (Math.random() - 0.5) * 10,
        eth: prev.eth + (Math.random() - 0.5) * 5,
        sol: prev.sol + (Math.random() - 0.5) * 2
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- AUDIO LOGIC ---

  const speak = async (text: string, role: AgentRole | "WAGS") => {
    if (typeof window === "undefined") return;

    // Check for ElevenLabs
    const active = localStorage.getItem("eleven_labs_active") === "true";
    const apiKey = localStorage.getItem("eleven_labs_api_key");
    const axeVoiceId = localStorage.getItem("eleven_labs_axe_voice_id");

    if (active && apiKey && role === "AXE") {
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             text: text,
             voiceId: axeVoiceId || "pNInz6obpg8nEmeW44wi",
             apiKey: apiKey
          })
        });

        if (response.ok) {
           const blob = await response.blob();
           const url = URL.createObjectURL(blob);
           const audio = new Audio(url);
           audio.play();
           return;
        }
      } catch (e) {
        console.error("ElevenLabs failed, falling back to browser TTS", e);
      }
    }

    // Default Browser TTS Fallback
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const chunks = text.split(/[.!?]+/).filter(t => t.trim().length > 0);
    let currentChunk = 0;

    const speakNextChunk = () => {
      if (currentChunk >= chunks.length) return;
      const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
      const voices = window.speechSynthesis.getVoices();
      const ruVoices = voices.filter(v => v.lang.includes("ru"));
      const maleVoices = ruVoices.filter(v => v.name.toLowerCase().includes("male") || v.name.includes("Pavel") || v.name.includes("Yuri"));
      const femaleVoices = ruVoices.filter(v => v.name.toLowerCase().includes("female") || v.name.includes("Milena") || v.name.includes("Katya") || v.name.includes("Irina"));

      switch(role) {
        case "AXE": 
          utterance.pitch = 0.75; utterance.rate = 0.85; utterance.voice = maleVoices[0] || ruVoices[0];
          break;
        case "TAYLOR": 
          utterance.pitch = 1.05; utterance.rate = 1.35; utterance.voice = femaleVoices[0] || ruVoices[0];
          break;
        case "WENDY": 
          utterance.pitch = 0.95; utterance.rate = 0.8; utterance.voice = femaleVoices[1] || femaleVoices[0] || ruVoices[0];
          break;
        case "WAGS":
          utterance.pitch = 1.25; utterance.rate = 1.15; utterance.voice = maleVoices[1] || maleVoices[0] || ruVoices[0];
          break;
      }

      utterance.onend = () => {
        currentChunk++;
        setTimeout(speakNextChunk, role === "WENDY" ? 600 : 300);
      };
      window.speechSynthesis.speak(utterance);
    };
    speakNextChunk();
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // --- SUBMISSION ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMsg = input;
    setInput("");

    // Thinking sequence
    setTimeout(async () => {
      const responses = await generateDualIntel(userMsg);
      setMessages(prev => [...prev, ...responses]);
      setIsLoading(false);
      
      // Auto-speak first response if voice is enabled
      if (isVoiceEnabled && responses.length > 0) {
        speak(responses[0].content, responses[0].role);
      }

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 2000);
  };

  const [messages, setMessages] = useState<AgentResponse[]>([
    {
      role: "AXE",
      avatar: "/avatars/axe.png",
      content: "Я вижу накопление в альткоинах средней капитализации. Толпа всё еще спит, но Маркет Мейкеры уже начали расставлять ловушки для медведей. Это наш момент.",
      factors: ["Whale accumulation detected", "BTC dominance dropping", "Sentiment bottomed out"]
    },
    {
      role: "TAYLOR",
      avatar: "/avatars/taylor.png",
      content: "Математически мы находимся на уровне 0.618 по Фибоначчи относительно мартовского хая. Вероятность начала параболической фазы в ближайшие 12 дней составляет 74.3%. Риск системного сбоя минимален.",
      factors: ["Co-integration stable", "Volatility compression", "Institutional flow positive"]
    },
    {
      role: "WENDY",
      avatar: "/avatars/wendy.png",
      content: "Это начало. Твоё тело чувствует волатильность раньше, чем твой мозг её осознает. Сфокусируйся на дыхании. Дай цифрам Тейлор и чутью Акса сделать свою работу. Оставайся спокойным.",
      factors: ["Emotional baseline: Calm", "Focus adjustment", "Performance lock"]
    }
  ]);

  const showWagsTutorial = () => {
    speak("Слушай меня внимательно. Перед тобой — не просто терминал. Это твоя личная армия. Слева — наши радары на иксы и системные риски. По центру — поле битвы. Если хочешь, чтобы Акс тебя услышал — просто нажми на микрофон. И не забудь заглянуть в настройки голоса, господин Амбассадор.", "WAGS");
  };

  if (needsOnboarding) {
    return (
      <IdentityOnboarding 
        onComplete={(name, title) => {
          setUser({ name, title });
          setNeedsOnboarding(false);
        }} 
      />
    );
  }

  if (!isStarted) {
    return <StartupSequence onComplete={() => setIsStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 selection:bg-[#22c55e] selection:text-black font-sans overflow-x-hidden">
      <DecisionTreeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message={selectedMessage} 
      />
      <VoiceSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => {
          setIsSettingsOpen(false);
          setIsElevenLabsActive(localStorage.getItem("eleven_labs_active") === "true");
        }} 
      />

      {/* HEADER / LIVE TICKER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1700px] mx-auto px-6 py-2 flex justify-between items-center overflow-hidden">
          <div className="flex gap-10 items-center overflow-hidden">
            <div className="flex items-center gap-3 shrink-0">
               <div className="w-6 h-6 bg-gradient-to-tr from-[#22c55e] to-[#EAB308] rounded-md flex items-center justify-center">
                  <Zap size={14} className="text-black fill-black" />
               </div>
               <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase sm:block hidden">Axe Intelligence</span>
            </div>
            
            <div className="flex gap-8 items-center animate-scroll-ticker">
               {[
                 { l: "BTC", v: prices.btc.toLocaleString(), c: "#22c55e" },
                 { l: "ETH", v: prices.eth.toLocaleString(), c: "#00A3FF" },
                 { l: "SOL", v: prices.sol.toLocaleString(), c: "#D4AF37" },
                 { l: "MARKET", v: "BULLISH", c: "#22c55e" },
                 { l: "DXY", v: "105.42", c: "#ff3e3e" },
               ].map((t, i) => (
                 <div key={i} className="flex gap-2 items-center shrink-0">
                    <span className="text-[9px] text-gray-600 font-black">{t.l}</span>
                    <span className="text-[10px] font-mono text-white">${t.v}</span>
                    <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: t.c }}></div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
             <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                <button 
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        isVoiceEnabled ? "bg-[#22c55e]/10 text-[#22c55e]" : "text-gray-500"
                    }`}
                >
                    {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className={`p-1.5 rounded-lg transition-all ${
                        isElevenLabsActive ? "text-[#EAB308] hover:bg-[#EAB308]/10" : "text-gray-600 hover:text-white"
                    }`}
                >
                    <Settings size={16} />
                </button>
             </div>
             
             <button 
                onClick={showWagsTutorial}
                className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-all"
             >
                <HelpCircle size={18} />
             </button>

             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] text-[#22c55e] font-black tracking-widest">STABLE_SEC_ACCESS</span>
                <span className="text-[10px] text-white font-mono">{user.title} {user.name.toUpperCase()}</span>
             </div>
          </div>
        </div>
      </header>

      <div className="pt-16 grid grid-cols-12 gap-8 max-w-[1800px] mx-auto">
        {/* LEFT COLUMN: METRICS */}
        <aside className="col-span-12 xl:col-span-3 space-y-6 lg:block hidden">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2rem] relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Target size={120} />
             </div>
            <h2 className="text-[10px] text-gray-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em] font-black">
              <LineChart size={16} className="text-[#EAB308]" /> Altseason Index
            </h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-7xl font-black text-white tracking-tighter">{altseasonIndex}</span>
              <span className="text-xl text-[#EAB308] font-bold">%</span>
            </div>
            <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#22c55e] to-[#EAB308] h-full rounded-full shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-1000" 
                style={{ width: `${altseasonIndex}%` }}
              ></div>
            </div>
            <div className="mt-6 flex justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] text-gray-600 uppercase font-black">Current Phase</span>
                  <span className="text-[#EAB308] text-xs font-bold uppercase">Accumulation Bloom</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[9px] text-gray-600 uppercase font-black">Probability</span>
                  <span className="text-white text-xs font-bold uppercase">High Conviction</span>
               </div>
            </div>
          </motion.section>

          <AlphaDetailPanel symbol="RENDER" potential="+14.2x" />

          <section className="glass-panel p-8 rounded-[2rem] bg-amber-500/[0.03]">
             <h2 className="text-[10px] text-amber-600 mb-6 flex items-center gap-3 uppercase tracking-[0.4em] font-black">
              <Users size={16} /> Operations (WAGS)
            </h2>
            <div className="flex gap-4">
               <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                  <Image src="/avatars/wags.png" alt="Wags" width={48} height={48} className="object-cover" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold">
                    "Не трать время на мелочи. Смотри на на прилив, а не на волны. Я здесь, чтобы ты не совершил глупостей."
                  </p>
                  <button 
                    onClick={() => speak("Эй, чемпион. У нас тут пахнет деньгами. Не тупи, жми на кнопки.", "WAGS")}
                    className="mt-2 text-[9px] text-amber-500 font-black flex items-center gap-1 uppercase hover:underline"
                  >
                    Listen to Boss <Volume2 size={10} />
                  </button>
               </div>
            </div>
          </section>
        </aside>

        {/* CENTER COLUMN: INTEL FEED */}
        <main className="col-span-12 xl:col-span-6 flex flex-col h-[85vh] glass-panel rounded-[3rem] overflow-hidden shadow-2xl relative border-white/10">
          <div className="bg-white/5 px-8 py-5 flex justify-between items-center border-b border-white/10">
            <div className="flex gap-10">
              {["TERMINAL", "MODELS", "PREDATOR"].map(tab => (
                <button 
                  key={tab}
                  className={`text-[11px] font-black tracking-[0.2em] transition-all relative ${
                    activeTab === tab.toLowerCase() ? "text-white pb-2" : "text-gray-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] shadow-[0_0_10px_#22c55e]" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500">
               <Volume2 size={14} className={isVoiceEnabled ? "text-[#22c55e] animate-pulse" : "text-gray-600"} /> 
               {isVoiceEnabled ? (isElevenLabsActive ? "ELITE AI AUDIO" : "LIVE AUDIO") : "AUDIO MUTED"}
            </div>
          </div>

          <div 
            id="chat-feed"
            className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide"
          >
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="group flex gap-6"
              >
                <div className="shrink-0">
                   <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#22c55e]/50 transition-all shadow-xl">
                      <Image
                        src={msg.avatar || "/avatars/axe.png"}
                        alt={msg.role}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                        msg.role === "AXE" ? "bg-[#EAB308]" : 
                        msg.role === "TAYLOR" ? "bg-[#00A3FF]" : "bg-[#22c55e]"
                      }`}></div>
                   </div>
                </div>
                
                <div className="flex-1 space-y-3">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className={`text-[12px] font-black tracking-[0.2em] ${
                          msg.role === "AXE" ? "text-[#EAB308]" : 
                          msg.role === "TAYLOR" ? "text-[#00A3FF]" : "text-[#22c55e]"
                        }`}>
                          {msg.role} {msg.role === "WENDY" ? "ANCHOR" : "PROTOCOL"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => speak(msg.content, msg.role)}
                          className="p-1.5 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                   </div>
                   
                   <div className="bg-white/[0.04] p-6 rounded-[2rem] rounded-tl-none border border-white/5 group-hover:bg-white/[0.07] transition-all relative">
                      <p className={`text-md leading-[1.7] ${msg.role === "WENDY" ? "italic text-gray-300 font-medium" : "text-white font-semibold"}`}>
                        {msg.content}
                      </p>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                           {msg.factors.map((f, j) => (
                             <span key={j} className="text-[9px] bg-black/40 text-gray-500 px-3 py-1 rounded-full border border-white/5 uppercase font-bold tracking-widest">
                                # {f}
                             </span>
                           ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsModalOpen(true);
                          }}
                          className="text-[#EAB308] flex items-center gap-2 text-[11px] font-black hover:scale-105 transition-all uppercase tracking-tighter"
                        >
                          Logic <ArrowUpRight size={14} />
                        </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
            
            {isLoading && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-14 h-14 bg-white/5 rounded-2xl border-2 border-white/5 flex items-center justify-center text-gray-700">
                   <Users size={30} />
                </div>
                <div className="flex-1 space-y-4 pt-2">
                   <div className="h-4 bg-white/5 rounded-full w-1/4"></div>
                   <div className="h-20 bg-white/5 rounded-[2rem] w-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT SYSTEM */}
          <div className="p-8 bg-black/40 border-t border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                placeholder={isListening ? "СЛУШАЮ..." : isLoading ? "ANALYTICS IN PROGRESS..." : `WHAT IS YOUR NEXT PLAY, ${user.title} ${user.name.toUpperCase()}?`}
                disabled={isLoading}
                className={`w-full bg-white/[0.03] border-2 border-white/10 focus:border-[#22c55e]/50 focus:bg-white/[0.08] focus:shadow-[0_0_40px_rgba(34,197,94,0.1)] outline-none rounded-3xl py-5 pl-16 pr-32 text-md text-white placeholder:text-gray-600 transition-all font-sans disabled:opacity-50 ${isListening ? "animate-pulse border-[#22c55e]" : ""}`}
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <Terminal size={20} className="text-gray-600 group-focus-within:text-[#22c55e] transition-colors" />
              </div>
              
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                 <button 
                    type="button"
                    onClick={startListening}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isListening ? "bg-red-500 text-white animate-bounce" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                 >
                    {isListening ? <Mic size={24} /> : <MicOff size={24} />}
                 </button>
                 <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-10 h-10 bg-[#22c55e]/10 text-[#22c55e] rounded-2xl flex items-center justify-center hover:bg-[#22c55e] hover:text-black transition-all disabled:hidden shadow-lg"
                 >
                    <ArrowUpRight size={24} />
                 </button>
              </div>
            </form>
            <div className="mt-4 flex justify-between text-[10px] text-gray-600 px-10 uppercase font-black tracking-[0.3em]">
              <span className="flex items-center gap-3">
                <Activity size={12} className="text-[#22c55e]" /> Deep_Logic: Active
              </span>
              <span className="flex items-center gap-3">
                <ShieldCheck size={12} className="text-[#EAB308]" /> Axe_Secured_VOICE_SYNC
              </span>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: HOT UPDATES */}
        <aside className="col-span-12 xl:col-span-3 space-y-6 lg:block hidden">
          <section className="glass-panel p-8 rounded-[2rem] bg-orange-500/[0.03]">
            <h2 className="text-[10px] text-orange-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em] font-black italic">
              <Zap size={18} fill="#f97316" /> Predator Intel
            </h2>
            <div className="space-y-8 relative">
              {[
                { time: "05M", text: "VITALIK BUTERIN MOVE DETECTED: 10,000 ETH TO COINBASE", c: "text-red-500" },
                { time: "1H", text: "US FED SWAP LINES INCREASED BY $12B", c: "text-[#22c55e]" },
                { time: "4H", text: "BLACKROCK SPOT BTC ETF INFLOW: $421M", c: "text-gray-300" },
              ].map((news, i) => (
                <div key={news.time} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="text-[10px] text-gray-500 mb-1 font-mono">{news.time} ago</div>
                  <div className={`text-[12px] leading-relaxed font-black uppercase tracking-tight ${news.c}`}>
                    {news.text}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-8 rounded-[2rem] bg-green-500/[0.03] group border-[#22c55e]/10">
            <h2 className="text-[10px] text-[#22c55e] mb-4 flex items-center gap-3 uppercase tracking-[0.4em] font-black">
              <BrainCircuit size={16} /> Strategy Anchor (WENDY)
            </h2>
            <p className="text-[12px] text-gray-400 leading-relaxed italic font-medium">
              "Держись своего плана. Твой переход от теории к действию — это и есть момент твоей победы. Я здесь, чтобы ты не сломался."
            </p>
            <div className="mt-6 flex justify-end">
               <span className="text-[10px] font-black text-[#22c55e]/40">W. RHOADES</span>
            </div>
          </section>
        </aside>
      </div>

      <footer className="mt-12 mb-6 max-w-[1800px] mx-auto flex flex-wrap justify-between items-center text-[10px] px-8 text-gray-600 tracking-[0.3em] font-black">
         <div className="flex gap-10 items-center">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></div>
               <span>PHASE_4: ALPHA_EXTRACTION</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            <span className="text-white">DCA_ENGINE: ACTIVE</span>
         </div>
         <div className="flex gap-10">
            <span className="hover:text-white transition-colors cursor-pointer">TERMINAL_DOCS</span>
            <span className="hover:text-white transition-colors cursor-pointer">SECURITY_COMPLIANCE</span>
            <span>© AXE_GLOBAL_2026</span>
         </div>
      </footer>
    </div>
  );
}
