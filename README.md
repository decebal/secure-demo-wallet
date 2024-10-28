
<div align="center">
	<h1 align="center"><b>Secure Demo Wallet</b></h1>
</div>
<div align="center">
    <br />
    <a href="#whats-included"><strong>What's included</strong></a> ·
    <a href="#prerequisites"><strong>Prerequisites</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
</div>

## Used an open-source starter kit based on Midday: What's included

[Next.js](https://nextjs.org/) - Framework<br>
[Turborepo](https://turbo.build) - Build system<br>
[Biome](https://biomejs.dev) - Linter, formatter<br>
[TailwindCSS](https://tailwindcss.com/) - Styling<br>
[Shadcn](https://ui.shadcn.com/) - UI components<br>
[TypeScript](https://www.typescriptlang.org/) - Type safety<br>
[Sentry](https://sentry.io/) - Error handling/monitoring<br>
[react-safe-action](https://next-safe-action.dev) - Validated Server Actions<br>
[nuqs](https://nuqs.47ng.com/) - Type-safe search params state manager<br>
[next-themes](https://next-themes-example.vercel.app/) - Theme manager<br>
[taskfile](https://taskfile.dev/installation/) - Taskfile<br>

## Directory Structure

```
.
├── apps                         # App workspace
│    ├── web                     # Marketing site
│    └── wallet-api              # Backend for user storage and wallet api
├── packages                     # Shared packages between apps
│    └── ui                      # Shared UI components (Shadcn)
├── tooling                      # are the shared configuration that are used by the apps and packages
│    └── typescript              # Shared TypeScript configuration
├── .cursorrules                 # Cursor rules specific to this project
├── biome.json                   # Biome configuration
├── turbo.json                   # Turbo configuration
├── Taskfile.yml                 # Taskfile configuration
├── LICENSE.md
└── README.md
```

## Prerequisites

Bun<br>
Docker<br>
Taskfile<br>

## Getting Started

1. Install dependencies using bun:

```sh
bun i
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
# Copy .env.example to .env for each app
cp apps/web/.env.example apps/web/.env
cp apps/wallet-api/.env.example apps/wallet-api/.env
```

4. Start the development server from taskfile:

```sh
task dev
```

# Project Status: Work in Progress
