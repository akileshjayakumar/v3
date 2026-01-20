# CLAUDE.md

This file provides guidance for Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This is **Akilesh Jayakumar's Portfolio Website (V3)** - a modern, interactive personal portfolio built with Next.js 14. It showcases projects, experience, education, and features a conversational AI chat interface powered by Groq. Live at [akileshjayakumar.com](https://akileshjayakumar.com).

## Tech Stack

- **Framework:** Next.js 14.2.16 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** Shadcn/ui + Radix UI primitives
- **AI/LLM:** Groq API (llama models)
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel

## Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx           # Main portfolio page
├── layout.tsx         # Root layout with theme provider
├── globals.css        # Global styles and CSS variables
├── chat/page.tsx      # AI chat interface (streaming UI)
├── cv/page.tsx        # Resume/CV page
└── api/chat/route.ts  # Chat API endpoint (Groq integration)

components/            # React components
├── ui/               # Shadcn/ui components (50+ atomic components)
├── theme-provider.tsx
├── theme-toggle.tsx
├── animated-chat-button.tsx
├── chat-fab.tsx
└── cursor-ring.tsx

hooks/                 # Custom React hooks
├── use-mobile.tsx    # Mobile breakpoint detection
└── use-toast.ts      # Toast notifications

lib/                   # Utilities
├── personal-knowledge.ts  # Knowledge base for AI chat
└── utils.ts              # Helper functions

public/                # Static assets (images, logos)
```

## Common Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Environment Variables

Required in `.env.local`:
```
GROQ_API_KEY=<your_groq_api_key>
```

## Key Implementation Details

### Chat API (`app/api/chat/route.ts`)
- Streaming responses via Server-Sent Events (SSE)
- Uses Groq's `/openai/v1/chat/completions` API
- System prompt pulls from `lib/personal-knowledge.ts`
- Response caching for duplicate queries
- Web search integration via Groq compound model

### Styling
- Dark/light mode via class-based toggle
- CSS variables (HSL) for theming in `globals.css`
- Path alias: `@/*` maps to root directory

### Build Configuration
- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Image optimization enabled (WebP format)

## Coding Guidelines

- Use TypeScript with strict mode
- Follow existing component patterns in `components/ui/`
- Use Shadcn/ui components where possible
- Keep streaming logic in client components (`"use client"`)
- API routes handle server-side operations
