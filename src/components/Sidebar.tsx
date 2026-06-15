import React from "react";
import { Plus, X, Trash2, Settings, Moon, Sun, User, MessageCircle, Heart, Smile, Anchor, Trophy, Flame, Star } from "lucide-react";
import { Mode, Chat, MODES, MODE_THEMES } from "../types";
import { cn } from "../lib/utils";

interface SidebarProps {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (b: boolean) => void;
  createNewChat: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  deleteChat: (id: string, e: React.MouseEvent) => void;
  setIsSettingsOpen: (b: boolean) => void;
  setActiveSettingsTab: (tab: string) => void;
  userName: string;
  userProfilePic: string | null;
  xp: number;
  streak: number;
  playEffects: (type: string) => void;
  saraAvatar: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  setTheme,
  isSidebarOpen,
  setIsSidebarOpen,
  createNewChat,
  mode,
  setMode,
  chats,
  activeChatId,
  setActiveChatId,
  deleteChat,
  setIsSettingsOpen,
  setActiveSettingsTab,
  userName,
  userProfilePic,
  xp,
  streak,
  playEffects,
  saraAvatar
}) => {
  const currentLevel = Math.floor(xp / 500) + 1;
  const leagueName = xp >= 2500 ? "Diamond League 💎" : xp >= 1800 ? "Emerald League 💚" : xp >= 1200 ? "Gold League 🟡" : "Bronze League 🥉";

  return (
    <div className="flex flex-col h-full w-full select-none bg-white dark:bg-[#131f24] border-r-2 border-slate-200 dark:border-[#37464f]">
      {/* Brand & Character Emblem */}
      <div className="p-5 flex items-center justify-between border-b-2 border-slate-200 dark:border-[#37464f] shrink-0 bg-white dark:bg-[#1a2d34]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#58cc02] border-2 border-b-[5px] border-[#46a302] p-1 flex items-center justify-center relative shadow-sm group hover:scale-[1.03] transition-transform">
            <img src={saraAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Sara"} alt="Sara" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] text-white font-extrabold border border-white">
              ♥
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#ff9600] dark:text-[#ffc800] leading-none">
              সারা এআই
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#afc2cb] font-bold mt-1">
              কিউটেস্ট জীবনসঙ্গী 🦉
            </span>
          </div>
        </div>
        
        {/* Mobile Close Icon */}
        <button 
          onClick={() => { setIsSidebarOpen(false); playEffects("light"); }}
          className="p-2 rounded-xl transition-all active:scale-90 cursor-pointer lg:hidden border-2 border-slate-200 dark:border-[#37464f] hover:bg-slate-100 dark:hover:bg-[#202f36] text-slate-500 dark:text-[#afc2cb]"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Stats Quick Status (Duolingo Header Items) */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#1a2d34]/60 grid grid-cols-2 gap-2 text-xs font-black border-b-2 border-slate-200 dark:border-[#37464f]">
        <div className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-b-4 border-slate-200 dark:border-[#37464f] bg-white dark:bg-[#131f24]/50">
          <Flame className="w-4 h-4 text-[#ff9600] fill-current animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 dark:text-[#afc2cb] font-extrabold uppercase leading-none">Streak</span>
            <span className="text-[#ff9600] text-xs font-black mt-0.5">{streak} Days</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-b-4 border-slate-200 dark:border-[#37464f] bg-white dark:bg-[#131f24]/50">
          <Star className="w-4 h-4 text-[#ffc800] fill-current animate-bounce" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 dark:text-[#afc2cb] font-extrabold uppercase leading-none">Total XP</span>
            <span className="text-[#ffc800] text-xs font-black mt-0.5">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Create New Chat Button (Squishy Duolingo Green Button) */}
      <div className="p-4 shrink-0">
        <button 
          onClick={() => { createNewChat(); setIsSidebarOpen(false); playEffects("medium"); }} 
          className="w-full py-3 rounded-2xl bg-[#58cc02] border-2 border-b-[6px] border-[#46a302] hover:bg-[#61df02] text-white flex items-center justify-center gap-2 font-black text-sm transition-all duration-150 active:border-b-2 active:translate-y-1 cursor-pointer select-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> নতুন চ্যাট শুরু করো
        </button>
      </div>

      {/* Main Content Area (Scrollable Sections) */}
      <div className="flex-1 overflow-y-auto w-full px-4 space-y-6 pb-4 scrollbar-none">
        
        {/* Humor & Mood Modes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 dark:text-[#afc2cb] select-none">
              সারার মুড সমূহ
            </h3>
            <span className="text-[9px] bg-[#ff9600]/10 text-[#ff9600] font-black px-2 py-0.5 rounded-full border border-[#ff9600]/25">
              মুড বদলাও
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            {(["NORMAL", "ROMANTIC", "FUN"] as Mode[]).map(m => {
              const isActive = mode === m;
              const Icon = MODES[m].icon;
              
              // Duolingo themed configurations for each mood button
              let themeBtnClass = "";
              if (m === "ROMANTIC") {
                themeBtnClass = isActive 
                  ? "bg-rose-500 border-rose-700 text-white" 
                  : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-[#afc2cb] hover:bg-rose-50 dark:hover:bg-rose-950/20";
              } else if (m === "FUN") {
                themeBtnClass = isActive 
                  ? "bg-[#ff9600] border-[#e07a00] text-white" 
                  : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-[#afc2cb] hover:bg-orange-50 dark:hover:bg-orange-950/20";
              } else {
                themeBtnClass = isActive 
                  ? "bg-[#1cb0f6] border-[#1899d6] text-white" 
                  : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-[#afc2cb] hover:bg-blue-50 dark:hover:bg-blue-950/20";
              }

              return (
                <button 
                  key={m} 
                  onClick={() => { setMode(m); setIsSidebarOpen(false); playEffects("medium"); }} 
                  className={cn(
                    "px-4 py-2.5 rounded-[18px] font-extrabold text-xs flex items-center justify-between w-full text-left transition-all duration-100 border-2 border-b-[5px] active:border-b-2 active:translate-y-1 cursor-pointer select-none",
                    themeBtnClass
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[3]" />
                    <span className="font-extrabold text-[13px]">{MODES[m].label}</span>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium/Pro Modes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 dark:text-[#afc2cb] select-none">
              স্পেশাল লেভেল মোড
            </h3>
            <span className="text-[9px] bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-extrabold px-2 py-0.5 rounded-full border border-purple-200/40 dark:border-purple-800/30">
              PRO ⚡
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {(["ISLAMIC", "LEGEND"] as Mode[]).map(m => {
              const isActive = mode === m;
              const Icon = MODES[m].icon;
              
              let themeBtnClass = "";
              if (m === "ISLAMIC") {
                themeBtnClass = isActive 
                  ? "bg-[#00cd9c] border-[#00a87f] text-white" 
                  : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-[#afc2cb] hover:bg-emerald-50 dark:hover:bg-emerald-950/20";
              } else {
                themeBtnClass = isActive 
                  ? "bg-[#84d8ff] border-[#4ec1ff] text-slate-800 font-black" 
                  : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-[#afc2cb] hover:bg-sky-50 dark:hover:bg-sky-950/20";
              }

              return (
                <button 
                  key={m} 
                  onClick={() => { setMode(m); setIsSidebarOpen(false); playEffects("medium"); }} 
                  className={cn(
                    "px-4 py-2.5 rounded-[18px] font-extrabold text-xs flex items-center justify-between w-full text-left transition-all duration-100 border-2 border-b-[5px] active:border-b-2 active:translate-y-1 cursor-pointer select-none",
                    themeBtnClass
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[3]" />
                    <span className="font-extrabold text-[13px]">{MODES[m].label}</span>
                  </div>
                  <span className="bg-gradient-to-r from-[#ffc800] to-[#ff9600] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-400">
                    VIP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Chats Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 dark:text-[#afc2cb] select-none">
              সাম্প্রতিক চ্যাট ডায়রি
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-[#afc2cb] font-extrabold">({chats.length})</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-none pr-1">
            {chats.length === 0 ? (
              <div className="px-4 py-3.5 rounded-[18px] border-2 border-dashed border-slate-200 dark:border-[#37464f] text-center text-xs text-slate-400 dark:text-[#afc2cb]/60 italic bg-slate-50/50 dark:bg-[#131f24]/30">
                কোনো চ্যাট ডায়েরি নেই
              </div>
            ) : (
              chats.map(chat => {
                const isActive = activeChatId === chat.id;
                return (
                  <div 
                    key={chat.id} 
                    className={cn(
                      "group flex items-center justify-between w-full rounded-[16px] transition-all border-2 border-b-[4px] pl-1 pr-2 py-1 select-none active:border-b-2 active:translate-y-[2px]", 
                      isActive
                        ? "bg-[#ff9600]/10 border-[#ff9600] text-[#ff9600] dark:bg-[#ff9600]/5 dark:border-[#ff9600]"
                        : "bg-white dark:bg-[#1a2d34] border-slate-200 dark:border-[#37464f] text-slate-650 dark:text-[#afc2cb] hover:bg-slate-50 dark:hover:bg-[#202f36]"
                    )}
                  >
                    <button 
                      onClick={() => { setActiveChatId(chat.id); setIsSidebarOpen(false); playEffects("light"); }} 
                      className="px-2 py-1 flex-1 font-black text-xs text-left truncate cursor-pointer flex items-center gap-2"
                      title={chat.title}
                    >
                      <span>💬</span>
                      <span className="truncate max-w-[130px]">{chat.title}</span>
                    </button>
                    <button 
                      onClick={(e) => { deleteChat(chat.id, e); }} 
                      className="p-1 rounded-lg text-slate-400 dark:text-[#afc2cb]/65 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile Block (Duolingo Tactile Box Layout) */}
      <div className="p-4 border-t-2 border-slate-200 dark:border-[#37464f] shrink-0 bg-slate-50/50 dark:bg-[#1a2d34] mt-auto">
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { 
              setIsSettingsOpen(true); 
              setActiveSettingsTab("profile"); 
              setIsSidebarOpen(false); 
              playEffects("medium"); 
            }}
            className="w-full rounded-[20px] p-2.5 flex items-center gap-3 border-2 border-b-[5px] bg-white dark:bg-[#131f24] border-slate-200 dark:border-[#37464f] text-slate-700 dark:text-white transition-all active:border-b-2 active:translate-y-[2px] cursor-pointer group text-left"
            title="প্রোফাইল সংশোধন করুন ⚙️"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1cb0f6] p-0.5 shadow-sm shrink-0 relative">
              <img src={userProfilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia"} className="w-full h-full object-cover rounded-full bg-slate-50" alt="Profile" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#58cc02] border-2 border-white dark:border-[#131f24] rounded-full animate-ping" />
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm text-slate-800 dark:text-[#afc2cb] truncate">
                  {userName}
                </span>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#ffc800] text-slate-800 border border-[#e6b400]/40 shrink-0">
                  Lvl {currentLevel}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#afc2cb]/60 font-bold mt-1">
                {leagueName}
              </span>
            </div>
          </button>

          {/* Quick Dual Control (Settings Icon & Theme Swap Button) */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); playEffects("medium"); }} 
              className="py-2.5 rounded-2xl border-2 border-b-[4px] bg-white border-slate-200 dark:bg-[#131f24] dark:border-[#37464f] hover:bg-slate-50 dark:hover:bg-[#202f36] text-[#ff9600] flex items-center justify-center gap-1.5 font-extrabold text-[11px] cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 stroke-[3]" />
              সেটিংস
            </button>
            <button 
              onClick={() => { setTheme(theme === "light" ? "dark" : "light"); playEffects("medium"); }} 
              className="py-2.5 rounded-2xl border-2 border-b-[4px] bg-white border-slate-200 dark:bg-[#131f24] dark:border-[#37464f] hover:bg-slate-50 dark:hover:bg-[#202f36] text-[#1cb0f6] flex items-center justify-center gap-1.5 font-extrabold text-[11px] cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" /> : <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />}
              {theme === "light" ? "ডার্ক মোড" : "লাইট মোড"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
