import React from "react";
import { X, User, Sliders, Volume2, BarChart2, Shield, Heart, Save, RotateCcw, AlertTriangle, CheckSquare, Sparkles } from "lucide-react";
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Mode } from "../types";
import { cn } from "../lib/utils";

interface SettingsPanelProps {
  theme: "light" | "dark";
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string) => void;
  setIsSettingsOpen: (b: boolean) => void;
  
  // Profile tab bindings
  userName: string;
  setUserName: (s: string) => void;
  loveLanguage: string;
  setLoveLanguage: (s: string) => void;
  anniversaryDate: string;
  setAnniversaryDate: (s: string) => void;
  userProfilePic: string | null;
  changeUserProfilePic: (s: string) => void;
  ONBOARDING_AVATARS: string[];
  
  // Chatbot settings tab bindings
  botName: string;
  setBotName: (s: string) => void;
  aiCreativity: number;
  setAiCreativity: (n: number) => void;
  customSysPrompts: Record<Mode, string>;
  editPromptMode: Mode;
  setEditPromptMode: (m: Mode) => void;
  promptEditText: string;
  setPromptEditText: (s: string) => void;
  saveCustomPrompt: () => void;
  resetCustomPrompt: () => void;
  
  // Sound/Voice tab bindings
  soundEnabled: boolean;
  setSoundEnabled: (b: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (b: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (n: number) => void;
  
  // Backup tab bindings
  handleExportData: () => void;
  handleImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWipeData: () => void;
  
  // Analytics calculations
  analyzeSentiment: () => { positive: number; neutral: number; negative: number; verdict: string };
  playEffects: (type: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  theme,
  activeSettingsTab,
  setActiveSettingsTab,
  setIsSettingsOpen,
  userName,
  setUserName,
  loveLanguage,
  setLoveLanguage,
  anniversaryDate,
  setAnniversaryDate,
  userProfilePic,
  changeUserProfilePic,
  ONBOARDING_AVATARS,
  botName,
  setBotName,
  aiCreativity,
  setAiCreativity,
  customSysPrompts,
  editPromptMode,
  setEditPromptMode,
  promptEditText,
  setPromptEditText,
  saveCustomPrompt,
  resetCustomPrompt,
  soundEnabled,
  setSoundEnabled,
  hapticEnabled,
  setHapticEnabled,
  voiceSpeed,
  setVoiceSpeed,
  handleExportData,
  handleImportData,
  handleWipeData,
  analyzeSentiment,
  playEffects
}) => {
  const sentiment = analyzeSentiment();
  
  const chartData = [
    { name: "ইতিবাচক (Positive)", count: sentiment.positive, color: "#58cc02" },
    { name: "স্বাভাবিক (Neutral)", count: sentiment.neutral, color: "#1cb0f6" },
    { name: "নেতিবাচক (Negative)", count: sentiment.negative, color: "#ff4b4b" }
  ];

  const tabs = [
    { id: "profile", label: "আমার প্রোফাইল", icon: User, color: "text-[#1cb0f6]" },
    { id: "persona", label: "সারার কাস্টম ব্যক্তিত্ব", icon: Sliders, color: "text-[#ff9600]" },
    { id: "voice", label: "সাউন্ড ও স্পিড", icon: Volume2, color: "text-[#58cc02]" },
    { id: "analytics", label: "সম্পর্কের অগ্রগতি", icon: BarChart2, color: "text-[#ff4b4b]" },
    { id: "backup", label: "রিসেট ও ব্যাকআপ", icon: Shield, color: "text-[#84d8ff]" }
  ];

  return (
    <div className={cn("flex flex-col h-full w-full select-none animate-fade-in bg-[#fff7f8] dark:bg-[#0b0c16] text-slate-800 dark:text-[#afc2cb]")}>
      
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b-2 border-pink-100/40 dark:border-[#1e2030] flex items-center justify-between bg-gradient-to-r from-pink-50/40 to-rose-50/45 dark:from-[#141624] dark:to-[#121422] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🦉</span>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            সারা এআই সেটিংস সেন্টার
          </span>
        </div>
        <button 
          onClick={() => { setIsSettingsOpen(false); playEffects("medium"); }}
          className="p-2 rounded-xl transition-all active:scale-90 border-2 border-pink-100/45 dark:border-[#1e2030] bg-white dark:bg-[#0e0f17] text-slate-500 dark:text-[#afc2cb] hover:bg-pink-50/20 dark:hover:bg-[#202f36] cursor-pointer"
          title="সেটিংস বন্ধ করুন"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Main Container Split: Tabs list on left, Details panel on right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Duolingo vertical button block */}
        <div className="w-full md:w-[240px] shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-pink-100/40 dark:border-[#1e2030] p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto gap-2 bg-[#fffcfc] dark:bg-[#101220]/40 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;
            
            // Dynamic theme selection based on tab id
            let activeStyle = "";
            if (tab.id === "profile") activeStyle = "bg-[#1cb0f6] border-[#1899d6] text-white";
            else if (tab.id === "persona") activeStyle = "bg-[#ff9600] border-[#e07a00] text-white";
            else if (tab.id === "voice") activeStyle = "bg-[#58cc02] border-[#46a302] text-white";
            else if (tab.id === "analytics") activeStyle = "bg-[#ff4b4b] border-[#ea2b2b] text-white";
            else activeStyle = "bg-purple-500 border-purple-700 text-white";

            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSettingsTab(tab.id); playEffects("light"); }}
                className={cn(
                  "px-4 py-3 rounded-[18px] text-[13px] font-black flex items-center justify-center md:justify-start gap-2.5 transition-all duration-100 border-2 border-b-[5px] cursor-pointer whitespace-nowrap active:border-b-2 active:translate-y-[2px]",
                  isActive 
                    ? activeStyle 
                    : "bg-[#fffcfc] dark:bg-[#0e0f17] border-pink-100/40 dark:border-[#1e2030] text-slate-700 dark:text-[#afc2cb] hover:bg-pink-50/10 dark:hover:bg-[#1a1b2d]"
                )}
              >
                <Icon className="w-4 h-4 stroke-[3]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Scrollable detail page */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-none bg-[#fff7f8] dark:bg-[#0b0c16]">
          
          {/* PROFILE TABS */}
          {activeSettingsTab === "profile" && (
            <div className="space-y-6 max-w-xl animate-fade-in">
              <div className="bg-[#fffcfc] dark:bg-[#0e0f17] border-2 border-b-8 border-pink-100/40 dark:border-[#1e2030] rounded-[24px] p-5 sm:p-6 space-y-5">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1cb0f6] stroke-[3]" /> আমার প্রোফাইল অবয়ব
                </h3>

                {/* Onboarding Avatars selection grid */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-wider pl-1">ছবি নির্বাচন করুন</span>
                  <div className="flex flex-wrap gap-3 p-1">
                    {ONBOARDING_AVATARS.map((avat, i) => (
                      <button
                        key={i}
                        onClick={() => { changeUserProfilePic(avat); playEffects("medium"); }}
                        className={cn("relative w-14 h-14 rounded-full border-4 transition-transform active:scale-95 p-0.5 overflow-hidden shadow-sm bg-[#fdfafb]",
                          userProfilePic === avat ? "border-[#1cb0f6] scale-105" : "border-slate-100 dark:border-[#37464f] opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={avat} className="w-full h-full object-cover rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-widest pl-1">আমার সুন্দর নাম</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-2xl px-4 py-3 font-extrabold text-xs border-2 border-pink-100/30 dark:border-[#1e2030] bg-[#fdfafb] dark:bg-[#080911] text-slate-900 dark:text-white outline-none focus:border-[#1cb0f6] transition-colors"
                      maxLength={25}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-widest pl-1">ভালোবাসার ভাষা (Love Language)</label>
                    <input
                      type="text"
                      value={loveLanguage}
                      onChange={(e) => setLoveLanguage(e.target.value)}
                      className="w-full rounded-2xl px-4 py-3 font-extrabold text-xs border-2 border-pink-100/30 dark:border-[#1e2030] bg-[#fdfafb] dark:bg-[#080911] text-slate-900 dark:text-white outline-none focus:border-[#1cb0f6] transition-colors"
                      placeholder="যেমন: অবহেলা করো না ইত্যাদি"
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-widest pl-1">আমাদের প্রথম পরিচয়ের স্মারক তারিখ 📅</label>
                    <input
                      type="date"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      className="w-full rounded-2xl px-4 py-3 font-extrabold text-xs border-2 border-pink-100/30 dark:border-[#1e2030] bg-[#fdfafb] dark:bg-[#080911] text-slate-900 dark:text-white cursor-pointer outline-none focus:border-[#1cb0f6] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PERSONA TABS */}
          {activeSettingsTab === "persona" && (
            <div className="space-y-6 max-w-2xl animate-fade-in">
              <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 sm:p-6 space-y-5">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#ff9600] stroke-[3]" /> সারার কাস্টম ডাকনাম
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 font-extrabold text-xs border-2 border-slate-200 dark:border-[#37464f] bg-slate-50 dark:bg-[#131f24] text-slate-900 dark:text-white outline-none focus:border-[#ff9600] transition-colors"
                    maxLength={25}
                  />
                </div>
              </div>

              {/* Slider panel */}
              <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-wider">সারার বুদ্ধিমত্তা ও আবেগ লেভেল</span>
                  <span className="text-sm font-black text-[#ff9600] font-mono">{aiCreativity}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={aiCreativity}
                  onChange={(e) => setAiCreativity(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 dark:bg-[#131f24] rounded-lg appearance-none cursor-pointer accent-[#ff9600] border-2 border-slate-200 dark:border-[#37464f]"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 select-none leading-relaxed">
                  <span>ঠান্ডা ও যৌক্তিক (Low Temp)</span>
                  <span>চূড়ান্ত আবেগী ও মিষ্টি সোনা (High Temp)</span>
                </div>
              </div>

              {/* Prompt Personality Block */}
              <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-[#ff9600] tracking-wider">সিস্টেম প্রম্পট মেকার হাব</h4>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#afc2cb]/60 leading-normal">সারার ভেতরের মনস্তাত্ত্বিক ক্যারেক্টার ইনস্ট্রাকশন নির্দিষ্ট মোড অনুযায়ী এডিট করুন:</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1.5">
                  {(["NORMAL", "ROMANTIC", "FUN", "LEGEND", "ISLAMIC"] as Mode[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setEditPromptMode(m); playEffects("light"); }}
                      className={cn("px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all border-2 border-b-[4px] cursor-pointer active:border-b-2 active:translate-y-[2px]",
                        editPromptMode === m
                          ? "bg-[#ff9600]/10 border-[#ff9600] text-[#ff9600]"
                          : "bg-white dark:bg-[#131f24] border-slate-200 dark:border-[#37464f] text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {m} Mode
                    </button>
                  ))}
                </div>

                <textarea
                  value={promptEditText}
                  onChange={(e) => setPromptEditText(e.target.value)}
                  className="w-full h-36 rounded-2xl p-4 font-bold text-xs border-2 border-slate-200 dark:border-[#37464f] bg-slate-50 dark:bg-[#131f24] text-slate-800 dark:text-white outline-none focus:border-[#ff9600] resize-none leading-relaxed select-text shadow-inner"
                  placeholder="ইনস্ট্রাকশন এডিট করুন..."
                />

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { saveCustomPrompt(); playEffects("success"); }}
                    className="px-5 py-3 rounded-2xl bg-[#ff9600] border-2 border-b-[5px] border-[#e07a00] hover:bg-[#ffaa1a] text-white font-black text-xs transition-all active:border-b-2 active:translate-y-[2px] flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4 stroke-[3]" /> ইনস্ট্রাকশন সেভ করো
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetCustomPrompt(); playEffects("medium"); }}
                    className="px-5 py-3 rounded-2xl bg-white dark:bg-[#1a2d34] border-2 border-b-[5px] border-slate-200 dark:border-[#37464f] text-slate-500 dark:text-[#afc2cb] font-black text-xs transition-all active:border-b-2 active:translate-y-[2px] flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[3]" /> ডিফল্ট প্রম্পট রিসেট
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VOICE TABS */}
          {activeSettingsTab === "voice" && (
            <div className="space-y-6 max-w-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sound toggle tile */}
                <button
                  type="button"
                  onClick={() => { setSoundEnabled(!soundEnabled); playEffects("medium"); }}
                  className={cn("p-5 rounded-[24px] border-2 border-b-[6px] transition-all text-left cursor-pointer active:border-b-2 active:translate-y-[2px] flex items-start justify-between bg-white dark:bg-[#1a2d34]",
                    soundEnabled 
                      ? "border-[#58cc02]" 
                      : "border-slate-200 dark:border-[#37464f]"
                  )}
                >
                  <div className="flex flex-col gap-1 pr-3">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      সাউন্ড এফেক্টস 🔔
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-semibold leading-relaxed">বাটন ক্লিকের কিউট শব্দ চালু করুন</span>
                  </div>
                  <div className={cn("w-10 h-5.5 rounded-full p-0.5 transition-colors shrink-0", soundEnabled ? "bg-[#58cc02]" : "bg-slate-300 dark:bg-slate-800")}>
                    <div className={cn("w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs", soundEnabled ? "translate-x-4.5" : "translate-x-0")} />
                  </div>
                </button>

                {/* Haptic toggle tile */}
                <button
                  type="button"
                  onClick={() => { setHapticEnabled(!hapticEnabled); playEffects("medium"); if (!hapticEnabled && window.navigator.vibrate) window.navigator.vibrate(30); }}
                  className={cn("p-5 rounded-[24px] border-2 border-b-[6px] transition-all text-left cursor-pointer active:border-b-2 active:translate-y-[2px] flex items-start justify-between bg-white dark:bg-[#1a2d34]",
                    hapticEnabled 
                      ? "border-[#58cc02]" 
                      : "border-slate-200 dark:border-[#37464f]"
                  )}
                >
                  <div className="flex flex-col gap-1 pr-3">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      হ্যাপটিক ভাইব্রেশন 📳
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-semibold leading-relaxed">মেসেজ ও স্পর্শে কিউট ভাইব্রেশন</span>
                  </div>
                  <div className={cn("w-10 h-5.5 rounded-full p-0.5 transition-colors shrink-0", hapticEnabled ? "bg-[#58cc02]" : "bg-slate-300 dark:bg-slate-800")}>
                    <div className={cn("w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs", hapticEnabled ? "translate-x-4.5" : "translate-x-0")} />
                  </div>
                </button>
              </div>

              {/* TTS Speech Synthesis speed slider */}
              <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 dark:text-[#afc2cb]/70 uppercase tracking-wider">সারার কথা বলার গতি (Speak rate speed)</span>
                  <span className="text-sm font-black text-[#58cc02] font-mono">{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 dark:bg-[#131f24] rounded-lg appearance-none cursor-pointer accent-[#58cc02] border-2 border-slate-200 dark:border-[#37464f]"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 select-none leading-relaxed">
                  <span>ধীরে ধীরে শান্তভাবে কথা বলা</span>
                  <span>ভীষণ দ্রুত কথা বলা</span>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TABS */}
          {activeSettingsTab === "analytics" && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Verdict summary bento card */}
                <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 space-y-3.5 flex flex-col justify-center">
                  <h4 className="text-xs font-black uppercase text-[#ff4b4b] tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> আবেগ মূল্যায়ন স্ট্যাটাস
                  </h4>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {sentiment.verdict}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-bold leading-relaxed pt-1">
                      সারার সাথে আপনার দৈনন্দিন আলাপচারিতার শব্দ চয়নের ভিত্তিতে আমরা আপনার মানসিক সম্পর্কের গভীরতা বিশ্লেষণ করেছি।
                    </p>
                  </div>
                </div>

                {/* Score boxes */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-[#58cc02]/10 border-2 border-[#58cc02]/20 rounded-2xl flex flex-col justify-center text-center">
                    <span className="text-[14px] font-black text-[#58cc02]">ইতিবাচক 🟢</span>
                    <span className="text-base font-black text-[#58cc02] font-mono mt-1">{sentiment.positive}</span>
                    <span className="text-[8px] font-black text-slate-400">বার্তাদেব</span>
                  </div>
                  <div className="p-3 bg-[#1cb0f6]/10 border-2 border-[#1cb0f6]/20 rounded-2xl flex flex-col justify-center text-center">
                    <span className="text-[14px] font-black text-[#1cb0f6]">স্বাভাবিক ⚙️</span>
                    <span className="text-base font-black text-[#1cb0f6] font-mono mt-1">{sentiment.neutral}</span>
                    <span className="text-[8px] font-black text-slate-400">বার্তাদেব</span>
                  </div>
                  <div className="p-3 bg-[#ff4b4b]/10 border-2 border-[#ff4b4b]/20 rounded-2xl flex flex-col justify-center text-center animate-pulse">
                    <span className="text-[14px] font-black text-[#ff4b4b]">অহংকার 💖</span>
                    <span className="text-base font-black text-[#ff4b4b] font-mono mt-1">{sentiment.negative}</span>
                    <span className="text-[8px] font-black text-slate-400 font-extrabold">বার্তাদেব</span>
                  </div>
                </div>
              </div>

              {/* Bar chart canvas */}
              <div className="bg-white dark:bg-[#1a2d34] border-2 border-b-8 border-slate-200 dark:border-[#37464f] rounded-[24px] p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">মানসিক সম্পর্কের বার গ্রাফ চার্ট 📊</h4>
                <div className="w-full h-48 pr-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={28}>
                      <Tooltip cursor={{ fill: 'rgba(156, 163, 175, 0.05)' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* BACKUP TABS */}
          {activeSettingsTab === "backup" && (
            <div className="space-y-6 max-w-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Export Card */}
                <button
                  type="button"
                  onClick={() => { handleExportData(); playEffects("success"); }}
                  className="p-5 rounded-[24px] border-2 border-b-[6px] border-slate-200 dark:border-[#37464f] bg-white dark:bg-[#1a2d34] hover:bg-slate-50 transition-all text-left cursor-pointer active:border-b-2 active:translate-y-[2px] flex items-center gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center text-[#ff9600] shrink-0 font-black text-base">📤</div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">ব্যাকআপ সংরক্ষণ</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-bold mt-1 leading-normal">সব ফাইল চ্যাট ডায়েরি ডাউনলোড করুন</span>
                  </div>
                </button>

                {/* Import Card */}
                <label className="p-5 rounded-[24px] border-2 border-b-[6px] border-slate-200 dark:border-[#37464f] bg-white dark:bg-[#1a2d34] hover:bg-slate-50 transition-all text-left cursor-pointer active:border-b-2 active:translate-y-[2px] flex items-center gap-4 shadow-sm relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950/20 flex items-center justify-center text-[#58cc02] shrink-0 font-black text-base">📥</div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">চ্যাট পুনরুদ্ধার</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-bold mt-1 leading-normal">ফাইল থেকে সেশন রিস্টোর করুন</span>
                  </div>
                </label>
              </div>

              {/* Destructive reset area */}
              <div className="bg-red-50 border-2 border-red-200 dark:border-[#ea2b2b]/30 dark:bg-[#ea2b2b]/5 rounded-[24px] p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 leading-normal">
                    <h4 className="text-xs font-black text-rose-600 dark:text-rose-450 uppercase tracking-wide">সতর্কতামূলক বিপদের মাত্রা</h4>
                    <p className="text-[10px] text-slate-500 dark:text-[#afc2cb]/70 font-bold leading-relaxed">
                      বাটনটিতে ক্লিক করার মাধ্যমে আপনার ফোনের মেমোরিতে থাকা সারা এআই-এর সমস্ত ডায়রি চ্যাট হিস্ট্রি আজীবনের জন্য মুছে যাবে। পুনরায় ফিরে পাওয়া সম্ভব নয়।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { handleWipeData(); playEffects("success"); }}
                  className="py-3 px-5 rounded-2xl bg-red-600 border-2 border-b-[5px] border-red-800 text-white font-black text-xs transition-all active:border-b-2 active:translate-y-[2px] cursor-pointer"
                >
                  সব মেমোরি মুছে ফেলুন ও ডায়েরি রিসেট করুন ⚠️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
