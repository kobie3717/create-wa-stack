# {{projectName}}

Production-ready WhatsApp bot scaffolded with [create-wa-stack](https://github.com/kobie3717/create-wa-stack).

## Features

{{#if withAntiban}}
- ✅ Anti-ban protection (rate limiting + warmup)
{{/if}}
{{#if withRest}}
- ✅ REST API for sending messages
{{/if}}
{{#if withWebhooks}}
- ✅ Webhooks for event forwarding
{{/if}}
{{#if withMcp}}
- ✅ MCP server for AI agent integration
{{/if}}
{{#if withN8n}}
- ✅ n8n adapter for no-code workflows
{{/if}}
{{#if withStarter}}
- ✅ Starter handlers (/help, /ping, echo)
{{/if}}

## Quick Start

1. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and set your API_KEY
   ```

2. **{{#if withTypeScript}}Build and run{{else}}Run{{/if}}**:
   ```bash
   {{#if withTypeScript}}
   npm run build
   npm run dev
   {{else}}
   npm run dev
   {{/if}}
   ```

3. **Scan QR code** with WhatsApp on your phone

{{#if withDocker}}
## Docker Deployment

```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```
{{/if}}

{{#if withRest}}
## REST API

Send a message:
```bash
curl -X POST http://localhost:{{port}}/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "27123456789@s.whatsapp.net",
    "message": "Hello from {{projectName}}!"
  }'
```
{{/if}}

{{#if withWebhooks}}
## Webhooks

All WhatsApp events are forwarded to the webhook URL configured in `.env`.

Example webhook payload:
```json
{
  "event": "messages.upsert",
  "data": { ... }
}
```
{{/if}}

{{#if withMcp}}
## MCP Server

Claude or Cursor can interact with WhatsApp via the MCP server.

Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "{{projectName}}": {
      "command": "node",
      "args": ["dist/mcp-server.js"]
    }
  }
}
```
{{/if}}

## Documentation

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp library
{{#if withAntiban}}
- [baileys-antiban](https://github.com/kobie3717/baileys-antiban) - Anti-ban protection
{{/if}}
{{#if withRest}}
- [baileys-rest](https://github.com/kobie3717/baileys-rest) - REST API
{{/if}}
{{#if withWebhooks}}
- [baileys-webhooks](https://github.com/kobie3717/baileys-webhooks) - Webhooks
{{/if}}
{{#if withMcp}}
- [baileys-mcp](https://github.com/kobie3717/baileys-mcp) - MCP server
{{/if}}

## License

MIT
