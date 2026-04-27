import { createMcpServer } from 'baileys-mcp'

async function start() {
  const server = await createMcpServer({
    authDir: process.env.WA_AUTH_DIR ?? './wa-auth',
    apiKey: process.env.API_KEY!
  })

  await server.listen()
  console.log('🦀 MCP server started')
}

start().catch(console.error)
