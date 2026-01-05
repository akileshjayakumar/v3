"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Search,
  Globe,
  ArrowUp,
  Bot,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Array<{ title?: string; url: string }>;
  createdAt?: number;
};

export default function ChatPage() {
  const formatAssistantContent = (raw: string): string => {
    if (!raw) return "";
    const lines = raw.split("\n").map((l) => l.trim());
    const srcIdx = lines.findIndex((l) => /^sources?:/i.test(l));
    const bodyLines = (srcIdx === -1 ? lines : lines.slice(0, srcIdx)).filter(
      (l) => l.length > 0
    );

    let body = "";
    if (bodyLines.length > 0) {
      const hasBulletsAlready = bodyLines.some((l) => /^[-*•]\s/.test(l));
      const hasNumberedList = bodyLines.some((l) => /^\d+\.\s/.test(l));

      if (!hasBulletsAlready && !hasNumberedList && bodyLines.length >= 3) {
        body = `${bodyLines[0]}\n\n${bodyLines
          .slice(1)
          .map((l) => `• ${l}`)
          .join("\n")}`;
      } else {
        body = bodyLines.join("\n");
      }
    }

    return body;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "thinking" | "searching" | "generating" | "receiving_results"
  >("idle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const getFavicon = (url: string): string => {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?sz=32&domain=${u.hostname}`;
    } catch {
      return `https://www.google.com/s2/favicons?sz=32&domain=${url}`;
    }
  };

  const initialSuggestions = [
    "What is your name?",
    "Tell me about your projects",
    "What's the latest news in AI?",
  ];

  useEffect(() => {
    setSuggestions(initialSuggestions);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (override?: string) => {
    const trimmed = (override ?? input).trim();
    if (!trimmed || isSubmitting) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSubmitting(true);
    setStatus("thinking");
    let assistantContentLocal = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({
            role,
            content,
          })),
          stream: true,
        }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      const pendingId = crypto.randomUUID();
      setPendingMessageId(pendingId);
      let cited: Array<{ title?: string; url: string }> = [];
      setMessages((prev) => [
        ...prev,
        {
          id: pendingId,
          role: "assistant",
          content: "",
          createdAt: Date.now(),
        },
      ]);
      setIsGenerating(true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const parts = acc.split("\n\n");
        acc = parts.pop() ?? "";
        for (const p of parts) {
          if (!p.startsWith("data:")) continue;
          const json = p.slice(5).trim();
          if (json === "[DONE]") continue;
          try {
            const evt = JSON.parse(json);
            if (evt.type === "status") {
              if (
                evt.value === "searching" ||
                evt.value === "receiving_results"
              ) {
                setStatus(evt.value);
                setIsGenerating(false);
              } else if (evt.value === "generating") {
                setIsGenerating(true);
              } else {
                setStatus("idle");
                setIsGenerating(false);
              }
            } else if (evt.type === "chunk") {
              setStatus("idle");
              setIsGenerating(false);
              assistantContentLocal += evt.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === pendingId
                    ? { ...m, content: (m.content ?? "") + evt.text }
                    : m
                )
              );
            } else if (evt.type === "citation") {
              cited.push({ title: evt.title, url: evt.url });
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === pendingId ? { ...m, citations: [...cited] } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I ran into an issue answering that. Please try again.",
        },
      ]);
    } finally {
      // Generate follow-up suggestions
      try {
        const sugRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: trimmed },
              { role: "assistant", content: assistantContentLocal },
            ].concat({
              role: "user",
              content:
                "Based on our conversation, suggest 3 varied follow-up questions I could ask. Make them concise, relevant, and non-repetitive. Output as a JSON array of strings.",
            }),
            stream: false,
          }),
        });

        if (sugRes.ok) {
          const sugData = await sugRes.json();
          try {
            const parsedSuggestions = JSON.parse(sugData.message || "[]");
            setSuggestions(
              Array.isArray(parsedSuggestions)
                ? parsedSuggestions.slice(0, 3)
                : []
            );
          } catch (e) {
            console.error("Failed to parse suggestions:", e);
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error("Error generating suggestions:", e);
        setSuggestions([]);
      }

      setIsSubmitting(false);
      setStatus("idle");
      setPendingMessageId(null);
      setIsGenerating(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch {}
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white dark:bg-[#171717] flex flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 dark:border-[#f2f1ec]/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-[#f2f1ec]/70 hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </a>
          <h1 className="text-base font-semibold text-gray-900 dark:text-[#f2f1ec]">
            Chat with Me
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto h-full">
          {/* Centered Welcome Screen - shown when no messages */}
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-[#f2f1ec] mb-3">
                  What can I help with?
                </h2>
                <p className="text-gray-500 dark:text-[#f2f1ec]/60 text-sm">
                  Ask about my work, projects, or interests. I can also search
                  the web! 🌐
                </p>
              </div>

              {/* Suggestion chips */}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="px-4 py-2 text-sm rounded-full border border-gray-200 dark:border-[#f2f1ec]/20
                               bg-white dark:bg-[#242424] text-gray-700 dark:text-[#f2f1ec]
                               hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#f2f1ec]/30
                               transition-all"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Conversation Messages */
            <div className="space-y-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* AI Icon - only show for assistant */}
                  {m.role === "assistant" && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-[#2a2a2a] flex items-center justify-center mt-0.5">
                      <Bot className="w-4 h-4 text-gray-600 dark:text-[#f2f1ec]" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "group relative",
                      m.role === "user"
                        ? "max-w-[80%] sm:max-w-[70%]"
                        : "flex-1 max-w-[calc(100%-3rem)]"
                    )}
                  >
                    {/* User message - bubble style */}
                    {m.role === "user" && (
                      <div className="inline-block rounded-2xl px-4 py-2.5 bg-black dark:bg-[#f2f1ec] text-white dark:text-[#171717] text-sm">
                        {m.content}
                      </div>
                    )}

                    {/* Assistant message - no bubble, ChatGPT style */}
                    {m.role === "assistant" && (
                      <>
                        {m.content ? (
                          <div className="text-gray-900 dark:text-[#f2f1ec] text-sm leading-relaxed">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                ),
                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-gray-900 dark:text-[#f2f1ec]">
                                    {children}
                                  </strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic">{children}</em>
                                ),
                                li: ({ children }) => (
                                  <li className="mb-2 pl-1">{children}</li>
                                ),
                                ul: ({ children }) => (
                                  <ul className="my-3 ml-1 space-y-1 list-disc list-outside pl-5">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="my-3 ml-1 space-y-1 list-decimal list-outside pl-5">
                                    {children}
                                  </ol>
                                ),
                                h1: ({ children }) => (
                                  <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-gray-900 dark:text-[#f2f1ec]">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base font-bold mb-2 mt-4 first:mt-0 text-gray-900 dark:text-[#f2f1ec]">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-[#f2f1ec]">
                                    {children}
                                  </h3>
                                ),
                                code: ({ children, className }) => {
                                  const isInline = !className;
                                  return isInline ? (
                                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-[#2a2a2a] rounded text-sm font-mono">
                                      {children}
                                    </code>
                                  ) : (
                                    <code className={className}>
                                      {children}
                                    </code>
                                  );
                                },
                                pre: ({ children }) => (
                                  <pre className="my-3 p-4 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg overflow-x-auto text-sm">
                                    {children}
                                  </pre>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="my-3 pl-4 border-l-2 border-gray-300 dark:border-[#f2f1ec]/30 italic text-gray-600 dark:text-[#f2f1ec]/80">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {formatAssistantContent(m.content)}
                            </ReactMarkdown>
                          </div>
                        ) : m.id === pendingMessageId &&
                          (isGenerating ||
                            status === "searching" ||
                            status === "receiving_results" ||
                            status === "thinking") ? (
                          <div className="flex items-center gap-2 text-gray-500 dark:text-[#f2f1ec]/60 text-sm">
                            {status === "searching" ? (
                              <>
                                <Search className="w-4 h-4 animate-pulse" />
                                <span>Searching the web...</span>
                              </>
                            ) : status === "receiving_results" ? (
                              <>
                                <Globe className="w-4 h-4 animate-spin" />
                                <span>Reading results...</span>
                              </>
                            ) : (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Thinking...</span>
                              </>
                            )}
                          </div>
                        ) : null}

                        {/* Citations */}
                        {m.citations && m.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-[#f2f1ec]/10">
                            <p className="text-xs font-medium text-gray-500 dark:text-[#f2f1ec]/50 mb-2">
                              Sources
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {m.citations.map((citation, idx) => (
                                <a
                                  key={idx}
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 dark:bg-[#242424] rounded-full text-gray-700 dark:text-[#f2f1ec]/80 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors"
                                >
                                  <img
                                    src={getFavicon(citation.url)}
                                    alt=""
                                    className="w-3.5 h-3.5 rounded"
                                  />
                                  <span className="truncate max-w-[150px]">
                                    {citation.title ||
                                      new URL(citation.url).hostname}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Copy button */}
                        {m.content && (
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 dark:text-[#f2f1ec]/40 hover:text-gray-600 dark:hover:text-[#f2f1ec]/60 flex items-center gap-1"
                          >
                            {copiedMessageId === m.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* User Icon - only show for user */}
                  {m.role === "user" && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-black dark:bg-[#f2f1ec] flex items-center justify-center mt-0.5">
                      <User className="w-4 h-4 text-white dark:text-[#171717]" />
                    </div>
                  )}
                </div>
              ))}

              {/* Suggested Questions - show after conversation starts */}
              {suggestions.length > 0 && !isSubmitting && (
                <div className="pt-4">
                  <p className="text-xs text-gray-500 dark:text-[#f2f1ec]/50 mb-2 text-center">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="px-3 py-1.5 text-xs rounded-full border border-gray-200 dark:border-[#f2f1ec]/20
                                 bg-white dark:bg-[#242424] text-gray-700 dark:text-[#f2f1ec]
                                 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#f2f1ec]/30
                                 transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-gray-200 dark:border-[#f2f1ec]/10 bg-white dark:bg-[#171717] p-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-300 dark:border-[#f2f1ec]/20 
                       bg-white dark:bg-[#1a1a1a] px-4 py-3 pr-12
                       text-gray-900 dark:text-[#f2f1ec] placeholder:text-gray-400 dark:placeholder:text-[#f2f1ec]/40
                       focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-[#f2f1ec]/50 focus:border-transparent
                       text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting || !input.trim()}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center",
                "bg-gray-900 dark:bg-[#f2f1ec] text-white dark:text-[#171717]",
                "hover:bg-gray-800 dark:hover:bg-[#f2f1ec]/90 transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-gray-400 dark:text-[#f2f1ec]/40 mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
