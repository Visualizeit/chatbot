# Chatbot

A modern, production-ready chatbot application built with TanStack Start, oRPC, and Drizzle ORM.

## Tech Stack

- **TanStack Start** - Full-stack React framework with SSR
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict type safety
- **Mantine UI** - Component library with custom theme
- **Tailwind CSS** - Utility-first CSS framework
- **oRPC** - Type-safe RPC for building APIs
- **Drizzle ORM** - Next-generation TypeScript ORM
- **SQLite (LibSQL)** - Fast, lightweight database
- **Vite** - Next-generation build tool
- **Biome** - Fast linting and formatting

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/en) (LTS version recommended)
- [pnpm](https://pnpm.io)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Visualizeit/chatbot
cd chatbot
```

2. Copy the environment variables file:

```sh
cp .env.example .env
```

3. Update the `.env` file with your credentials:

- `NVIDIA_AI_API_KEY`: Your NVIDIA AI interface API key.
- `DB_FILE_NAME`: Database file path (e.g., `file:chatbot.db`).

4. Install dependencies:

```sh
pnpm install
```

5. Start the development server:

```sh
pnpm dev
```

## Available Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `pnpm dev`           | Start development server with HMR         |
| `pnpm build`         | Build for production with SSR             |
| `pnpm start`         | Start production server                   |
| `pnpm drizzle:push`  | Push database schema changes to SQLite    |
| `pnpm check`         | Run linter and formatter checks           |
| `pnpm fix`           | Auto-fix linting and formatting issues    |

## Project Structure

```
src/
├── apis/                # oRPC API definitions and client
├── components/          # React components (chat, prompt input, etc.)
├── configs/             # Theme and configuration files
├── db/                  # Drizzle schema and database setup
├── routes/              # File-based routing
├── router.ts            # Router setup
└── app.css              # Global styles
```

## Features

- File-based routing with type-safe navigation
- Server-side rendering (SSR) via Nitro
- Type-safe API layer with oRPC
- Database management with Drizzle ORM
- Custom Mantine theme with Tailwind integration
- Hot Module Replacement (HMR)
- Git hooks for code quality (auto-format on commit)
- Path aliases (`@/*` imports)
- TypeScript strict mode

## Customization

- **Theme**: Modify `src/configs/mantineTheme.ts`
- **Colors**: Update brand colors in the theme configuration
- **Schema**: Update database models in `src/db/schema.ts`
