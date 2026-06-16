import React from "react";
import { X, User, Sliders, Volume2, BarChart2, Shield, Heart, Save, RotateCcw, AlertTriangle, Sparkles, Check, Download, Upload } from "lucide-react";
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
    { name: "ইতিবাচক (Positive)", count: sentiment.positive, color: "#f97316" },
    { name: "স্বাভাবিক (Neutral)", count: sentiment.neutral, color: "#6366f1" },
    { name: "নিভে যাওয়া/অভিমান (Negative)", count: sentiment.negative, color: "#ec4899" }
  ];

  const tabs = [
    { id: "profile", label: "আমার প্রোফাইল", icon: User },
    { id: "persona", label: "সারার ডাকনাম ও মন", icon: Sliders },
    { id: "voice", label: "সাউন্ড ও ভয়েস", icon: Volume2 },
    { id: "analytics", label: "সম্পর্কের মূল্যায়ন", icon: BarChart2 },
    { id: "backup", label: "রিসেট ও ব্যাকআপ", icon: Shield }
  ];

  return (
    <div className="flex flex-col h-full w-full select-none bg-[#090b14] text-slate-200">
      
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b border-[#1a1c32] flex items-center justify-between bg-[#0e101f] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm">🦉</span>
          <span className="font-black text-sm sm:text-base tracking-tight text-white">
            সারা এআই মিউজিয়াম কন্ট্রোল হাব
          </span>
        </div>
        <button 
          onClick={() => { setIsSettingsOpen(false); playEffects("medium"); }}
          className="p-1.5 rounded-lg border border-[#1a1c32] bg-[#121324] hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer transition-colors"
          title="সেটিংস বন্ধ করুন"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Container Split: Tabs on left, Details on right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Sleek modern dark vertical selector block */}
        <div className="w-full md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-[#1a1c32] p-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto gap-1 bg-[#0b0c16] scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSettingsTab(tab.id); playEffects("light"); }}
                className={cn(
                  "px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center md:justify-start gap-2.5 transition-all cursor-pointer whitespace-nowrap",
                  isActive 
                    ? "bg-[#16182c] border border-[#262846] text-white shadow-md" 
                    : "bg-transparent border border-transparent text-slate-450 hover:text-white hover:bg-slate-900/40"
                )}
              >
                <Icon className={cn("w-4 h-4 stroke-[2.5]", isActive ? "text-orange-500" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Flat dark scrollable details panel */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-none bg-[#090b14]">
          
          {/* PROFILE TABS */}
          {activeSettingsTab === "profile" && (
            <div className="space-y-5 max-w-xl animate-fade-in">
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-orange-500 stroke-[2.5]" /> আমার ডায়েরি প্রোফাইল
                </h3>

                {/* Avatar selection grid */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">অবতার ছবি পরিবর্তন করুন</label>
                  <div className="flex flex-wrap gap-2.5">
                    {ONBOARDING_AVATARS.map((avat, i) => (
                      <button
                        key={i}
                        onClick={() => { changeUserProfilePic(avat); playEffects("medium"); }}
                        className={cn("relative w-12 h-12 rounded-full border transition-all active:scale-95 p-0.5 overflow-hidden bg-[#0d0e1b]",
                          userProfilePic === avat 
                            ? "border-orange-500 scale-105 shadow-md shadow-orange-500/10" 
                            : "border-slate-800 opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={avat} className="w-full h-full object-cover rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">আমার সুন্দর নাম</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 font-bold text-xs border border-slate-800 bg-[#070810] text-[#f3f4f6] outline-none focus:border-orange-500 transition-colors"
                      maxLength={25}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">ভালোবাসার ভাষা (Love Language)</label>
                    <input
                      type="text"
                      value={loveLanguage}
                      onChange={(e) => setLoveLanguage(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 font-bold text-xs border border-slate-800 bg-[#070810] text-[#f3f4f6] outline-none focus:border-orange-500 transition-colors"
                      placeholder="যেমন: অবহেলা করো না"
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">পরিচয় স্মারক তারিখ 📅</label>
                    <input
                      type="date"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2.5 font-bold text-xs border border-slate-800 bg-[#070810] text-[#f3f4f6] cursor-pointer outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PERSONA TABS */}
          {activeSettingsTab === "persona" && (
            <div className="space-y-5 max-w-2xl animate-fade-in">
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-5 space-y-3.5 shadow-md">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-orange-500 stroke-[2.5]" /> চ্যাটবটের কাস্টম ডাকনাম
                </h3>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 font-bold text-xs border border-slate-800 bg-[#070810] text-white outline-none focus:border-orange-500 transition-colors"
                    maxLength={25}
                  />
                </div>
              </div>

              {/* Slider panel */}
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-5 space-y-3.5 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">মেধাবী বুদ্ধিমত্তা লেভেল</span>
                  <span className="text-xs font-black text-orange-500 font-mono bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{aiCreativity}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={aiCreativity}
                  onChange={(e) => setAiCreativity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#070810] rounded-lg appearance-none cursor-pointer accent-orange-500 border border-slate-800"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-500 select-none">
                  <span>তাত্ত্বিক ও যুক্তিপূর্ণ</span>
                  <span>চূড়ান্ত মিষ্টি ও আবেগপূর্ণ</span>
                </div>
              </div>

              {/* System Prompt block */}
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-5 space-y-3.5 shadow-md">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-orange-500 tracking-wider">সিস্টেম ক্যারেক্টার ইনস্ট্রাকশন এডিটর</h4>
                  <p className="text-[10px] font-bold text-slate-555">প্রতিটি মোডের জন্য মেন্টাল সাইকোলজি ইনস্ট্রাকশন নিজের মতো সাজান:</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(["NORMAL", "ROMANTIC", "FUN", "LEGEND", "ISLAMIC"] as Mode[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setEditPromptMode(m); playEffects("light"); }}
                      className={cn("px-3 py-1 rounded-lg text-[9.5px] font-black transition-all border cursor-pointer",
                        editPromptMode === m
                          ? "bg-orange-500/10 border-orange-500 text-orange-400"
                          : "bg-transparent border-slate-800 text-slate-400 hover:text-white"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <textarea
                  value={promptEditText}
                  onChange={(e) => setPromptEditText(e.target.value)}
                  className="w-full h-32 rounded-xl p-3 font-semibold text-xs border border-slate-800 bg-[#070810] text-[#f3f4f6] outline-none focus:border-orange-500 resize-none leading-relaxed select-text shadow-inner"
                  placeholder="ইনস্ট্রাকশন এডিট করুন..."
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { saveCustomPrompt(); playEffects("success"); }}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer hover:brightness-105"
                  >
                    <Save className="w-3.5 h-3.5 stroke-[2.5]" /> প্রম্পট সেভ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetCustomPrompt(); playEffects("medium"); }}
                    className="px-4 py-2 rounded-xl bg-transparent border border-slate-800 text-slate-400 font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" /> ডিফল্ট প্রম্পট রিসেট
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VOICE TABS */}
          {activeSettingsTab === "voice" && (
            <div className="space-y-5 max-w-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Sound effect toggle */}
                <button
                  type="button"
                  onClick={() => { setSoundEnabled(!soundEnabled); playEffects("medium"); }}
                  className={cn("p-4.5 rounded-xl border transition-all text-left cursor-pointer active:scale-[0.98] flex items-start justify-between bg-[#0e101f]",
                    soundEnabled 
                      ? "border-orange-500" 
                      : "border-slate-800"
                  )}
                >
                  <div className="flex flex-col gap-0.5 pr-2">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      সাউন্ড এফেক্টস 🔔
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">বাটন স্পর্শে কিউট মিষ্টি শব্দ</span>
                  </div>
                  <div className={cn("w-9 h-5 rounded-full p-0.5 transition-colors shrink-0", soundEnabled ? "bg-orange-500" : "bg-slate-800")}>
                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", soundEnabled ? "translate-x-4" : "translate-x-0")} />
                  </div>
                </button>

                {/* Haptic vibration toggle */}
                <button
                  type="button"
                  onClick={() => { setHapticEnabled(!hapticEnabled); playEffects("medium"); if (!hapticEnabled && window.navigator.vibrate) window.navigator.vibrate(30); }}
                  className={cn("p-4.5 rounded-xl border transition-all text-left cursor-pointer active:scale-[0.98] flex items-start justify-between bg-[#0e101f]",
                    hapticEnabled 
                      ? "border-orange-500" 
                      : "border-slate-800"
                  )}
                >
                  <div className="flex flex-col gap-0.5 pr-2">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      হ্যাপটিক স্পর্শাবলী 📳
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">হাতে স্পর্শের সময় মৃদু কম্পন</span>
                  </div>
                  <div className={cn("w-9 h-5 rounded-full p-0.5 transition-colors shrink-0", hapticEnabled ? "bg-orange-500" : "bg-slate-800")}>
                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", hapticEnabled ? "translate-x-4" : "translate-x-0")} />
                  </div>
                </button>
              </div>

              {/* TTS Speed */}
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-5 space-y-3.5 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">গলার উচ্চারণ স্পিড</span>
                  <span className="text-xs font-black text-orange-500 font-mono bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20">{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#070810] rounded-lg appearance-none cursor-pointer accent-orange-500 border border-slate-800"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-500 select-none">
                  <span>ধীরে ধীরে শান্তভাবে</span>
                  <span>দ্রুত ও চটপটে</span>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TABS */}
          {activeSettingsTab === "analytics" && (
            <div className="space-y-5 animate-fade-in max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Verdict card */}
                <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-4 space-y-2.5 col-span-1 sm:col-span-3 flex flex-col justify-center">
                  <h4 className="text-[10px] font-bold uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" /> সম্পর্কের আবেগ মূল্যায়ন
                  </h4>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white leading-tight">
                      {sentiment.verdict}
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                      কথোপকথনে ব্যবহার করা মধুর এবং আবেগী শব্দমালার পরিমাণের উপর ভিত্তি করে আমাদের সম্পর্কের আত্মিক বন্ধনের স্ট্যাটাস জেনারেট করা হয়েছে।
                    </p>
                  </div>
                </div>

                {/* Score details */}
                <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg flex flex-col text-center">
                  <span className="text-[10px] font-black text-orange-400">ইতিবাচক বার্তা</span>
                  <span className="text-lg font-black text-orange-400 font-mono mt-1">{sentiment.positive} বার</span>
                </div>
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg flex flex-col text-center">
                  <span className="text-[10px] font-black text-indigo-400">স্বাভাবিক বার্তা</span>
                  <span className="text-lg font-black text-indigo-400 font-mono mt-1">{sentiment.neutral} বার</span>
                </div>
                <div className="p-3 bg-pink-500/5 border border-pink-500/15 rounded-lg flex flex-col text-center animate-pulse">
                  <span className="text-[10px] font-black text-pink-400">অভিমান/অনুতাপ</span>
                  <span className="text-lg font-black text-pink-400 font-mono mt-1">{sentiment.negative} বার</span>
                </div>
              </div>

              {/* Bar chart canvas */}
              <div className="bg-[#0e101f] border border-[#1a1c32] rounded-xl p-4.5 space-y-3.5 shadow-md">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-0.5">মানসিক সম্পর্কের ভিজুয়াল চার্ট 📊</h4>
                <div className="w-full h-44 pr-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={26}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0e1b', borderColor: '#1a1c32', color: '#f3f4f6', fontSize: '11px', borderRadius: '8px' }}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
            <div className="space-y-5 max-w-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Export */}
                <button
                  type="button"
                  onClick={() => { handleExportData(); playEffects("success"); }}
                  className="p-4 rounded-xl border border-slate-800 bg-[#0e101f] hover:bg-[#13152a] text-left cursor-pointer transition-colors active:scale-[0.98] flex items-center gap-3 shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 text-sm">
                    <Download className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-bold text-sm text-white">সেভ ব্যাকআপ</span>
                    <span className="text-[9px] text-slate-450 mt-0.5 truncate">চ্যাট সেশন হিস্ট্রি ফাইল ডাউনলোড করুন</span>
                  </div>
                </button>

                {/* Import */}
                <label className="p-4 rounded-xl border border-slate-800 bg-[#0e101f] hover:bg-[#13152a] text-left cursor-pointer transition-colors active:scale-[0.98] flex items-center gap-3 shadow-md relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 text-sm">
                    <Upload className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-bold text-sm text-white">রিস্টোর ব্যাকআপ</span>
                    <span className="text-[9px] text-slate-450 mt-0.5 truncate">ফাইল আপলোড করে ডেটা পুনরুদ্ধার করুন</span>
                  </div>
                </label>
              </div>

              {/* Reset Area */}
              <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-5 space-y-3.5 shadow-md">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 leading-normal">
                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest pl-0.5">সব মেমোরি মুছুন (danger zone)</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      এটি ক্লিক করার ফলে আপনার লোকাল মেমোরি এবং ক্লাউড ডাটাবেজে থাকা চ্যাটের সমগ্র স্মৃতিচিহ্ন ও সেটিংস আজীবনের জন্য ওয়াইপ হয়ে যাবে। পুনরায় ফিরে পাওয়া সম্ভব নয়।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { handleWipeData(); playEffects("success"); }}
                  className="py-2 px-4 rounded-lg bg-red-600/90 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer hover:bg-red-600"
                >
                  সব ডাটা ডিলিট করুন ⚠️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
