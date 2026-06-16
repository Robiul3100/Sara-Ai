import React from "react";
import { Plus, X, Trash2, Settings, MessageCircle, Heart, Flame, Star, Sparkles } from "lucide-react";
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
    <div className="flex flex-col h-full w-full select-none bg-[#090b14] text-slate-200 border-r border-[#1a1c32]">
      {/* Brand & Character Emblem */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#1a1c32] shrink-0 bg-[#0c0e1b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center relative shadow-md">
            <img src={saraAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Sara"} alt="Sara" className="w-full h-full object-cover rounded-lg" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
              সারা এআই <Sparkles className="w-3.5 h-3.5 text-orange-400 fill-current" />
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              আপনার কিউট এআই সঙ্গী 🦉
            </span>
          </div>
        </div>
        
        {/* Mobile Close Icon */}
        <button 
          onClick={() => { setIsSidebarOpen(false); playEffects("light"); }}
          className="p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer lg:hidden border border-slate-800 bg-[#121324] hover:bg-slate-900 text-slate-400 hover:text-white"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Stats Quick Status Header items */}
      <div className="px-4 py-3 bg-[#0d0f1c]/50 grid grid-cols-2 gap-2 text-xs border-b border-[#1a1c32]">
        <div className="flex items-center gap-2 p-2 rounded-xl border border-[#1e213b] bg-[#111222]">
          <Flame className="w-4 h-4 text-orange-500 fill-current animate-pulse shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8.5px] text-slate-500 font-bold uppercase leading-none">Streak</span>
            <span className="text-orange-400 text-[11px] font-black mt-0.5">{streak} দিন</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl border border-[#1e213b] bg-[#111222]">
          <Star className="w-4 h-4 text-amber-400 fill-current shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8.5px] text-slate-500 font-bold uppercase leading-none">Total XP</span>
            <span className="text-amber-300 text-[11px] font-black mt-0.5">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Modern High Contrast New Chat button */}
      <div className="p-3.5 shrink-0">
        <button 
          onClick={() => { createNewChat(); setIsSidebarOpen(false); playEffects("medium"); }} 
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-105 text-white flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-orange-500/10"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> নতুন চ্যাট শুরু করুন
        </button>
      </div>

      {/* Scrollable Side Panels */}
      <div className="flex-1 overflow-y-auto w-full px-3.5 space-y-5 pb-4 scrollbar-none">
        
        {/* Mood Modes section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-550">
              এআই মুড পরিবর্তন
            </h3>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-500/20">
              মুড লিস্ট
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            {(["NORMAL", "ROMANTIC", "FUN", "ISLAMIC", "LEGEND"] as Mode[]).map(m => {
              const isActive = mode === m;
              const Icon = MODES[m].icon;
              const themeColor = MODE_THEMES[m].accent;

              return (
                <button 
                  key={m} 
                  onClick={() => { setMode(m); setIsSidebarOpen(false); playEffects("medium"); }} 
                  className={cn(
                    "px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between w-full text-left transition-all cursor-pointer transition-colors border",
                    isActive 
                      ? "bg-[#181a30] border-orange-500/20 text-white shadow-md shadow-black/10" 
                      : "bg-[#0d0e19] border-[#18192d] text-slate-400 hover:text-white hover:bg-[#121424] hover:border-[#1e203c]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 transition-transform" style={{ color: isActive ? themeColor : "#94a3b8" }} />
                    <span className="font-bold text-[12.5px]">{MODES[m].label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Active Chats Logs List */}
        <div className="space-y-2 pt-1.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-550">
              সাম্প্রতিক চ্যাট সমূহ
            </h3>
            <span className="text-[8px] text-slate-500 font-extrabold">{chats.length}টি সেশন</span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto scrollbar-none pr-0.5">
            {chats.map(chat => {
              const lastMessage = chat.messages[chat.messages.length - 1]?.content || "নতুন কথোপকথন";
              const isActive = activeChatId === chat.id;

              return (
                <div 
                  key={chat.id}
                  className={cn("group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer",
                    isActive 
                      ? "bg-[#14162a] border-[#222442] text-white" 
                      : "bg-[#0c0d19]/45 border-[#121324] text-slate-400 hover:bg-[#0e1022] hover:text-slate-200"
                  )}
                  onClick={() => { setActiveChatId(chat.id); setIsSidebarOpen(false); playEffects("light"); }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageCircle className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-500" : "text-slate-500")} />
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-semibold truncate">
                        {chat.messages.length > 0 ? lastMessage : "নতুন চ্যাট শুরু"}
                      </span>
                      <span className="text-[8.5px] text-slate-500 font-bold mt-0.5">
                        {chat.messages.length}টি বার্তা
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { deleteChat(chat.id, e); }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-900 text-slate-500 hover:text-red-500 transition-all shrink-0 cursor-pointer"
                    title="চ্যাট মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              );
            })}

            {chats.length === 0 && (
              <div className="p-4 border border-dashed border-[#1a1c32] rounded-lg text-center bg-[#090b14]/50">
                <span className="text-[10px] text-slate-500 font-semibold font-sans">কোনো চ্যাট ডায়েরি নেই। চ্যাট শুরু করুন!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User settings Quick access section footer */}
      <div className="p-3 border-t border-[#1a1c32] shrink-0 bg-[#0a0b13] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            {userProfilePic ? (
              <img src={userProfilePic} className="w-7.5 h-7.5 rounded-full object-cover border border-[#1e2039]" alt="User profile" />
            ) : (
              <div className="w-7.5 h-7.5 rounded-full bg-indigo-500 flex items-center justify-center text-white font-extrabold text-[10px] uppercase">
                {userName ? userName.substring(0, 1) : "U"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#0a0b13]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11.5px] font-black text-white truncate">{userName || "সোনা বন্ধু"}</span>
            <span className="text-[8px] text-slate-550 font-bold leading-none mt-0.5 truncate">{leagueName}</span>
          </div>
        </div>

        <button 
          onClick={() => { setIsSettingsOpen(true); setActiveSettingsTab("profile"); playEffects("medium"); }}
          className="p-1.5 rounded-lg border border-slate-800 bg-[#121324] hover:bg-slate-900 text-slate-400 hover:text-orange-500 transition-all cursor-pointer"
          title="প্রোফাইল সেটিংস"
        >
          <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
