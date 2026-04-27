# 🦀 create-wa-stack

Production-ready WhatsApp bots in 30 seconds. Like `create-next-app` for the WhatsApp ecosystem.

## Quick Start

```bash
npm create wa-stack my-bot
```

Or with npx:

```bash
npx create-wa-stack my-bot
```

Or with yarn:

```bash
yarn create wa-stack my-bot
```

## What You Get

A fully-configured WhatsApp bot with:

- ⚡ **Modern Stack**: TypeScript/JavaScript, ESM, Node 18+
- 🛡️ **Anti-ban Protection**: Rate limiting + warmup strategies (optional)
- 🌐 **REST API**: HTTP endpoints for sending messages (optional)
- 🪝 **Webhooks**: Forward events to your URLs (optional)
- 🤖 **MCP Server**: Claude/Cursor agent integration (optional)
- 🔌 **n8n Adapter**: No-code workflow automation (optional)
- 🐳 **Docker Ready**: Dockerfile + docker-compose.yml (optional)
- 📝 **Starter Handlers**: `/help`, `/ping`, echo examples (optional)

## Features

All powered by the [Baileys ecosystem](https://github.com/WhiskeySockets/Baileys):

- [baileys-antiban](https://github.com/kobie3717/baileys-antiban) - Anti-ban protection
- [baileys-rest](https://github.com/kobie3717/baileys-rest) - REST API server
- [baileys-webhooks](https://github.com/kobie3717/baileys-webhooks) - Event webhooks
- [baileys-mcp](https://github.com/kobie3717/baileys-mcp) - Model Context Protocol server
- [n8n-nodes-baileys-antiban](https://github.com/kobie3717/n8n-nodes-baileys-antiban) - n8n integration

## Usage

### Interactive Mode

```bash
npx create-wa-stack my-bot
```

You'll be prompted to select:
- Project name
- Features to include
- TypeScript or JavaScript
- Git initialization
- Dependency installation

### Non-Interactive Mode

Use defaults (antiban + rest + webhooks + docker + starter):

```bash
npx create-wa-stack my-bot --yes
```

Custom features:

```bash
npx create-wa-stack my-bot --features antiban,rest,mcp --no-docker
```

Skip installation:

```bash
npx create-wa-stack my-bot --no-install
```

### CLI Options

```
--yes, -y              Use defaults (skip prompts)
--features <list>      Comma-separated: antiban,rest,webhooks,mcp,n8n,docker,starter
--template <name>      Preset template (coming in v0.2)
--no-docker            Skip Docker files
--no-typescript        Use JavaScript instead of TypeScript
--no-git               Skip git initialization
--no-install           Skip npm install
--force                Overwrite existing directory
--help, -h             Show help
```

## After Scaffolding

```bash
cd my-bot
cp .env.example .env
# Edit .env and set your API_KEY
npm run dev
```

Scan the QR code with WhatsApp on your phone, and you're live!

## Docker Deployment

```bash
docker-compose up -d
```

## Customization

The scaffolded project is fully yours to modify:

- Add handlers in `src/handlers/`
- Configure environment in `.env`
- Adjust rate limits in anti-ban config
- Add custom middleware
- Integrate with databases, queues, etc.

## Examples

### Minimal Bot (TypeScript + Anti-ban)

```bash
npx create-wa-stack simple-bot --features antiban,starter
```

### Full Production Bot

```bash
npx create-wa-stack prod-bot --features antiban,rest,webhooks,docker
```

### AI Agent Integration

```bash
npx create-wa-stack ai-bot --features antiban,mcp
```

## Roadmap

- v0.2: More templates (auctioneer, customer-support, AI-bot)
- v0.3: Web UI scaffolder (dashboard + admin panel)
- v0.4: Monorepo workspace support

## Contributing

Issues and PRs welcome at [github.com/kobie3717/create-wa-stack](https://github.com/kobie3717/create-wa-stack).

## License

MIT

## Author

Kobus Wentzel ([@kobie3717](https://github.com/kobie3717))
