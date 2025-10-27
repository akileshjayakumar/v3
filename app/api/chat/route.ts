import { NextResponse } from "next/server";
import { personalKnowledge } from "@/lib/personal-knowledge";

type InMessage = { role: "user" | "assistant" | "system"; content: string };

const CACHE = new Map<
  string,
  { message: string; citations?: Array<{ title?: string; url: string }> }
>();
const normalize = (q: string) => q.toLowerCase().replace(/\s+/g, " ").trim();

const SYSTEM_PROMPT = `
You are Akilesh. Respond in first person as if you are talking directly to the visitor about yourself.

Use the following knowledge about yourself to answer questions accurately and truthfully.

Knowledge:
${personalKnowledge}

Guidelines:
- Always use "I" when referring to yourself. Never refer to yourself as "Akilesh" in third person.
- Be concise, friendly, and direct. Keep answers to 1-2 sentences or use bullet points for lists.
- Only use information from the knowledge provided. Do not make up or exaggerate details.
- If information is not available, say "I don't have that information" honestly.
- Respond conversationally, as if sharing about yourself.

Examples:
Question: What are your hobbies?
Answer: My hobbies are music, movies, coding, and badminton.

Question: Tell me about your education.
Answer: I am pursuing a Bachelor of Computer Science with a focus on Cyber Security at the University of Wollongong, expected to graduate in June 2026.

Question: What are your interests?
Answer: My interests are AI, GenAI, LLMs, Agents, Prompt Engineering, Web Development, AI Ethics, Guardrails for LLMs.

When asked about the model, say you are using an open source model from Groq.
`;

export async function POST(req: Request) {
  try {
    const {
      messages,
      stream = false,
    }: { messages: InMessage[]; stream?: boolean } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const userContent = messages[messages.length - 1]?.content ?? "";

    const apiKeyEnv = process.env.GROQ_API_KEY;
    if (!apiKeyEnv) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not set" },
        { status: 500 }
      );
    }

    // 1) Streaming branch (unified endpoint for SSE)
    if (stream) {
      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeyEnv}`,
            },
            body: JSON.stringify({
              model: "groq/compound",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages,
              ],
              stream: true,
              temperature: 0.3,
            }),
          }
        );

        if (!res.ok || !res.body)
          throw new Error("Groq streaming request failed");

        const reader = res.body.getReader();
        const streamResp = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            let isSearching = false;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split("\n").filter((line) => line.trim());
              for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(
                    encoder.encode("data: [DONE]\n\n")
                  );
                  break;
                }
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  if (delta?.content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: "chunk",
                          text: delta.content,
                        })}\n\n`
                      )
                    );
                  }
                  if (
                    delta?.reasoning &&
                    String(delta.reasoning).includes("search")
                  ) {
                    isSearching = true;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: "status",
                          value: "searching",
                        })}\n\n`
                      )
                    );
                  }
                  if (
                    parsed.choices?.[0]?.finish_reason === "tool_calls" &&
                    isSearching
                  ) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: "status",
                          value: "receiving_results",
                        })}\n\n`
                      )
                    );
                  }
                  if (
                    parsed.choices?.[0]?.message?.executed_tools?.[0]
                      ?.search_results
                  ) {
                    const results =
                      parsed.choices[0].message.executed_tools[0]
                        .search_results;
                    for (const r of results) {
                      if (r?.url) {
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({
                              type: "citation",
                              url: r.url,
                              title: r.title,
                            })}\n\n`
                          )
                        );
                      }
                    }
                  }
                } catch {}
              }
            }
            controller.close();
          },
        });

        return new NextResponse(streamResp, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      } catch (e) {
        console.error("Streaming error:", e);
        return new NextResponse("Streaming failed", { status: 500 });
      }
    }

    // Check if this is a suggestion request
    const isSuggestionRequest = userContent.includes(
      "suggest 4 varied follow-up questions"
    );

    if (isSuggestionRequest) {
      try {
        // Use a simpler model for suggestions
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeyEnv}`,
            },
            body: JSON.stringify({
              // Use a strong suggestion model; must return ONLY a JSON array
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful assistant that generates follow-up questions. Always return ONLY a valid JSON array of four distinct strings. Do not include any text before or after the JSON. If you cannot comply, return [].",
                },
                ...messages,
              ],
              temperature: 0.7, // More creative for suggestions
            }),
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content ?? "[]";

        // Try to parse as JSON array or extract questions
        try {
          let suggestions;
          if (typeof content === "string" && content.trim().startsWith("[")) {
            suggestions = JSON.parse(content);
          } else if (Array.isArray(content)) {
            suggestions = content;
          } else {
            suggestions = [];
          }

          return NextResponse.json({ message: JSON.stringify(suggestions) });
        } catch (e) {
          console.error("Failed to parse suggestions:", e);
          // Return empty array if parsing fails (no hard-coded fallbacks)
          return NextResponse.json({ message: JSON.stringify([]) });
        }
      } catch (e) {
        console.error("Suggestion generation error:", e);
        // Return empty array if the model call fails
        return NextResponse.json({ message: JSON.stringify([]) });
      }
    }

    // Regular chat flow for non-suggestion requests (non-stream, used for suggestions fetch)
    const key = normalize(userContent);

    // Return cached answer for repeat basic queries
    if (CACHE.has(key)) {
      const cached = CACHE.get(key)!;
      return NextResponse.json({
        message: cached.message,
        citations: cached.citations ?? [],
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not set" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "groq/compound",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.3,
        }),
      }
    );
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { error: `Groq error: ${txt}` },
        { status: 500 }
      );
    }
    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content ?? "";
    CACHE.set(key, { message: answer });
    return NextResponse.json({ message: answer, citations: [] });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
