# Portfolio Website V3

Personal portfolio built with Next.js, featuring projects, experience, and an AI chat page that answers questions as me.

Live site: [https://akileshjayakumar.com](https://akileshjayakumar.com)

## Quick Start

```bash
npm install
# create .env.local and set GROQ_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core Features

- Responsive portfolio homepage with project highlights and contact links
- Dedicated `/cv` page
- Dedicated `/chat` page with streaming AI responses
- Light and dark theme toggle

## Configuration

Required environment variable:

```bash
GROQ_API_KEY=your_groq_api_key
```

The chat API route (`/api/chat`) returns an error if this value is missing.

## Usage

- Visit `/` for the portfolio
- Visit `/cv` for resume content
- Visit `/chat` to ask questions and get streaming responses with citations when available

## Development

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Contributing

1. Create a feature branch.
2. Make changes and run `npm run lint`.
3. Open a pull request with a short summary and test notes.

## License

[MIT](LICENSE)
