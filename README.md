# Chatbot

A full-stack chat application built with TanStack Start, Mantine, and SQLite, with server-side streaming responses powered by an OpenAI-compatible model endpoint.

## Tech Stack

- **TanStack Start** - Full-stack React framework with SSR
- **React 19** - UI library
- **TypeScript** - Type safety
- **Mantine UI** - Primary component library
- **Tailwind CSS** - Utility-first styling
- **Drizzle ORM** - Database ORM
- **SQLite** - Local persistence
- **oRPC** - Type-safe API layer
- **Vite+** - Dev, build, lint, and format workflow
- **Oxlint / Oxfmt** - Linting and formatting via `vp check`

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/en) (LTS version recommended)
- [pnpm](https://pnpm.io)
- [Vite+](https://viteplus.dev/)

### Environment Variables

Copy `.env.example` to `.env` and set values as needed:

```sh
DB_FILE_NAME=file:chatbot.db
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=your_base_url
OPENAI_MODEL_ID=your_model_id
```

### Installation

1. Clone the repository:

```sh
git clone <your-repository-url>
cd chatbot
```

2. Install dependencies:

```sh
pnpm install
```

3. Start the development server:

```sh
pnpm dev
```

## Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start development server with HMR       |
| `pnpm build`        | Build for production with SSR           |
| `pnpm start`        | Start production server                 |
| `pnpm check`        | Run Vite+ linting and formatting checks |
| `pnpm fix`          | Auto-fix linting and formatting issues  |
| `pnpm drizzle:push` | Push Drizzle schema changes             |

## Features

- Chat UI at `/chat`
- SQLite-backed session persistence
- Server-side streaming chat responses
- OpenAI-compatible model provider configuration via environment variables
