"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2, MessageSquare, Sparkles, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "model";
  content: string;
}

const QUICK_PROMPTS = [
  "I need CSE under ₹80,000",
  "Suggest colleges with 95% placements.",
  "Best autonomous colleges in Kerala.",
  "What is the average package at CET Trivandrum?",
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

  // Auto-scroll to bottom of chat
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
        toast.error("Failed to fetch response");
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
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      
      {/* Header Info */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <Bot className="w-10 h-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-xl" />
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center">
            Admissions AI Companion
            <span className="ml-2.5 bg-indigo-150 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-850">
              Live Flash 1.5
            </span>
          </h1>
          <p className="text-xs text-slate-450 dark:text-slate-400">
            Maintains context to discuss fees, seat counts, coordinates, or branch pathways.
          </p>
        </div>
      </div>

      {/* Messages Terminal Scroll */}
      <div className="flex-grow overflow-y-auto py-6 space-y-6 px-1">
        {messages.map((m, index) => {
          const isModel = m.role === "model";
          return (
            <div
              key={index}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                isModel ? "self-start" : "self-end flex-row-reverse ml-auto"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                  isModel
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border-indigo-100 dark:border-indigo-900/30"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-550 border-slate-200 dark:border-slate-700"
                }`}
              >
                {isModel ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm text-sm border transition-colors ${
                  isModel
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line"
                    : "bg-blue-600 border-blue-600 text-white font-medium whitespace-pre-line"
                }`}
              >
                {isModel ? (
                  // Support simple bold markdown formatting
                  m.content.split("\n").map((line, lIdx) => {
                    // Quick bold parser
                    let cleanLine = line;
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    let match;
                    const parts: React.ReactNode[] = [];
                    let lastIndex = 0;
                    
                    while ((match = boldRegex.exec(line)) !== null) {
                      parts.push(line.substring(lastIndex, match.index));
                      parts.push(<strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">{match[1]}</strong>);
                      lastIndex = boldRegex.lastIndex;
                    }
                    parts.push(line.substring(lastIndex));

                    return (
                      <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                        {parts.length > 1 ? parts : cleanLine}
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

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-start gap-3.5 max-w-[85%] self-start">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30 text-indigo-500">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 flex items-center space-x-2 text-sm shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer input block & Quick Prompts */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 space-y-4">
        
        {/* Quick Suggestion buttons */}
        {messages.length === 1 && !loading && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              Suggestions to ask
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => sendMessage(prompt)}
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Text Form */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your admissions question here..."
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl shadow-md shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}
