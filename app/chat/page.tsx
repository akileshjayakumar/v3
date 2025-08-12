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

    const hasBulletsAlready = bodyLines.some((l) => /^[-*]\s/.test(l));
    let body = "";
    if (!hasBulletsAlready && bodyLines.length >= 3) {
      body = `${bodyLines[0]}\n\n${bodyLines
        .slice(1)
        .map((l) => `- ${l}`)
        .join("\n")}`;
    } else {
      body = bodyLines.join("\n");
    }

    const sources = sourcesLines.length
      ? `\n\n**Sources**\n${sourcesLines.map((l) => `- ${l}`).join("\n")}`
      : "";
    return body + sources;
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
        <div className="max-w-3xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
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
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status indicator */}
            {(status === "searching" || status === "receiving_results") && (
              <div className="flex justify-center animate-in fade-in-0 duration-300">
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-sm shadow-sm search-pulse">
                  {status === "searching" ? (
                    <>
                      <div className="relative">
                        <Search className="w-4 h-4 web-search" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="animate-pulse">Searching</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="animate-pulse">the web</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <Globe className="w-4 h-4 animate-spin" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="animate-pulse">Receiving</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="animate-pulse">results</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-gray-100 to-gray-200"
                  )}
                >
                  {m.role === "user" ? (
                    <span className="text-white text-sm font-medium">U</span>
                  ) : (
                    <Sparkles className="w-4 h-4 text-gray-700" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "group relative max-w-[80%] sm:max-w-[70%]",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 shadow-sm transition-all",
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-100"
                    )}
                  >
                    {m.content ? (
                      <div
                        className={cn(
                          "prose prose-sm max-w-none",
                          m.role === "user"
                            ? "prose-invert prose-p:my-2 prose-li:my-1"
                            : "prose-p:my-2 prose-li:my-1 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, className, ...props }) => (
                              <a
                                {...props}
                                className={cn(
                                  "break-words hover:underline",
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
                                    "whitespace-pre-wrap",
                                    className
                                  )}
                                >
                                  {parts}
                                </p>
                              );
                            },
                          }}
                        >
                          {m.role === "assistant"
                            ? formatAssistantContent(m.content)
                            : m.content}
                        </ReactMarkdown>
                      </div>
                    ) : m.id === pendingMessageId && isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">
                          Thinking...
                        </span>
                      </div>
                    ) : null}

                    {/* Citations */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                        <div className="space-y-1">
                          {m.citations.map((citation, idx) => (
                            <a
                              key={idx}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                            >
                              <img
                                src={getFavicon(citation.url)}
                                alt=""
                                className="w-4 h-4 rounded"
                              />
                              <span className="truncate">
                                {citation.title ||
                                  new URL(citation.url).hostname}
                              </span>
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
                        "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-200",
                        "w-8 h-8 rounded-full bg-white border border-gray-200",
                        "flex items-center justify-center shadow-sm",
                        "hover:bg-gray-50"
                      )}
                      onClick={() => handleCopy(m.id, m.content)}
                    >
                      {copiedMessageId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {suggestions.length > 0 && !isSubmitting && (
              <div className="flex justify-center mt-4">
                <div className="inline-block">
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="px-3 py-1.5 text-sm rounded-full border border-gray-200 
                                 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900
                                 transition-all duration-200 hover:shadow-sm"
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
          <div className="max-w-3xl mx-auto p-4">
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
                className="w-full min-h-[56px] max-h-32 resize-none rounded-2xl border border-gray-200
                         bg-gray-50 px-4 py-4 pr-14 text-gray-900 placeholder:text-gray-500
                         focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-200"
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
