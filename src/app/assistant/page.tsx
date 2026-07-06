"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2, Sparkles, HelpCircle, Terminal, HelpCircle as HelpIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "model";
  content: string;
}

const QUICK_PROMPTS = [
  "CSE under ₹80,000 tuition fees",
  "Suggest colleges with 95% placement rates.",
  "List autonomous engineering colleges.",
  "Average salary package at CET Trivandrum?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am your AI Admissions Assistant for **College Discovery**. I can help you search for colleges matching specific branches, budgets, locations, or placements. Ask me anything about engineering colleges in Kerala!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.response },
        ]);
      } else {
        toast.error("Failed to fetch AI response");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-8rem)] min-h-[500px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full items-stretch">
        
        {/* Left: Info Sidebar (1 column, hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm text-xs font-semibold space-y-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div className="w-9 h-9 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wider">AI Companion</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Flash 1.5 Active</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-500 leading-relaxed font-medium">
                Ask questions about placement packages, cutoffs, tuition fees, autonomous status, or coordinates.
              </p>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Terminal className="w-3.5 h-3.5 mr-1" />
                  Quick prompts
                </span>
                <div className="flex flex-col gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left p-3 border border-slate-200 dark:border-slate-850 rounded-xl hover:border-accent-purple hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350 transition-colors cursor-pointer leading-normal font-bold"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border dark:border-slate-800 text-[10px] text-slate-450 leading-relaxed font-bold uppercase tracking-wider">
            Maintains conversation logs to contextualize follow-up questions.
          </div>
        </div>

        {/* Right: Chat Terminal (3 columns) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden h-full">
          
          {/* Scroll Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
            {messages.map((m, index) => {
              const isModel = m.role === "model";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 max-w-[85%] ${
                    isModel ? "self-start" : "self-end flex-row-reverse ml-auto"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                      isModel
                        ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isModel ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs font-semibold border transition-colors shadow-sm leading-relaxed ${
                      isModel
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-250 whitespace-pre-line"
                        : "bg-primary border-primary text-white whitespace-pre-line"
                    }`}
                  >
                    {isModel ? (
                      m.content.split("\n").map((line, lIdx) => {
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const parts: React.ReactNode[] = [];
                        let lastIndex = 0;
                        let match;
                        
                        while ((match = boldRegex.exec(line)) !== null) {
                          parts.push(line.substring(lastIndex, match.index));
                          parts.push(<strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">{match[1]}</strong>);
                          lastIndex = boldRegex.lastIndex;
                        }
                        parts.push(line.substring(lastIndex));

                        return (
                          <p key={lIdx} className={lIdx > 0 ? "mt-2.5" : ""}>
                            {parts.length > 1 ? parts : line}
                          </p>
                        );
                      })
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing skeleton */}
            {loading && (
              <div className="flex items-start gap-4 max-w-[85%] self-start">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-accent-purple/10 text-accent-purple border-accent-purple/20">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-400 flex items-center space-x-2 text-xs font-semibold shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-purple" />
                  <span>Admissions assistant is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask details about CET Trivandrum placements or fees..."
                className="flex-grow px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
