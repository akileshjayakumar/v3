"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Copy,
  Check,
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  Search,
  Globe,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Array<{ title?: string; url: string }>;
  reasoning?: string[];
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
    const sourcesLines = (srcIdx === -1 ? [] : lines.slice(srcIdx + 1)).filter(
      (l) => l.length > 0
    );

    // Improved formatting for better readability
    let body = "";
    if (bodyLines.length > 0) {
      // Check if content already has proper formatting
      const hasBulletsAlready = bodyLines.some((l) => /^[-*•]\s/.test(l));
      const hasNumberedList = bodyLines.some((l) => /^\d+\.\s/.test(l));

      if (!hasBulletsAlready && !hasNumberedList && bodyLines.length >= 3) {
        // Format as bullet points for better readability
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I'm Akilesh. Ask me anything about my interests, projects, and work. I can search the web too.",
      createdAt: Date.now(),
    },
  ]);
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
    "What are your hobbies?",
    "What is the latest news in AI?",
  ];

  useEffect(() => {
    setSuggestions(initialSuggestions);
  }, []);

  const composerRef = useRef<HTMLDivElement | null>(null);

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
                "Based on our conversation, suggest 4 varied follow-up questions I could ask. Make them concise, relevant, and non-repetitive. Output as a JSON array of strings.",
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
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
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              chat with me
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6"
        >
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-gray-100 to-gray-200"
                  )}
                >
                  {m.role === "user" ? (
                    <span className="text-white text-xs sm:text-base font-medium">
                      U
                    </span>
                  ) : (
                    <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-gray-700" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "group relative max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%]",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-4 shadow-sm transition-all break-words",
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-100"
                    )}
                  >
                    {m.content ? (
                      <div
                        className={cn(
                          "prose prose-xs sm:prose-sm lg:prose-base max-w-none break-words leading-relaxed",
                          m.role === "user"
                            ? "prose-invert prose-p:my-1.5 sm:prose-p:my-2 prose-li:my-1 prose-p:text-white prose-li:text-white prose-strong:text-white prose-headings:text-white prose-a:text-blue-100 prose-p:break-words prose-li:break-words prose-p:leading-relaxed"
                            : [
                                "prose-p:my-2 sm:prose-p:my-3 prose-li:my-1.5 sm:prose-li:my-2",
                                "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
                                "prose-headings:font-semibold prose-headings:text-gray-900",
                                "prose-h1:text-base sm:prose-h1:text-lg prose-h2:text-sm sm:prose-h2:text-base prose-h3:text-xs sm:prose-h3:text-sm",
                                "prose-strong:text-gray-900 prose-strong:font-semibold",
                                "prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600",
                                "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm",
                                "prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:p-3 sm:prose-pre:p-4",
                                "prose-p:break-words prose-li:break-words prose-a:break-words prose-p:leading-relaxed",
                              ].join(" ")
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, className, ...props }) => (
                              <a
                                {...props}
                                className={cn(
                                  "break-words hover:underline font-medium",
                                  m.role === "user"
                                    ? "text-blue-100"
                                    : "text-blue-600",
                                  className
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                            p: (props) => {
                              const { children, className, ...rest } =
                                props as any;
                              const parts: React.ReactNode[] = [];
                              React.Children.toArray(children ?? []).forEach(
                                (child: any, idx: number) => {
                                  if (typeof child === "string") {
                                    const segments = child.split("\n");
                                    segments.forEach((seg, j) => {
                                      if (j > 0) {
                                        parts.push(
                                          <br key={`p-br-${idx}-${j}`} />
                                        );
                                      }
                                      parts.push(seg);
                                    });
                                  } else {
                                    parts.push(child);
                                  }
                                }
                              );
                              return (
                                <p
                                  {...rest}
                                  className={cn(
                                    "whitespace-pre-wrap leading-relaxed",
                                    m.role === "user"
                                      ? "text-white"
                                      : "text-gray-800",
                                    className
                                  )}
                                >
                                  {parts}
                                </p>
                              );
                            },
                            li: (props) => (
                              <li
                                {...props}
                                className={cn(
                                  "leading-relaxed marker:font-medium",
                                  m.role === "user"
                                    ? "text-white marker:text-blue-200"
                                    : "text-gray-800 marker:text-blue-500"
                                )}
                              />
                            ),
                            ul: (props) => (
                              <ul
                                {...props}
                                className="space-y-2 my-4 list-disc list-inside"
                              />
                            ),
                            ol: (props) => (
                              <ol
                                {...props}
                                className="space-y-2 my-4 list-decimal list-inside"
                              />
                            ),
                            h1: (props) => (
                              <h1
                                {...props}
                                className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0"
                              />
                            ),
                            h2: (props) => (
                              <h2
                                {...props}
                                className="text-base font-semibold text-gray-900 mt-5 mb-2 first:mt-0"
                              />
                            ),
                            h3: (props) => (
                              <h3
                                {...props}
                                className="text-sm font-semibold text-gray-900 mt-4 mb-2 first:mt-0"
                              />
                            ),
                            strong: (props) => (
                              <strong
                                {...props}
                                className="font-semibold text-gray-900"
                              />
                            ),
                            blockquote: (props) => (
                              <blockquote
                                {...props}
                                className="border-l-4 border-gray-200 pl-4 italic text-gray-600 my-4"
                              />
                            ),
                            code: (props) => (
                              <code
                                {...props}
                                className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                              />
                            ),
                            pre: (props) => (
                              <pre
                                {...props}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto my-4"
                              />
                            ),
                          }}
                        >
                          {m.role === "assistant"
                            ? formatAssistantContent(m.content)
                            : m.content}
                        </ReactMarkdown>
                      </div>
                    ) : m.id === pendingMessageId &&
                      (isGenerating ||
                        status === "searching" ||
                        status === "receiving_results") ? (
                      <div className="flex items-center gap-2">
                        {status === "searching" ? (
                          <>
                            <div className="relative">
                              <Search className="w-4 h-4 text-blue-500" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              searching the web...
                            </span>
                          </>
                        ) : status === "receiving_results" ? (
                          <>
                            <div className="relative">
                              <Globe className="w-4 h-4 text-green-500 animate-spin" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">
                                Receiving
                              </span>
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                results
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-500">
                              Thinking...
                            </span>
                          </>
                        )}
                      </div>
                    ) : null}

                    {/* Citations */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm font-semibold text-gray-700">
                            Sources
                          </p>
                        </div>
                        <div className="space-y-3">
                          {m.citations.map((citation, idx) => (
                            <a
                              key={idx}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 group"
                            >
                              <img
                                src={getFavicon(citation.url)}
                                alt=""
                                className="w-5 h-5 rounded flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-relaxed flex-1 min-w-0">
                                <span className="truncate block">
                                  {citation.title ||
                                    new URL(citation.url).hostname}
                                </span>
                                <span className="text-xs text-gray-500 truncate block">
                                  {new URL(citation.url).hostname}
                                </span>
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-4 h-4 text-gray-400">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Copy button */}
                  {m.role === "assistant" && m.content && (
                    <button
                      aria-label="Copy message"
                      className={cn(
                        "absolute -top-1 -right-1 sm:-top-2 sm:-right-2 opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-200",
                        "w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200",
                        "flex items-center justify-center shadow-sm",
                        "hover:bg-gray-50"
                      )}
                      onClick={() => handleCopy(m.id, m.content)}
                    >
                      {copiedMessageId === m.id ? (
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {suggestions.length > 0 && !isSubmitting && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="w-full max-w-full">
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 text-center">
                    Suggested questions:
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center px-2 sm:px-4">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="px-3 py-2 text-xs sm:text-sm rounded-full border border-gray-200 
                                 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900
                                 transition-all duration-200 hover:shadow-sm break-words text-left
                                 max-w-full sm:max-w-none sm:whitespace-nowrap"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto p-3 sm:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onComposerKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full min-h-[56px] sm:min-h-[60px] max-h-32 resize-none rounded-2xl border border-gray-200
                         bg-gray-50 px-4 sm:px-6 py-4 pr-14 text-gray-900 placeholder:text-gray-500
                         focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !input.trim()}
                className={cn(
                  "absolute right-2 bottom-2 w-10 h-10 rounded-full p-0",
                  "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                  "text-white shadow-sm transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover:shadow-md active:scale-95"
                )}
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
