import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavHeader } from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Leaf, Send, User, Bot, Sparkles, RotateCcw, ArrowLeft
} from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED_QUESTIONS = [
  "What strains are best for high-yield indoor cultivation?",
  "Which terpenes indicate a premium flower for dispensaries?",
  "What nutrients should I prioritize during the flowering stage?",
  "How do I identify the right harvest window for maximum THC?",
  "What are the compliance requirements for cross-state transport?",
  "Which seed varieties perform best in humid climates?",
];

export default function NorrisAdvisor() {
  const { isAuthenticated, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ask = trpc.norris.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setIsTyping(false);
    },
    onError: () => {
      toast.error("Norris is unavailable right now. Please try again.");
      setIsTyping(false);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);
    ask.mutate({
      message: text.trim(),
      history: messages.slice(-10), // last 10 messages for context
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — clean login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <NavHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-green-900/50">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meet Norris</h1>
            <p className="text-slate-400 max-w-md">
              ZAPPAY's expert cannabis strain advisor. Get personalized guidance on strains,
              cultivation, compliance, and marketplace strategy — exclusively for ZAPPAY members.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-5 text-base"
              onClick={() => { window.location.href = getLoginUrl(); }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Sign In to Talk to Norris
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-5 text-base">
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-slate-600 text-xs max-w-xs">
            Create a free ZAPPAY account to access Norris and all marketplace features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <NavHeader />
      <Toaster position="top-right" richColors />

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 py-4 border-b border-slate-700/50">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">Norris</div>
              <div className="text-green-400 text-xs">Cannabis Strain Advisor</div>
            </div>
          </div>
          <Badge className="ml-auto bg-green-900/50 text-green-400 border-green-800 text-xs">
            ZAPPAY AI
          </Badge>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => setMessages([])}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-6 pt-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-xl shadow-green-900/40">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Ask Norris anything</h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Expert guidance on strains, cultivation, compliance, and the ZAPPAY marketplace.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm text-slate-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-xl px-4 py-3 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-green-500 to-emerald-700"
                    : "bg-slate-700"
                }`}>
                  {msg.role === "assistant"
                    ? <Leaf className="h-4 w-4 text-white" />
                    : <User className="h-4 w-4 text-slate-300" />
                  }
                </div>
                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "assistant"
                    ? "bg-slate-800 text-slate-100 rounded-tl-sm"
                    : "bg-green-700 text-white rounded-tr-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-700/50 pt-3">
          <div className="flex gap-2 items-end bg-slate-800 rounded-2xl border border-slate-700 px-4 py-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Norris about strains, cultivation, compliance…"
              className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 resize-none min-h-[40px] max-h-32 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              rows={1}
              disabled={isTyping}
            />
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-500 text-white rounded-xl shrink-0 h-9 w-9 p-0"
              disabled={!input.trim() || isTyping}
              onClick={() => sendMessage(input)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-600 text-center mt-2">
            Norris provides general guidance only. Always verify compliance with your state's cannabis regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
