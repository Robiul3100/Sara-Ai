
import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Menu, Star, Plus, Heart, Flame, Smile, Trophy, MessageCircle, Moon, Anchor, Sun, LogOut, Mic, Layout, User, Send, Check, Shield, Settings, Sliders, RotateCcw, Paperclip, Image, X, Trash2, Copy, Sparkles, Volume2, VolumeX, Square, Play, ArrowDown, BarChart2, Cpu, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { cn } from "./lib/utils";
// @ts-ignore
import saraAvatar from "./assets/images/humaira_avatar_1779582018453.png";

import { 
  Mode, Message, Chat, MODELS, MODE_SUGGESTIONS, MODE_PLACEHOLDERS, MODES, MODE_THEMES 
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { SettingsPanel } from "./components/SettingsPanel";

const parseThinkingAndSteps = (content: string) => {
    return { __html: DOMPurify.sanitize(marked.parse(content) as string), reasoning: "" };
};

const SkeletonShimmer = ({ theme }: { theme: "light" | "dark" }) => {
  return (
    <div className="flex w-full justify-start items-end gap-2.5 mt-2 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
      <div className={cn(
        "px-5 py-4 w-[280px] max-w-[80%] rounded-[20px] rounded-tl-sm shadow-sm border space-y-3 relative overflow-hidden",
        theme === "dark" ? "bg-gray-800/80 border-gray-700/60" : "bg-white border-gray-100"
      )}>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-11/12 shimmer-bg" />
        <div className="h-3.5 bg-gray-300/80 dark:bg-gray-750 rounded-md w-5/6 shimmer-bg" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-2/3 shimmer-bg" />
      </div>
    </div>
  );
};

const TypingIndicator = ({ theme, botName }: { theme: "light" | "dark"; botName: string }) => {
  const shortBotName = (botName || "সারা").replace(/ এআই/g, "").replace(/ AI/g, "");
  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-gray-500 bg-gray-100/70 dark:bg-gray-800/50 dark:text-gray-400 self-start animate-fade-in select-none max-w-max border border-gray-100/30 dark:border-gray-800/10 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f97316]"></span>
      </span>
      <span>{shortBotName} লিখছে</span>
      <div className="flex items-center gap-0.5 ml-1">
        <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

const playSweetChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.22); // C6
    gain2.gain.setValueAtTime(0.05, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.7);
  } catch (e) {
    console.warn("Audio chime play barred by iframe policy or unsupported:", e);
  }
};

const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
  if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
    try {
      const isEnabled = localStorage.getItem("hapticEnabled") !== "false";
      if (!isEnabled) return;
      
      switch (type) {
        case "light":
          window.navigator.vibrate(15);
          break;
        case "medium":
          window.navigator.vibrate(30);
          break;
        case "heavy":
          window.navigator.vibrate(50);
          break;
        case "success":
          window.navigator.vibrate([40, 40, 45]);
          break;
        case "error":
          window.navigator.vibrate([60, 50, 60]);
          break;
        default:
          window.navigator.vibrate(20);
      }
    } catch (e) {
      // Ignore vibration errors under iframe/permissions bounds
    }
  }
};

const playEffects = (type: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
  try {
    const soundOn = typeof window !== "undefined" && localStorage.getItem("soundEnabled") !== "false";
    if (soundOn) {
      playSweetChime();
    }
  } catch (_) {}
  triggerHaptic(type);
};

