"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Array<{ title?: string; url: string }>;
  reasoning?: string[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I’m Akilesh. Ask me anything about my interests, projects, or anything else.",
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
  const initialSuggestions = [
    "What is your name?",
    "What is the latest news in AI?",
    "What are your hobbies?",
    "What are you working on?",
  ];

  // Show initial suggestions on first load
  useEffect(() => {
    setSuggestions(initialSuggestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleSend = async (override?: string) => {
    const trimmed = (override ?? input).trim();
    if (!trimmed || isSubmitting) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSubmitting(true);
    setStatus("thinking");
    // capture assistant text across try/finally for suggestion generation
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
      // assistantContentLocal declared outside try/finally
      setMessages((prev) => [
        ...prev,
        { id: pendingId, role: "assistant", content: "" },
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
      // Generate new suggestions (AI-only after first view)
      try {
        const sugRes = await fetch("/api/chat", {
          // Use non-streaming route
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
            stream: false, // Explicitly request non-streaming
          }),
        });

        if (sugRes.ok) {
          const sugData = await sugRes.json();
          try {
            // Parse the suggestions
            const parsedSuggestions = JSON.parse(sugData.message || "[]");
            setSuggestions(
              Array.isArray(parsedSuggestions) ? parsedSuggestions : []
            );
          } catch (e) {
            console.error("Failed to parse suggestions:", e);
            setSuggestions([]);
          }
        } else {
          // Fallback if request fails
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

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chat</h1>
          <Button variant="outline" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to site
            </a>
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="border border-gray-200 rounded-lg bg-white h-[70vh] sm:h-[72vh] overflow-y-auto p-5 sm:p-6 space-y-5"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-3 text-base sm:text-[0.95rem] leading-relaxed",
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-p:my-1.5">
                  {m.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  ) : m.id === pendingMessageId ? (
                    <>
                      {status === "searching" && (
                        <p className="text-gray-500 italic">
                          Searching the web...
                        </p>
                      )}
                      {status === "receiving_results" && (
                        <p className="text-gray-500 italic">
                          Receiving web results...
                        </p>
                      )}
                      {isGenerating && (
                        <div className="flex space-x-1">
                          <span className="animate-pulse">.</span>
                          <span className="animate-pulse delay-100">.</span>
                          <span className="animate-pulse delay-200">.</span>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
                {m.reasoning && m.reasoning.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-2">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Reasoning
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
                      {m.reasoning.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-2">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Sources
                    </div>
                    <ul className="space-y-1 text-xs">
                      {m.citations.map((c, idx) => (
                        <li key={idx}>
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                            title={c.title ?? c.url}
                          >
                            {c.title ?? c.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything..."
          />
          <Button onClick={() => handleSend()} disabled={isSubmitting}>
            {isSubmitting ? "Thinking..." : "Send"}
          </Button>
        </div>
        <div className="mt-4">
          {suggestions.length > 0 && (
            <div className="text-xl font-semibold text-gray-600 mb-2">
              Suggested questions
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleSend(sug);
                }}
                type="button"
              >
                {sug}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