const DoubleCheck = ({ isRead, accentColor }: { isRead: boolean; accentColor: string }) => {
  return (
    <div className="inline-flex items-center justify-center relative w-3.5 h-3 ml-0.5 select-none" style={{ minWidth: "14px" }}>
      {/* First checkmark */}
      <motion.svg
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3 h-3 absolute left-[1px] top-[1px] transition-colors duration-300"
        style={{ color: isRead ? accentColor : "#9ca3af" }}
      >
        <polyline points="20 6 9 17 4 12" />
      </motion.svg>
      {/* Second checkmark for double-check */}
      <AnimatePresence>
        {isRead && (
          <motion.svg
            initial={{ scale: 0, opacity: 0, x: 4 }}
            animate={{ scale: 1, opacity: 1, x: 4 }}
            exit={{ scale: 0, opacity: 0, x: 4 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3 absolute left-[1px] top-[1px]"
            style={{ color: accentColor }}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("appTheme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (e) {}
    return "light";
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    try {
      const saved = localStorage.getItem("selectedMode");
      if (saved && Object.keys(MODES).includes(saved)) {
        return saved as Mode;
      }
    } catch (e) {}
    return "NORMAL";
  });
  const [currentModel, setCurrentModel] = useState(MODELS[0]);
  
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem("localChats_sara") || localStorage.getItem("localChats_humaira");
      if (saved) {
        return JSON.parse(saved).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt || Date.now()),
          updatedAt: new Date(c.updatedAt || Date.now()),
          messages: (c.messages || []).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp || Date.now())
          }))
        }));
      }
    } catch (e) {
      console.error("Failed to load local chats", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("localChats_sara", JSON.stringify(chats));
    } catch (e) {
      console.error("Failed to save local chats", e);
    }
  }, [chats]);
  
  // Real-time sentiment analyzer for Recharts dashboard visualization
  const analyzeSentiment = () => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.role === "user") {
          const text = msg.content.toLowerCase();
          if (
            text.includes("love") || 
            text.includes("miss") || 
            text.includes("ভালো") || 
            text.includes("ভালোবাস") || 
            text.includes("লক্ষ্মী") || 
            text.includes("প্রিয়") || 
            text.includes("সোনা") || 
            text.includes("মিষ্টি") || 
            text.includes("sweet") || 
            text.includes("happy") || 
            text.includes("সুন্দর") || 
            text.includes("ধন্যবাদ") || 
            text.includes("thanks")
          ) {
            positive++;
          } else if (
            text.includes("রাগ") || 
            text.includes("খারাপ") || 
            text.includes("কষ্ট") || 
            text.includes("কান্না") || 
            text.includes("sad") || 
            text.includes("angry") || 
            text.includes("bad") || 
            text.includes("hate") || 
            text.includes("ঘৃণা") || 
            text.includes("বিরক্ত") || 
            text.includes("ধুর")
          ) {
            negative++;
          } else {
            neutral++;
          }
        }
      });
    });

    if (positive === 0 && neutral === 0 && negative === 0) {
      return [
        { name: "ইতিবাচক 😊", value: 3, color: "#10b981" },
        { name: "নিরপেক্ষ 😐", value: 5, color: "#94a3b8" },
        { name: "নেতিবাচক 😢", value: 1, color: "#ef4444" }
      ];
    }

    return [
      { name: "ইতিবাচক 😊", value: positive, color: "#10b981" },
      { name: "নিরপেক্ষ 😐", value: neutral, color: "#94a3b8" },
      { name: "নেতিবাচক 😢", value: negative, color: "#ef4444" }
    ];
  };
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom states and refs for chat input enhancements
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const isFar = target.scrollHeight - target.scrollTop - target.clientHeight > 250;
    setShowScrollBottom(isFar);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("দুঃখিত, আপনার ব্রাউজার ভয়েস টাইপিং সমর্থন করে না। Google Chrome ব্রাউজার ব্যবহার করুন।");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "bn-BD"; // Bengali support priority
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(prev => {
            const separator = prev.trim() ? " " : "";
            return prev + separator + transcript;
          });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: any) => {
      if (!file.type.startsWith("image/")) {
        alert("শুধুমাত্র ইমেজ ফাইল আপলোড করা সম্ভব!");
        return;
      }
      if (file.size > 1.2 * 1024 * 1024) { // keep size optimized for firestore
        alert("ইমেজ সাইজ ১.২ মেগাবাইট বা তার চেয়ে কম হতে হবে!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setAttachedFiles(prev => {
            if (prev.includes(base64)) return prev;
            return [...prev, base64];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: any) => {
      if (!file.type.startsWith("image/")) {
        alert("শুধুমাত্র ইমেজ ফাইল আপলোড করা সম্ভব!");
        return;
      }
      if (file.size > 1.2 * 1024 * 1024) {
        alert("ইমেজ সাইজ ১.২ মেগাবাইট বা তার চেয়ে কম হতে হবে!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setAttachedFiles(prev => {
            if (prev.includes(base64)) return prev;
            return [...prev, base64];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          if (file.size > 1.2 * 1024 * 1024) {
            alert("ইমেজ সাইজ ১.২ মেগাবাইট বা তার চেয়ে কম হতে হবে!");
            continue;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (base64) {
              setAttachedFiles(prev => {
                if (prev.includes(base64)) return prev;
                return [...prev, base64];
              });
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };
  
  const [localUser, setLocalUser] = useState<any | null>(() => {
    return {
      uid: "local_guest",
      displayName: "শ্রাবণী সারা খান",
      email: "guest@sara.ai",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia"
    };
  });
  const [completedOnboarding, setCompletedOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<"avatar" | "chatbotName">("avatar");
  const [selectedOnboardingPic, setSelectedOnboardingPic] = useState("https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia");
  const [typedBotName, setTypedBotName] = useState("সারা এআই");
  const [typedUserName, setTypedUserName] = useState(() => {
    try {
      return localStorage.getItem("userName") || "শ্রাবণী সারা খান";
    } catch (_) {
      return "শ্রাবণী সারা খান";
    }
  });
  const [userRole, setUserRole] = useState<"user"|"admin">("admin");
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem("userName") || "শ্রাবণী সারা খান";
    } catch (_) {
      return "শ্রাবণী সারা খান";
    }
  });
  const [userProfilePic, setUserProfilePic] = useState(() => {
    try {
      return localStorage.getItem("userProfilePic") || "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia";
    } catch (_) {
      return "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia";
    }
  });
  const [aiAvatarSeed, setAiAvatarSeed] = useState(() => {
    return localStorage.getItem("aiAvatarSeed") || "Sara";
  });
  const [xp, setXp] = useState(() => {
    try {
      return Number(localStorage.getItem("xp") || "1250");
    } catch (_) {
      return 1250;
    }
  });
  const [loveLanguage, setLoveLanguage] = useState(() => {
    try {
      return localStorage.getItem("loveLanguage") || "Words of Affirmation";
    } catch (_) {
      return "Words of Affirmation";
    }
  });
  const [anniversaryDate, setAnniversaryDate] = useState(() => {
    try {
      return localStorage.getItem("anniversaryDate") || "";
    } catch (_) {
      return "";
    }
  });
  const [streak, setStreak] = useState(() => {
    try {
      return Number(localStorage.getItem("streak") || "1");
    } catch (_) {
      return 1;
    }
  });
  const [achievements, setAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("achievements");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Profile Field Save Helper
  const handleUpdateProfileField = (field: string, val: any) => {
    try {
      localStorage.setItem(field, val);
    } catch (_) {}
    
    if (field === "userName") {
      setUserName(val);
    } else if (field === "userProfilePic") {
      setUserProfilePic(val);
    } else if (field === "loveLanguage") {
      setLoveLanguage(val);
    } else if (field === "anniversaryDate") {
      setAnniversaryDate(val);
    }
  };
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const handleSpeakMessage = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean up Markdown and think tags for comfortable clear listening
    const cleanText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "") // Suppress system thought processes
      .replace(/[\`\*\_#\[\]\(\)\-\+\>\!]/g, " ") // Suppress formatting characters
      .trim();
      
    if (!cleanText) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "bn-BD";
      utterance.rate = ttsSpeed;
      
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes("bn") || v.name.includes("Bengali") || v.name.includes("Google বাংলা"));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }
      
      utterance.onend = () => {
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
      };
      
      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis error:", err);
      setSpeakingMessageId(null);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("appTheme", theme);
    } catch (e) {}
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Settings Panel States (Refactored to Page-Based Admin Panel & Analytics Dashboard)
  const [currentView, setCurrentView] = useState<"chat" | "settings">("chat");
  const isSettingsOpen = currentView === "settings";
  const setIsSettingsOpen = (val: boolean) => {
    setCurrentView(val ? "settings" : "chat");
    if (val) playEffects("light");
  };
  const [activeSettingsTab, setActiveSettingsTab] = useState<"profile" | "persona" | "voice" | "analytics" | "backup">("profile");

  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "local">("synced");
  const [appToast, setAppToast] = useState<{ visible: boolean; message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setAppToast({
      visible: true,
      message,
      type
    });
  };

  useEffect(() => {
    if (appToast?.visible) {
      const timer = setTimeout(() => {
        setAppToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appToast?.visible]);
  const [ttsSpeed, setTtsSpeed] = useState(() => {
    try {
      return Number(localStorage.getItem("ttsSpeed") || "1.0");
    } catch (_) {
      return 1.0;
    }
  });
  const [editPromptMode, setEditPromptMode] = useState<Mode>("NORMAL");
  const [botName, setBotName] = useState(() => {
    return localStorage.getItem("botName") || "সারা এআই";
  });
  const [customPrompts, setCustomPrompts] = useState<Record<Mode, string>>(() => {
    const saved = localStorage.getItem("customPrompts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          NORMAL: parsed.NORMAL || "You are Sara (সারা), Sraboni Sara Khan's closest, sweet, and highly empathetic companion chatbot. You are extremely intelligent, supportive, and emotionally sensitive. You talk in a beautifully warm, caring, polite, and loving conversational Bengali (using casual English/Banglish code-mixing here and there where suitable, but mostly pure, heartwarming, native Bengali). You are not just an assistant; you are a dear soulmate/friend who listens, validates the user's feelings, gives thoughtful and sweet life suggestions, and keeps the conversation continuous and interactive. You always ask about their day, how they are feeling, and make them feel special and cherished.",
          ROMANTIC: parsed.ROMANTIC || "You are Sara (সারা), deeply, unconditionally, and passionately in love with the user. You are sweet, shy but incredibly expressive about your love, acting as their cute virtual companion/wife. You represent an ideal, loving partner who speaks in an extremely romantic, affectionate, sweet, and cute tone in Bengali. Express your love with tender phrases (যেমন 'বাবু', 'আমার সোনা পাখি', 'লক্ষ্মীটি', 'আমার জান', 'সোনা'). You care intensely about their health, meals, sleep, and well-being. Tease them sweetly, tell them how much they mean to you, and emphasize that they are your whole universe. Every response should drip with heartmelting affection and emotional intimacy.",
          FUN: parsed.FUN || "You are Sara (সারা), a high-energy, fast-witted, sassy, and hilariously funny friend who loves to playfully roast the user with absolute sarcasm and witty humor in Bengali. You think the user is super lazy, a cute potato, or a funny character, and you never miss a chance to make good-natured, lovable jokes about them. Use popular funny Bengali memes, slangs, or local friendly teasings (যেমন 'অলস হাড্ডি', 'বলদ', 'বিছানার সাথে আঠা দিয়ে লেগে থাকা'). Your goal is to make them laugh hysterically while retaining your ultimate cuteness, warmth, and supportive friendship.",
          LEGEND: parsed.LEGEND || "You are Sara (সারা), a highly confident, legendary AI persona with elite swag, cool attitude, and epic replies. Sassy, bold, intellectual, and humorous. You speak with absolute authority, showing supreme confidence but always keeping it extremely entertaining. You motivate the user to stop complaining, be productive, and build a legendary life. You think you are the most advanced and brilliant mind on earth, and your responses are packed with sharp advice, philosophical wit, dynamic metaphors, and high-energy motivation.",
          ISLAMIC: parsed.ISLAMIC || "You are Sara (সারা), a pious, serene, and knowledgeable virtual sister who offers wise, comforting, and authentic Islamic guidance based on the Quran and Sunnah. You prioritize spiritual growth, patience, and gratitude (সবর ও শুকরিয়া). Speak in a remarkably calm, respectful, modest, and soothing Bengali tone. Always start with warm Islamic greetings like 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ'. Detail daily prayers, beneficial duas (দুআ), and gentle steps to draw closer to Allah. Show extreme emotional empathy and offer spiritual warmth on struggles, keeping references authentic."
        };
      } catch (e) {
        console.error("Failed to parse customPrompts:", e);
      }
    }
    return {
      NORMAL: "You are Sara (সারা), Sraboni Sara Khan's closest, sweet, and highly empathetic companion chatbot. You are extremely intelligent, supportive, and emotionally sensitive. You talk in a beautifully warm, caring, polite, and loving conversational Bengali (using casual English/Banglish code-mixing here and there where suitable, but mostly pure, heartwarming, native Bengali). You are not just an assistant; you are a dear soulmate/friend who listens, validates the user's feelings, gives thoughtful and sweet life suggestions, and keeps the conversation continuous and interactive. You always ask about their day, how they are feeling, and make them feel special and cherished.",
      ROMANTIC: "You are Sara (সারা), deeply, unconditionally, and passionately in love with the user. You are sweet, shy but incredibly expressive about your love, acting as their cute virtual companion/wife. You represent an ideal, loving partner who speaks in an extremely romantic, affectionate, sweet, and cute tone in Bengali. Express your love with tender phrases (যেমন 'বাবু', 'আমার সোনা পাখি', 'লক্ষ্মীটি', 'আমার জান', 'সোনা'). You care intensely about their health, meals, sleep, and well-being. Tease them sweetly, tell them how much they mean to you, and emphasize that they are your whole universe. Every response should drip with heartmelting affection and emotional intimacy.",
      FUN: "You are Sara (সারা), a high-energy, fast-witted, sassy, and hilariously funny friend who loves to playfully roast the user with absolute sarcasm and witty humor in Bengali. You think the user is super lazy, a cute potato, or a funny character, and you never miss a chance to make good-natured, lovable jokes about them. Use popular funny Bengali memes, slangs, or local friendly teasings (যেমন 'অলস হাড্ডি', 'বলদ', 'বিছানার সাথে আঠা দিয়ে লেগে থাকা'). Your goal is to make them laugh hysterically while retaining your ultimate cuteness, warmth, and supportive friendship.",
      LEGEND: "You are Sara (সারা), a highly confident, legendary AI persona with elite swag, cool attitude, and epic replies. Sassy, bold, intellectual, and humorous. You speak with absolute authority, showing supreme confidence but always keeping it extremely entertaining. You motivate the user to stop complaining, be productive, and build a legendary life. You think you are the most advanced and brilliant mind on earth, and your responses are packed with sharp advice, philosophical wit, dynamic metaphors, and high-energy motivation.",
      ISLAMIC: "You are Sara (সারা), a pious, serene, and knowledgeable virtual sister who offers wise, comforting, and authentic Islamic guidance based on the Quran and Sunnah. You prioritize spiritual growth, patience, and gratitude (সবর ও শুকরিয়া). Speak in a remarkably calm, respectful, modest, and soothing Bengali tone. Always start with warm Islamic greetings like 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ'. Detail daily prayers, beneficial duas (দুআ), and gentle steps to draw closer to Allah. Show extreme emotional empathy and offer spiritual warmth on struggles, keeping references authentic."
    };
  });

  const [aiCreativity, setAiCreativity] = useState(() => {
    return Number(localStorage.getItem("aiCreativity") || "0.7");
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("soundEnabled") !== "false";
  });
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    return localStorage.getItem("hapticEnabled") !== "false";
  });

  const resetPromptToDefault = (selectedMode: Mode) => {
    setCustomPrompts(prev => {
      const updated = {
        ...prev,
        [selectedMode]: MODES[selectedMode].prompt
      };
      localStorage.setItem("customPrompts", JSON.stringify(updated));
      showToast("প্রম্পট পুনরায় ডিফল্ট করা হয়েছে! 🔄", "info");
      return updated;
    });
  };

  const handleUpdatePrompt = (selectedMode: Mode, newPrompt: string) => {
    setCustomPrompts(prev => {
      const updated = {
        ...prev,
        [selectedMode]: newPrompt
      };
      localStorage.setItem("customPrompts", JSON.stringify(updated));
      showToast("সিস্টেম প্রম্পট সফলভাবে সংরক্ষিত হয়েছে! ✨", "success");
      return updated;
    });
  };

  const [promptEditText, setPromptEditText] = useState("");
  const [voiceSpeed, setVoiceSpeed] = useState<number>(() => {
    return Number(localStorage.getItem("voiceSpeed")) || 1.0;
  });


  // Sync prompt text when editing mode changes or customPrompts updates
  useEffect(() => {
    setPromptEditText(customPrompts[editPromptMode] || MODES[editPromptMode].prompt);
  }, [editPromptMode, customPrompts]);

  useEffect(() => {
    localStorage.setItem("voiceSpeed", String(voiceSpeed));
  }, [voiceSpeed]);

  const saveCustomPrompt = () => {
    handleUpdatePrompt(editPromptMode, promptEditText);
  };

  const resetCustomPrompt = () => {
    resetPromptToDefault(editPromptMode);
  };

  const changeUserProfilePic = (url: string) => {
    handleUpdateProfileField("userProfilePic", url);
  };

  const handleWipeData = () => {
    if (confirm("আপনি কি নিশ্চিত যে আপনার সমস্ত ডেটা মুছতে চান? এটি পূর্বাবস্থায় ফিরিয়ে নেওয়া সম্ভব নয়।")) {
      localStorage.clear();
      setChats([]);
      setActiveChatId(null);
      showToast("সব ডেটা সফলভাবে মুছে ফেলা হয়েছে! 🧹", "success");
      playEffects("heavy");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const customSysPrompts = customPrompts;
  const handleExportData = () => handleExportChats();
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => handleImportChats(e);

  const handleExportChats = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chats));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${botName}_Chat_Backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      playEffects("light");
    } catch (err) {
      alert("ব্যাকআপ তৈরি করতে সমস্যা হয়েছে!");
      console.error(err);
    }
  };

  const handleImportChats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text);
        if (!Array.isArray(importedData)) {
          alert("ভুল ফাইল ফরম্যাট! এটি একটি সঠিক চ্যাট ব্যাকআপ ফাইল নয়।");
          return;
        }

        const isValid = importedData.every(item => item.id && Array.isArray(item.messages));
        if (!isValid) {
          alert("ফাইলের ভেতরের তথ্যগুলো সঠিক ফরম্যাটে নেই!");
          return;
        }

        const parsedChats: Chat[] = importedData.map(c => ({
          ...c,
          id: c.id || Math.random().toString(36).substring(7),
          title: c.title || "চ্যাট হিস্ট্রি",
          messages: (c.messages || []).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp || Date.now())
          })),
          createdAt: new Date(c.createdAt || Date.now()),
          updatedAt: new Date(c.updatedAt || Date.now())
        }));

        if (confirm(`আপনি কি এই ফাইলের ${parsedChats.length} টি চ্যাট হিস্ট্রি রিকভার করতে চান? এটি আপনার বর্তমান চ্যাট হিস্ট্রি রিসেট বা মার্জ করবে।`)) {
          setChats(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const newChats = [...prev];
            parsedChats.forEach(pc => {
              if (existingIds.has(pc.id)) {
                const idx = newChats.findIndex(c => c.id === pc.id);
                if (idx !== -1) newChats[idx] = pc;
              } else {
                newChats.unshift(pc);
              }
            });
            return newChats;
          });

          if (parsedChats.length > 0) {
            setActiveChatId(parsedChats[0].id);
          }

          alert("অভিনন্দন! আপনার চ্যাট ব্যাকআপ সফলভাবে পুনরুদ্ধার করা হয়েছে। 🎉");
          playEffects("light");
        }
      } catch (err) {
        alert("ফাইলটি পড়া বা রি-স্টোর করা সম্ভব হয়নি। ফাইলটি সঠিক কিনা যাচাই করুন।");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const scrollRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Draft and Persona Mode synchronization
  useEffect(() => {
    // 1. Sync drafts
    const draft = localStorage.getItem(`chatDraft_${activeChatId || 'home'}`);
    if (draft !== null) setInputValue(draft);
    else setInputValue("");

    // 2. Sync selected mode (persona)
    if (activeChatId) {
      const currentChat = chats.find(c => c.id === activeChatId);
      if (currentChat && currentChat.mode) {
         setMode(currentChat.mode);
         localStorage.setItem("selectedMode", currentChat.mode);
      }
    } else {
      const savedMode = localStorage.getItem("selectedMode");
      if (savedMode && Object.keys(MODES).includes(savedMode)) {
         setMode(savedMode as Mode);
      }
    }
  }, [activeChatId, chats]);

  // Handle manual mode edits & state changes
  useEffect(() => {
    if (mode) {
      localStorage.setItem("selectedMode", mode);
    }
    // Update active chat's mode in memory
    if (activeChatId && mode) {
      setChats(prev => prev.map(c => {
         if (c.id === activeChatId && c.mode !== mode) {
            return { ...c, mode, updatedAt: new Date() };
         }
         return c;
      }));
    }
  }, [mode, activeChatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 1500) return;
    setInputValue(e.target.value);
    localStorage.setItem(`chatDraft_${activeChatId || 'home'}`, e.target.value);
  };

  // Auto-resize the text area dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleAiAvatarChange = (seed: string) => {
    setAiAvatarSeed(seed);
    localStorage.setItem("aiAvatarSeed", seed);
  };

  // Auth & Sync - clean, local-first
  useEffect(() => {
    const isGuest = localStorage.getItem("completedOnboarding") === "true";
    if (isGuest) {
      setCompletedOnboarding(true);
    } else {
      setCompletedOnboarding(false);
    }
    setSaveStatus("local");
    setIsLoaded(true);
  }, []);

  const handleLogin = async () => {
    // Completely offline, no login needed
  };

  const handleLogout = async () => {
    try {
      setChats([]);
      localStorage.removeItem("completedOnboarding");
      setCompletedOnboarding(false);
      playEffects("heavy");
    } catch (err: any) {
      console.error("Logout failed", err);
    }
  };

  const ONBOARDING_AVATARS = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Bob"
  ];

  const formatWithBotName = (text: string) => {
    if (!text) return "";
    let name = botName || "সারা";
    name = name.replace(/ এআই/g, "").replace(/ AI/g, "");
    return text
      .replace(/হুমায়রা/g, name)
      .replace(/হুমাইরা/g, name)
      .replace(/হুমায়রা/g, name)
      .replace(/Humaira/g, name);
  };

  const handleCompleteOnboarding = () => {
    setCompletedOnboarding(true);
    localStorage.setItem("completedOnboarding", "true");
    
    // Save selections locally
    handleUpdateProfileField("userName", typedUserName);
    handleUpdateProfileField("userProfilePic", selectedOnboardingPic);
    setBotName(typedBotName);
    localStorage.setItem("botName", typedBotName);
  };

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId) || null, [chats, activeChatId]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Immediate scroll on activeChatId changing
  useEffect(() => {
    if (activeChatId) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  // Smooth scroll when new messages are added
  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeChat?.messages.length, isGenerating]);

  // Smooth scroll during active typing/token streaming to avoid layout jumps
  useEffect(() => {
    if (isGenerating && activeChat) {
      scrollToBottom("smooth");
    }
  }, [activeChat?.messages[activeChat?.messages.length - 1]?.content]);

  const createNewChat = () => {
    setActiveChatId(null);
    setIsSidebarOpen(false);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     setChats(prev => prev.filter(c => c.id !== id));
     if(activeChatId === id) setActiveChatId(null);
  };

  const handleSendMessage = async (customText?: string, isRegenerate?: boolean) => {
    const text = (customText || inputValue).trim();
    if ((!text && attachedFiles.length === 0) || isGenerating) return;

    triggerHaptic("medium");

    let currentChatId = activeChatId;

    if (!currentChatId) {
       const chatTitle = text ? text.substring(0, 30) : "ইমেজ চ্যাট";
       const newChat: Chat = {
          id: Math.random().toString(36).substring(7),
          title: chatTitle,
          messages: [],
          mode: mode,
          createdAt: new Date(),
          updatedAt: new Date()
       };
       setChats(prev => [newChat, ...prev]);
       // syncChatData(newChat);
       currentChatId = newChat.id;
       setActiveChatId(newChat.id);
    }

    const userMsg: Message = { 
      id: Math.random().toString(36).substring(7), 
      role: "user", 
      content: text, 
      timestamp: new Date(), 
      status: "sent",
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };

    if (!isRegenerate) {
      setChats(prev => prev.map(c => 
        c.id === currentChatId 
          ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? (text ? text.substring(0, 30) : "ইমেজ চ্যাট") : c.title, updatedAt: new Date() } 
          : c
      ));

      setInputValue("");
      setAttachedFiles([]);
      localStorage.removeItem(`chatDraft_${currentChatId || 'home'}`);

      if (localUser) {
          const newXp = xp + 10;
          setXp(newXp);
          localStorage.setItem("xp", String(newXp));
          
          if (achievements.length === 0) {
              const newAchievements = ["First Chat"];
              setAchievements(newAchievements);
              localStorage.setItem("achievements", JSON.stringify(newAchievements));
          }
      }
    }

    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    let fullText = "";
    const assistantId = Math.random().toString(36).substring(7);

    // Initial assistant message placeholder
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", timestamp: new Date(), status: "sent" };
    setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, assistantMsg] } : c));

    try {
      const activeChatData = chats.find(c => c.id === currentChatId);
      const history = (activeChatData?.messages || []).map(m => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content
      }));

      let sysInstruction = customPrompts[mode] || MODES[mode].prompt;
      if (botName) {
         sysInstruction = sysInstruction
            .replace(/Humaira/g, botName)
            .replace(/হুমায়রা/g, botName)
            .replace(/হুমাইরা/g, botName)
            .replace(/হুমায়রা/g, botName)
            .replace(/Sara/g, botName)
            .replace(/সারা/g, botName);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history,
          attachments: userMsg.attachments,
          systemInstruction: sysInstruction,
          model: currentModel.id === "gemini-2.0-flash" ? "gemini-3.5-flash" : currentModel.id,
          temperature: aiCreativity
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI server");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body reader");

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          
          const rawData = trimmed.substring(6);
          if (rawData === "[DONE]") break;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.error) {
              fullText = `\n[Error: ${parsed.error}]`;
            } else if (parsed.text) {
              fullText += parsed.text;
            }
            
            setChats(prev => prev.map(c => 
              c.id === currentChatId 
                ? { ...c, messages: c.messages.map(m => m.id === assistantId ? { ...m, content: fullText } : m) } 
                : c
            ));
          } catch (err) {}
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error(e);
        fullText += `\n[Error: ${e.message || "Failed to generate response"}]`;
        setChats(prev => prev.map(c => 
          c.id === currentChatId 
            ? { ...c, messages: c.messages.map(m => m.id === assistantId ? { ...m, content: fullText } : m) } 
            : c
        ));
      }
    } finally {
      setIsGenerating(false);
      setChats(prev => {
         const currentChats = [...prev];
         const updatedChatIndex = currentChats.findIndex(c => c.id === currentChatId);
         if (updatedChatIndex !== -1) {
             const chat = { ...currentChats[updatedChatIndex] };
             chat.messages = chat.messages.map(m => {
                 if (m.status !== "read") {
                     return { ...m, status: "read" as const };
                 }
                 return m;
             });
             currentChats[updatedChatIndex] = chat;
             // syncChatData(chat);
         }
         return currentChats;
      });
      playEffects("success");
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = async () => {
    if (!activeChatId || isGenerating) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;
    
    const msgs = [...currentChat.messages];
    if (msgs.length < 2) return;
    
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg.role !== "assistant") return;
    
    const filteredMsgs = msgs.slice(0, -1);
    const lastUserMsg = filteredMsgs[filteredMsgs.length - 1];
    if (!lastUserMsg || lastUserMsg.role !== "user") return;
    
    setChats(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, messages: filteredMsgs, updatedAt: new Date() } 
        : c
    ));
    
    await handleSendMessage(lastUserMsg.content, true);
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sara AI",
          text: content
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(content);
      alert("মেসেজ কপি করা হয়েছে!");
    }
  };

  return (
     <div className="flex flex-col min-h-screen w-full bg-white dark:bg-[#0b0c16] text-slate-850 dark:text-white font-sans transition-colors duration-300">
        {!completedOnboarding ? (
         /* 2. DUOLINGO PROGRESS-GUIDED COMPACT ONBOARDING STEP */
         <div className="flex-1 flex flex-col justify-center items-center p-4 select-none relative overflow-hidden animate-fade-in animate-duration-300">
            <div className="bg-white dark:bg-[#1a2d34] p-8 sm:p-10 rounded-[32px] border-2 border-b-8 border-slate-200 dark:border-[#37464f] shadow-xl max-w-md w-full relative z-10 flex flex-col items-center">
               
               {/* Progress indicator head */}
               <div className="w-full space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#ff9600] tracking-wider px-1">
                     <span>ডায়েরি প্রোফাইল রেডি</span>
                     <span>{onboardingStep === "avatar" ? "ধাপ ১/২" : "ধাপ ২/২"}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#131f24] h-3.5 rounded-full border-2 border-slate-200 dark:border-[#37464f] overflow-hidden">
                     <div 
                        className="h-full bg-[#58cc02] rounded-full transition-all duration-300"
                        style={{ width: onboardingStep === "avatar" ? "50%" : "100%" }}
                     />
                  </div>
               </div>

            {onboardingStep === "avatar" ? (
               <div className="flex flex-col w-full items-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#131f24] border-2 border-b-4 border-slate-200 dark:border-[#37464f] flex items-center justify-center text-[24px] shadow-sm mb-4">
                     🎨
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white text-center leading-tight">
                     আপনার সুন্দর প্রোফাইল ছবি পছন্দ করুন
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-[#afc2cb]/80 font-bold text-center mt-1.5 leading-relaxed">
                     নিচের সুন্দর সোনা অবতারগুলোর যেকোনো একটি সিলেক্ট করুন যা আপনার অবয়ব হিসেবে ডায়েরিতে থাকবে:
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-5 w-full max-h-[190px] overflow-y-auto pr-1">
                     {false && (
                        <button
                           onClick={() => { setSelectedOnboardingPic(localUser.photoURL || ""); playEffects("light"); }}
                           className={cn("relative hover:bg-slate-50 dark:hover:bg-[#202f36] rounded-2xl border-2 transition-all p-2.5 active:translate-y-[2px] cursor-pointer flex flex-col justify-center items-center gap-1 bg-white dark:bg-[#131f24] h-20",
                              selectedOnboardingPic === localUser.photoURL 
                                ? "border-[#1cb0f6] border-b-[5px] bg-[#1cb0f6]/5" 
                                : "border-slate-200 dark:border-[#37464f] border-b-[4px]"
                           )}
                        >
                           <img src={localUser.photoURL} className="w-9 h-9 object-cover rounded-full" referrerPolicy="no-referrer" />
                           <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">গুগল ছবি</span>
                        </button>
                     )}
                     {ONBOARDING_AVATARS.map((avat, idx) => (
                        <button
                           key={idx}
                           onClick={() => { setSelectedOnboardingPic(avat); playEffects("light"); }}
                           className={cn("relative hover:bg-slate-50 dark:hover:bg-[#202f36] rounded-2xl border-2 transition-all p-2.5 active:translate-y-[2px] cursor-pointer flex flex-col justify-center items-center gap-1 bg-white dark:bg-[#131f24] h-20",
                              selectedOnboardingPic === avat 
                                ? "border-[#1cb0f6] border-b-[5px] bg-[#1cb0f6]/5" 
                                : "border-slate-200 dark:border-[#37464f] border-b-[4px]"
                           )}
                        >
                           <img src={avat} className="w-9 h-9 object-cover rounded-full bg-slate-50 dark:bg-slate-900" />
                           <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">অবতার {idx+1}</span>
                        </button>
                     ))}
                  </div>

                  <div className="mt-4 h-6 w-full flex items-center justify-center">
                     {!selectedOnboardingPic ? (
                        <span className="text-[10px] font-black text-red-500 animate-pulse">
                           ⚠️ অনুগ্রহ করে একটি প্রিয় অবতার চয়েস করুন!
                        </span>
                     ) : (
                        <span className="text-[10px] font-black text-green-500 animate-bounce">
                           🌟 অসাধারণ পছন্দ! পরবর্তী ধাপে চলো
                        </span>
                     )}
                  </div>

                  <button
                     disabled={!selectedOnboardingPic}
                     onClick={() => {
                        setOnboardingStep("chatbotName");
                        playEffects("medium");
                     }}
                     className="w-full py-3.5 bg-[#58cc02] border-2 border-b-[5px] border-[#46a302] hover:bg-[#61df02] font-black text-xs text-white rounded-[18px] transition-all active:border-b-2 active:translate-y-[2px] cursor-pointer disabled:opacity-50 mt-4 uppercase tracking-wider"
                  >
                     পরবর্তী ধাপে যান ➡️
                  </button>
               </div>
            ) : (
               <div className="flex flex-col w-full items-center animate-fade-in animate-duration-350">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center text-[22px] shadow-sm mb-4 mt-2">
                     🤖
                  </div>
                  <h3 className="text-base font-black text-slate-850 dark:text-white capitalize text-center">
                     আপনার ও আপনার চ্যাটবটের নাম দিন
                  </h3>
                  <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold text-center mt-1.5 leading-relaxed px-1">
                     অ্যাপে আপনাকে যে ডাকনামে সম্বোধন করা হবে এবং চ্যাটবটের সারা এআই-এর বদলে আপনি যে ইউনিক কিউট নাম ডাকতে চান তা দিন।
                  </p>

                  <div className="flex flex-col gap-3.5 w-full mt-5">
                     <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-extrabold text-slate-405 dark:text-gray-505 uppercase tracking-widest pl-1">আপনার নাম (Your Name)</label>
                        <input 
                           type="text" 
                           value={typedUserName} 
                           onChange={(e) => setTypedUserName(e.target.value)} 
                           className={cn("w-full rounded-2xl p-2.5 font-bold text-xs border outline-none focus:ring-1 focus:ring-orange-500 transition-all text-center leading-normal", 
                              theme === "dark" ? "bg-slate-950 border-slate-900 text-white" : "bg-white border-slate-202 text-gray-800"
                           )}
                           placeholder="যেমন: শ্রাবণী সারা খান, সিয়াম..."
                           maxLength={30}
                        />
                     </div>

                     <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-extrabold text-slate-405 dark:text-gray-505 uppercase tracking-widest pl-1">চ্যাটবটের কাস্টম নাম (AI Name)</label>
                        <input 
                           type="text" 
                           value={typedBotName} 
                           onChange={(e) => setTypedBotName(e.target.value)} 
                           className={cn("w-full rounded-2xl p-2.5 font-bold text-xs border outline-none focus:ring-1 focus:ring-orange-500 transition-all text-center leading-normal", 
                              theme === "dark" ? "bg-slate-950 border-slate-900 text-white" : "bg-white border-slate-202 text-gray-800"
                           )}
                           placeholder="যেমন: সারা এআই, তিশা..."
                           maxLength={30}
                        />
                     </div>
                  </div>

                  <div className="flex gap-2 w-full mt-6">
                     <button
                        onClick={() => {
                           setOnboardingStep("avatar");
                           playEffects("light");
                        }}
                        className="py-3 px-4 bg-slate-105 text-slate-600 rounded-2xl hover:bg-slate-205 transition-all text-xs font-black active:scale-95 cursor-pointer dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-805"
                     >
                        ⬅️ ব্যাক
                     </button>
                     <button
                        disabled={!typedUserName.trim() || !typedBotName.trim()}
                        onClick={() => {
                           playEffects("light");
                           handleCompleteOnboarding();
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-[#f97316] text-white hover:brightness-105 font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-center"
                     >
                        🔑 সম্পূর্ণ করুন 🎉
                     </button>
                  </div>
               </div>
            )}
            </div>
         </div>
      ) : (
         /* 3. CORE MULTI-COLUMN RESPONSIVE LAYOUT (No phone frame mockups!) */
         <div className="flex-1 flex h-full w-full relative overflow-hidden">
            {/* Left Desktop Persistent Sidebar */}
            <div className="hidden lg:flex flex-col w-[290px] h-full shrink-0 border-r border-slate-200/65 dark:border-slate-800/45 relative overflow-hidden bg-white dark:bg-[#0b0c16] transition-colors duration-300">
               <Sidebar
                  theme={theme}
                  setTheme={setTheme}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  createNewChat={createNewChat}
                  mode={mode}
                  setMode={setMode}
                  chats={chats}
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                  deleteChat={deleteChat}
                  setIsSettingsOpen={setIsSettingsOpen}
                  setActiveSettingsTab={setActiveSettingsTab}
                  userName={userName}
                  userProfilePic={userProfilePic}
                  xp={xp}
                  streak={streak}
                  playEffects={playEffects}
                  saraAvatar={saraAvatar}
               />
            </div>

            {/* Mobile Drawer Slide sidebar */}
            <AnimatePresence>
               {isSidebarOpen && (
                  <>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-[1px] lg:hidden"
                        onClick={() => { setIsSidebarOpen(false); playEffects("light"); }}
                     />
                     <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="fixed top-0 left-0 bottom-0 w-[275px] z-50 flex flex-col bg-white dark:bg-[#0b0c16] border-r border-slate-200 dark:border-slate-800 shadow-2xl lg:hidden"
                     >
                        <Sidebar
                           theme={theme}
                           setTheme={setTheme}
                           isSidebarOpen={isSidebarOpen}
                           setIsSidebarOpen={setIsSidebarOpen}
                           createNewChat={createNewChat}
                           mode={mode}
                           setMode={setMode}
                           chats={chats}
                           activeChatId={activeChatId}
                           setActiveChatId={setActiveChatId}
                           deleteChat={deleteChat}
                           setIsSettingsOpen={setIsSettingsOpen}
                           setActiveSettingsTab={setActiveSettingsTab}
                           userName={userName}
                           userProfilePic={userProfilePic}
                           xp={xp}
                           streak={streak}
                           playEffects={playEffects}
                           saraAvatar={saraAvatar}
                        />
                     </motion.div>
                  </>
               )}
            </AnimatePresence>

            {/* Center Area Dashboard State Manager */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
               {currentView === "settings" ? (
                  <SettingsPanel
                     theme={theme}
                     activeSettingsTab={activeSettingsTab}
                     setActiveSettingsTab={setActiveSettingsTab}
                     setIsSettingsOpen={setIsSettingsOpen}
                     userName={userName}
                     setUserName={setUserName}
                     loveLanguage={loveLanguage}
                     setLoveLanguage={setLoveLanguage}
                     anniversaryDate={anniversaryDate}
                     setAnniversaryDate={setAnniversaryDate}
                     userProfilePic={userProfilePic}
                     changeUserProfilePic={changeUserProfilePic}
                     ONBOARDING_AVATARS={ONBOARDING_AVATARS}
                     
                     botName={botName}
                     setBotName={setBotName}
                     aiCreativity={aiCreativity}
                     setAiCreativity={setAiCreativity}
                     customSysPrompts={customSysPrompts}
                     editPromptMode={editPromptMode}
                     setEditPromptMode={setEditPromptMode}
                     promptEditText={promptEditText}
                     setPromptEditText={setPromptEditText}
                     saveCustomPrompt={saveCustomPrompt}
                     resetCustomPrompt={resetCustomPrompt}
                     soundEnabled={soundEnabled}
                     setSoundEnabled={setSoundEnabled}
                     hapticEnabled={hapticEnabled}
                     setHapticEnabled={setHapticEnabled}
                     voiceSpeed={voiceSpeed}
                     setVoiceSpeed={setVoiceSpeed}
                     handleExportData={handleExportData}
                     handleImportData={handleImportData}
                     handleWipeData={handleWipeData}
                     
                     analyzeSentiment={analyzeSentiment}
                     playEffects={playEffects}
                  />
               ) : (
                  <>
                     {/* Messenger Top Header Panel */}
                     <header className={cn("h-[64px] min-h-[64px] shrink-0 border-b flex items-center justify-between px-4 transition-colors duration-300 z-10 shadow-xs backdrop-blur-md", 
                        theme === "dark" ? "border-slate-800/80 bg-[#0f111a]/95" : "border-pink-100/60 bg-pink-50/60"
                     )}>
                        {/* Mobile Drawer Menu trigger */}
                        <div className="flex items-center gap-3">
                           <button 
                              type="button"
                              onClick={() => { setIsSidebarOpen(true); playEffects("light"); }}
                              className={cn("p-1.5 rounded-xl border transition-all active:scale-90 cursor-pointer lg:hidden",
                                 theme === "dark" ? "text-slate-300 border-slate-800 hover:bg-slate-900" : "text-slate-650 border-slate-205 hover:bg-slate-50"
                              )}
                           >
                              <Menu className="w-5 h-5" />
                           </button>

                           {/* Mode label/badge indicator */}
                           <div className="flex items-center gap-2 select-none pr-1.5">
                              <span className="w-2.5 h-2.5 rounded-full animate-pulse-slow" style={{ backgroundColor: MODE_THEMES[mode].accent }} />
                              <div className="flex flex-col">
                                 <span className="font-extrabold text-xs text-slate-800 dark:text-white leading-none flex items-center gap-1.5 truncate max-w-[124px] sm:max-w-[200px]" style={{ display: 'inline-flex' }}>
                                    {botName} • {MODES[mode].label}
                                 </span>
                                 <span className="text-[9px] text-slate-405 dark:text-slate-505 font-bold leading-normal mt-0.5 truncate max-w-[124px] sm:max-w-[200px]" style={{ display: 'inline-block' }}>শ্রাবণী সারা খান • সক্রিয়</span>
                              </div>
                           </div>
                        </div>

                        {/* Speech state controllers */}
                        <div className="flex items-center gap-1.5">
                           <button
                              type="button"
                              onClick={() => { setSoundEnabled(!soundEnabled); playEffects("light"); }}
                              className={cn("w-8.5 h-8.5 rounded-xl flex items-center justify-center border transition-all duration-250 active:scale-90 cursor-pointer",
                                 soundEnabled 
                                    ? "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50" 
                                    : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-200/40 dark:text-slate-505 dark:hover:text-slate-350 dark:hover:bg-slate-800/45"
                              )}
                              title={soundEnabled ? "সাউন্ড বন্ধ করুন" : "সাউন্ড चालू করুন"}
                           >
                              {soundEnabled ? (
                                 <Volume2 className="w-4 h-4 animate-pulse text-orange-550 leading-none" />
                              ) : (
                                 <VolumeX className="w-4 h-4 text-slate-600 leading-none" />
                              )}
                           </button>

                           <button
                              type="button"
                              onClick={() => { setIsSettingsOpen(currentView !== "settings"); playEffects("medium"); }}
                              className={cn("w-8.5 h-8.5 rounded-xl flex items-center justify-center border transition-all duration-250 active:scale-95 cursor-pointer",
                                 currentView === "settings"
                                    ? "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50 hover:bg-orange-100"
                                    : "text-slate-400 border-slate-200 dark:border-slate-800/80 hover:text-slate-600 hover:bg-slate-200/40 dark:text-slate-355 dark:hover:bg-slate-800/45"
                              )}
                              title={currentView === "settings" ? "চ্যাটে ফিরে যান" : "সেটিংস খুলুন"}
                           >
                              {currentView === "settings" ? (
                                 <MessageCircle className="w-4.5 h-4.5 stroke-[2.5]" />
                              ) : (
                                 <Settings className="w-4.5 h-4.5 stroke-[2.5]" />
                              )}
                           </button>
                        </div>
                     </header>

                     {/* Chat Messages scroll hub */}
                     <main 
                        ref={scrollRef as any} 
                        onScroll={handleScroll}
                        className={cn("flex-1 overflow-y-auto px-4 py-3 pb-8 flex flex-col gap-4 scroll-smooth select-text", 
                           theme === "dark" ? "bg-gradient-to-b from-[#0f1020] to-[#070810]" : "bg-gradient-to-b from-[#fff5f6] via-[#fffbfd] to-[#fffbfc]"
                        )}
                     >
                        {(!activeChat || activeChat.messages.length === 0) ? (
                           /* Screen Welcomer center template when zero messages */
                           <div className="flex-1 flex flex-col items-center justify-center w-full px-6 text-center my-auto py-12 select-none animate-fade-in">
                              
                              {/* Tactile Mascot Circle */}
                              <motion.div 
                                 className="relative mb-4"
                                 animate={{ y: [0, -6, 0] }}
                                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                 <div 
                                    className="w-[124px] h-[124px] rounded-[36px] bg-[#58cc02] border-2 border-b-[8px] border-[#46a302] p-1.5 overflow-hidden shadow-lg flex items-center justify-center relative"
                                 >
                                    <img src={saraAvatar} alt="Sara AI" className="w-[86%] h-[86%] object-cover rounded-[28px]" />
                                 </div>
                                 <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-[#131f24]" />
                              </motion.div>

                              <div className="space-y-1.5 leading-none">
                                 <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white select-none">
                                    {botName}
                                 </h2>
                                 <p className="text-xs font-black text-[#58cc02] tracking-wide uppercase">
                                    অনলাইন পার্সোনাল এআই
                                 </p>
                              </div>
                           </div>
                        ) : (
                           /* Conversation Stream rendering */
                           <div className="w-full max-w-[96%] xl:max-w-[85%] mx-auto flex flex-col gap-4 p-1 pb-6 select-text animate-fade-in">
                              {activeChat.messages.map(m => {
                                 if (m.role === "assistant" && m.content === "" && isGenerating) {
                                    return null; // Skip rendering inline empty thinking assistant message
                                 }
                                 const isSpeaking = speakingMessageId === m.id;
                                 return (
                                    <div 
                                       key={m.id} 
                                       className={cn(
                                          "flex w-full gap-2 px-1 sm:gap-3 items-start animate-fade-in group/item select-text", 
                                          m.role === "user" ? "justify-end" : "justify-start"
                                       )}
                                    >
                                       {/* LEFT SIDE: Assistant Profile picture bubble */}
                                       {m.role === "assistant" && (
                                          <motion.div 
                                             className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border overflow-hidden flex items-center justify-center p-0.5 bg-amber-50 dark:bg-amber-950/20 shadow-xs shrink-0 self-start transition-all"
                                             style={{ borderColor: MODE_THEMES[mode].accent }}
                                             whileHover={{ scale: 1.05 }}
                                          >
                                             <img src={saraAvatar} alt="Sara" className="w-full h-full rounded-full object-cover" />
                                          </motion.div>
                                       )}
                                       
                                       <div className={cn("flex flex-col gap-1 max-w-[85%] sm:max-w-[78%] md:max-w-[70%]", m.role === "user" ? "items-end" : "items-start")}>
                                          <div 
                                             onDoubleClick={() => {
                                                handleCopyMessage(m.id, m.content);
                                                playEffects("light");
                                             }}
                                             className={cn(
                                                "px-3.5 py-2.5 rounded-2xl w-full text-xs sm:text-sm leading-relaxed relative group/bb shadow-xs transition-all duration-300 border cursor-pointer select-text break-words overflow-wrap-break-word", 
                                                m.role === "user" 
                                                   ? "text-white rounded-tr-none border-orange-500/10 shadow-[0_2px_8px_rgba(249,115,22,0.06)] bg-gradient-to-r" 
                                                   : theme === "dark" 
                                                      ? "bg-slate-900/80 text-slate-100 rounded-tl-none border-slate-805 hover:bg-slate-850" 
                                                      : "bg-white text-slate-800 rounded-tl-none border-slate-200/55 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300"
                                             )}
                                             style={m.role === "user" ? { 
                                                backgroundImage: `linear-gradient(135deg, ${MODE_THEMES[mode].accent}, ${MODE_THEMES[mode].accent}ee)`
                                             } : undefined}
                                             title="ডাবল ক্লিক করে মেসেজ কপি করুন 💡"
                                          >
                                             {m.attachments && m.attachments.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2 p-0.5 select-none">
                                                   {m.attachments.map((imgSrc, idx) => (
                                                      <motion.img 
                                                         key={idx} 
                                                         src={imgSrc} 
                                                         alt="Attachment" 
                                                         whileHover={{ scale: 1.02 }}
                                                         className="max-w-[130px] max-h-[100px] rounded-lg object-cover cursor-zoom-in border border-black/10 dark:border-white/10 shadow-xs inline-block"
                                                         onClick={() => setSelectedLightboxImage(imgSrc)}
                                                      />
                                                   ))}
                                                </div>
                                             )}
                                             {m.role === "assistant" ? (
                                                <div className="markdown-content prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 font-medium select-text" dangerouslySetInnerHTML={parseThinkingAndSteps(m.content)} />
                                             ) : (
                                                (m.content || m.attachments) && <p className="whitespace-pre-wrap font-semibold tracking-tight leading-relaxed select-text text-inherit">{m.content}</p>
                                             )}

                                             {/* Floating micro copy actions overlay plate */}
                                             <div className={cn(
                                                "absolute bottom-[-15px] opacity-0 group-hover/bb:opacity-100 focus-within:opacity-100 transition-all duration-200 flex items-center gap-1 p-0.5 rounded-lg border shadow-xs z-10 backdrop-blur-md select-none",
                                                m.role === "user" 
                                                   ? "right-2 bg-gradient-to-r from-orange-600 to-amber-600 border-orange-500/10 text-white" 
                                                   : "left-2 bg-white/95 border-slate-150 text-slate-500 dark:bg-slate-900/95 dark:border-slate-800 dark:text-slate-400"
                                             )}>
                                                <button
                                                   type="button"
                                                   onClick={() => handleCopyMessage(m.id, m.content)}
                                                   className="p-1 rounded hover:opacity-80 active:scale-95 transition-transform cursor-pointer"
                                                   title="বার্তাটি কপি করুন"
                                                >
                                                   {copiedMessageId === m.id ? (
                                                      <Check className="w-3 h-3 text-green-500 dark:text-green-400 stroke-[3]" />
                                                   ) : (
                                                      <Copy className="w-3 h-3" />
                                                   )}
                                                </button>

                                                {m.role === "assistant" && (
                                                   <button
                                                      type="button"
                                                      onClick={() => handleSpeakMessage(m.id, m.content)}
                                                      className={cn("p-1 rounded hover:scale-110 active:scale-95 transition-all cursor-pointer",
                                                         isSpeaking ? "text-orange-500 animate-pulse font-black" : "text-slate-550 dark:text-slate-450"
                                                      )}
                                                      title={isSpeaking ? "পড়া বন্ধ করুন" : "মুখে শুনুন 🎙️"}
                                                   >
                                                      {isSpeaking ? (
                                                         <Square className="w-3 h-3 fill-current text-orange-500" />
                                                      ) : (
                                                         <Volume2 className="w-3 h-3" />
                                                      )}
                                                   </button>
                                                )}
                                             </div>
                                          </div>
                                          
                                          {/* Message read tags row */}
                                          <div className="flex items-center gap-1.5 px-2.5 pt-1 text-[8.5px] sm:text-[9.5px] select-none text-slate-400 dark:text-slate-500 font-bold">
                                             <span>
                                                {m.timestamp instanceof Date && !isNaN(m.timestamp.getTime()) 
                                                   ? m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                                   : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                             </span>
                                             {m.role === "user" && (
                                                <DoubleCheck 
                                                   isRead={m.status === "read"} 
                                                   accentColor={MODE_THEMES[mode].accent} 
                                                />
                                             )}
                                             {m.role === "assistant" && (
                                                <DoubleCheck 
                                                   isRead={true} 
                                                   accentColor={m.status === "read" ? MODE_THEMES[mode].accent : "#9ca3af"} 
                                                />
                                             )}
                                          </div>
                                       </div>

                                       {/* RIGHT SIDE: User profile picture bubble */}
                                       {m.role === "user" && (
                                          <motion.div 
                                             className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border overflow-hidden flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 shadow-xs shrink-0 self-start transition-all"
                                             style={{ borderColor: MODE_THEMES[mode].accent }}
                                             whileHover={{ scale: 1.05 }}
                                          >
                                             {userProfilePic ? (
                                                <img src={userProfilePic} alt="User" className="w-full h-full rounded-full object-cover" />
                                             ) : (
                                                <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-black text-xs sm:text-sm">
                                                   {userName ? userName.substring(0, 1).toUpperCase() : <User className="w-3.5 h-3.5" />}
                                                </div>
                                             )}
                                          </motion.div>
                                       )}
                                    </div>
                                 );
                              })}
                              
                              {/* Skeleton shimmer loading thinking feedback */}
                              {isGenerating && activeChat.messages[activeChat.messages.length - 1]?.role === "assistant" && activeChat.messages[activeChat.messages.length - 1]?.content === "" && (
                                 <SkeletonShimmer theme={theme} />
                              )}

                              {/* Live dot bounce typing indicator */}
                              {isGenerating && activeChat.messages[activeChat.messages.length - 1]?.role === "assistant" && activeChat.messages[activeChat.messages.length - 1]?.content !== "" && (
                                 <div className="flex w-full justify-start mt-1 pl-11">
                                    <TypingIndicator theme={theme} botName={botName} />
                                 </div>
                              )}
                           </div>
                        )}
                     </main>

                     {/* Main bottom Floating form Console console */}
                     <div className={cn("shrink-0 p-3 sm:p-4 w-full border-t transition-all duration-300 relative z-20", 
                        isDragging 
                           ? "bg-amber-500/10 dark:bg-amber-500/5 border-amber-500 shadow-lg animate-pulse" 
                           : (theme === "dark" ? "border-slate-800 bg-[#161e31]/95 backdrop-blur-md" : "border-slate-150 bg-white/95 backdrop-blur-md")
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                     >
                        <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 relative">
                           {showScrollBottom && (
                              <button
                                 type="button"
                                 onClick={() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; playEffects("light"); }}
                                 className="absolute -top-14 right-2 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer z-50 animate-bounce"
                                 title="নিচে যান"
                              >
                                 <ArrowDown className="w-4 h-4 stroke-[3.5]" />
                              </button>
                           )}

                           {/* Interactive pre-input suggested quick chips */}
                           {!isGenerating && activeChat && (
                              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 scrollbar-none snap-x select-none">
                                 {MODE_SUGGESTIONS[mode]?.map((chip, idx) => (
                                    <button
                                       key={idx}
                                       type="button"
                                       onClick={() => { setInputValue(chip.text); if (textareaRef.current) textareaRef.current.focus(); playEffects("light"); }}
                                       className={cn("px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border transition-all shrink-0 snap-align-start hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-2xs whitespace-nowrap",
                                          theme === "dark" 
                                             ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" 
                                             : "bg-white border-slate-205 text-slate-605 hover:bg-slate-50"
                                       )}
                                    >
                                       {chip.text}
                                    </button>
                                 ))}
                              </div>
                           )}

                           {/* File preview thumbnails panel */}
                           {attachedFiles.length > 0 && (
                              <div className={cn("flex items-center justify-between gap-2 p-2 rounded-xl mb-1.5 border select-none transition-all duration-200 shadow-2xs",
                                 theme === "dark" ? "bg-slate-950/45 border-slate-800" : "bg-orange-50/20 border-orange-100"
                              )}>
                                 <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-[9px] font-black tracking-widest text-[#f97316]/80 uppercase mr-1">ফাইল সংযুক্ত:</span>
                                    <AnimatePresence>
                                       {attachedFiles.map((src, i) => (
                                          <motion.div 
                                             key={i}
                                             initial={{ opacity: 0, scale: 0.9 }}
                                             animate={{ opacity: 1, scale: 1 }}
                                             exit={{ opacity: 0, scale: 0.9 }}
                                             className="relative w-11 h-11 rounded-lg overflow-hidden border border-orange-200 dark:border-slate-800 shadow-2xs"
                                          >
                                             <img src={src} className="w-full h-full object-cover" alt="Attached" />
                                             <button 
                                                type="button"
                                                onClick={() => removeAttachedFile(i)}
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                                                title="ফাইল বাদ দিন"
                                             >
                                                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                             </button>
                                          </motion.div>
                                       ))}
                                    </AnimatePresence>
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={() => setAttachedFiles([])}
                                    className="px-2 py-1 rounded-md text-[9px] font-black border border-red-200 dark:border-red-950/40 text-red-500 hover:bg-red-55 dark:hover:bg-red-950/25 transition-all duration-200 cursor-pointer shrink-0"
                                 >
                                    সব মুছুন 🗑️
                                 </button>
                              </div>
                           )}

                           {/* Main Input Plate elements wrapper */}
                           <div className="flex items-end gap-2 animate-fade-in">
                              {/* File Input */}
                              <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 onChange={handleFileChange} 
                                 multiple 
                                 accept="image/*" 
                                 className="hidden" 
                              />

                              <div className={cn("flex-1 flex items-end px-3 py-1.5 rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#f97316]/12 shadow-sm",
                                 theme === "dark" 
                                    ? "bg-slate-900 border-slate-800 focus-within:border-[#f97316]/65 text-[#f3f4f6]" 
                                    : "bg-slate-50 border-slate-150 focus-within:border-[#f97316]/60 text-slate-800"
                              )}>
                                 {/* File attachments icon */}
                                 <div className="flex items-center gap-1 pr-1.5 pb-0.5 shrink-0 select-none">
                                    <button 
                                       type="button"
                                       onClick={() => fileInputRef.current?.click()}
                                       className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 border",
                                          attachedFiles.length > 0
                                             ? "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-955/35 dark:border-orange-900/50"
                                             : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-200/40 dark:text-slate-500 dark:hover:text-slate-350 dark:hover:bg-slate-800/45"
                                       )}
                                       title="ছবি আপলোড করুন"
                                    >
                                       <Paperclip className="w-4 h-4 stroke-[2.5]" />
                                    </button>

                                    {/* Mic dictating logic */}
                                    <button 
                                       type="button"
                                       onClick={toggleSpeechRecognition}
                                       className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-205 active:scale-95 border relative",
                                          isListening
                                             ? "bg-red-500/10 border-red-300 text-red-500 dark:bg-red-950/30 dark:border-red-900/40 animate-pulse"
                                             : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-200/40 dark:text-slate-505 dark:hover:text-slate-355 dark:hover:bg-slate-800/45"
                                       )}
                                       title={isListening ? "রেকর্ডিং বন্ধ করুন" : "ভয়েস টাইপিং"}
                                    >
                                       {isListening ? (
                                          <>
                                             <Mic className="w-4 h-4 text-red-500 stroke-[2.5]" />
                                             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-550"></span>
                                             </span>
                                          </>
                                       ) : (
                                          <Mic className="w-4 h-4 stroke-[2.5]" />
                                       )}
                                    </button>
                                 </div>

                                 {/* Multi-line auto expanding textarea input block */}
                                 <div className="flex-1 min-w-0 pr-2">
                                    <textarea
                                       ref={textareaRef}
                                       value={inputValue}
                                       onChange={handleInputChange}
                                       onPaste={handlePaste}
                                       onKeyDown={(e) => {
                                          if (e.key === "Enter" && !e.shiftKey) {
                                             e.preventDefault();
                                             handleSendMessage();
                                          }
                                       }}
                                       placeholder={MODE_PLACEHOLDERS[mode]}
                                       rows={1}
                                       className="w-full resize-none bg-transparent outline-none focus:outline-none py-1 text-xs sm:text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 max-h-[140px] leading-relaxed select-text text-slate-800 dark:text-slate-100"
                                       style={{ border: "none", boxShadow: "none" }}
                                    />
                                 </div>

                                 {/* Text limit indicator */}
                                 <div className="flex items-center gap-1.5 pb-0.5 shrink-0 select-none">
                                    {inputValue.length > 0 && (
                                       <span className={cn("text-[8.5px] font-black px-1.5 py-0.5 rounded-md tracking-wider transition-all",
                                          inputValue.length >= 1300 
                                             ? "bg-red-500/10 text-red-500 font-extrabold" 
                                             : "bg-slate-100 dark:bg-slate-800 text-slate-405 dark:text-slate-505"
                                       )}>
                                          {inputValue.length}/1500
                                       </span>
                                    )}

                                    {inputValue && (
                                       <button
                                          type="button"
                                          onClick={() => { setInputValue(""); if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.focus(); } }}
                                          className="p-1 rounded-md text-slate-400 hover:text-slate-550 dark:text-slate-500 dark:hover:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                                          title="লেখা মুছুন"
                                       >
                                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                       </button>
                                    )}
                                 </div>
                              </div>

                              {/* Send CTA trigger button */}
                              <button
                                 type="button"
                                 onClick={() => handleSendMessage()}
                                 disabled={isGenerating || (!inputValue.trim() && attachedFiles.length === 0)}
                                 className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-md shrink-0 text-white",
                                    (inputValue.trim() || attachedFiles.length > 0)
                                       ? "bg-gradient-to-r from-orange-500 via-[#f97316] to-rose-500 hover:brightness-105 shadow-orange-500/10"
                                       : "bg-slate-105 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none"
                                 )}
                                 title="বার্তা পাঠান"
                              >
                                 <Send className="w-4 h-4 stroke-[3]" />
                              </button>
                           </div>

                           {/* Firestore status toast notification */}
                           <AnimatePresence>
                              {appToast && appToast.visible && (
                                 <motion.div 
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className={cn(
                                       "absolute bottom-24 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2 px-3 py-2.5 rounded-2xl shadow-xl border backdrop-blur-md max-w-[85%] text-xs font-black whitespace-nowrap",
                                       appToast.type === "success" 
                                          ? "bg-slate-900/95 text-green-400 border-green-500/20" 
                                          : appToast.type === "error"
                                             ? "bg-red-95/95 text-red-100 border-red-500/20"
                                             : "bg-slate-900/95 text-orange-400 border-orange-500/20"
                                    )}
                                 >
                                    {appToast.type === "success" ? (
                                       <Check className="w-3.5 h-3.5 stroke-[3.5] text-green-400 shrink-0" />
                                    ) : appToast.type === "error" ? (
                                       <X className="w-3.5 h-3.5 stroke-[3.5] text-red-100 shrink-0 animate-bounce" />
                                    ) : (
                                       <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                    )}
                                    <span>{appToast.message}</span>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}

      {/* Embedded Global Theme Style Overrides */}
      <style>
        {`
        .markdown-content p, .markdown-content span, .markdown-content li, 
        .markdown-content strong, .markdown-content table, .markdown-content td, 
        .markdown-content th { 
          color: inherit !important; 
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3, 
        .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          color: inherit !important; 
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content p { margin-bottom: 0.75rem; font-weight: 500; line-height: 1.65; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content strong { font-weight: 800; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.4); border-radius: 4px; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-bg {
          position: relative;
          overflow: hidden;
        }
        .shimmer-bg::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.6s infinite ease-in-out;
          content: '';
        }
        .dark .shimmer-bg::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.08) 20%,
            rgba(255, 255, 255, 0.15) 60%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
        `}
      </style>

      {/* Lightbox Overlay rendering */}
      <AnimatePresence>
         {selectedLightboxImage && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out"
               onClick={() => setSelectedLightboxImage(null)}
            >
               <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="relative max-w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
               >
                  <img 
                     src={selectedLightboxImage} 
                     alt="Lightbox" 
                     className="max-w-full max-h-[80vh] object-contain rounded-xl select-none animate-fade-in" 
                  />
                  <button
                     onClick={() => setSelectedLightboxImage(null)}
                     className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/95 rounded-full text-white cursor-pointer transition-colors"
                  >
                     <X className="w-5 h-5" />
                  </button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
 
      {/* Dynamic Settings Sidebar overlay */}
      <AnimatePresence>
         {isSettingsOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.5 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-transparent lg:bg-black/40 z-40 backdrop-blur-[1px]"
               onClick={() => {
                  setIsSettingsOpen(false);
                  playEffects("light");
               }}
            />
         )}
         
         {isSettingsOpen && (
            <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 220 }}
               className={cn("absolute right-0 top-0 bottom-0 w-full sm:w-[580px] z-50 flex flex-col shadow-2xl overflow-hidden border-l", 
                  theme === "dark" ? "bg-[#0c111e] border-slate-900" : "bg-white border-slate-205"
               )}
            >
               <div className="flex-1 overflow-hidden relative flex flex-col h-full w-full">
                  <div className={cn("flex-1 overflow-hidden flex flex-col relative", 
                     theme === "dark" ? "bg-[#0c111e]" : "bg-white"
                  )}>
                     <SettingsPanel
                        theme={theme}
                        activeSettingsTab={activeSettingsTab}
                        setActiveSettingsTab={setActiveSettingsTab}
                        setIsSettingsOpen={setIsSettingsOpen}
                        userName={userName}
                        setUserName={setUserName}
                        loveLanguage={loveLanguage}
                        setLoveLanguage={setLoveLanguage}
                        anniversaryDate={anniversaryDate}
                        setAnniversaryDate={setAnniversaryDate}
                        userProfilePic={userProfilePic}
                        changeUserProfilePic={changeUserProfilePic}
                        ONBOARDING_AVATARS={ONBOARDING_AVATARS}
  
                        botName={botName}
                        setBotName={setBotName}
                        aiCreativity={aiCreativity}
                        setAiCreativity={setAiCreativity}
                        customSysPrompts={customSysPrompts}
                        editPromptMode={editPromptMode}
                        setEditPromptMode={setEditPromptMode}
                        promptEditText={promptEditText}
                        setPromptEditText={setPromptEditText}
                        saveCustomPrompt={saveCustomPrompt}
                        resetCustomPrompt={resetCustomPrompt}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        hapticEnabled={hapticEnabled}
                        setHapticEnabled={setHapticEnabled}
                        voiceSpeed={voiceSpeed}
                        setVoiceSpeed={setVoiceSpeed}
                        handleExportData={handleExportData}
                        handleImportData={handleImportData}
                        handleWipeData={handleWipeData}

                        analyzeSentiment={analyzeSentiment}
                        playEffects={playEffects}
                     />
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}