import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
{{#if withAntiban}}
import { wrapSocket } from 'baileys-antiban'
{{/if}}
{{#if withWebhooks}}
import { wrapWithWebhooks } from 'baileys-webhooks'
{{/if}}
{{#if withRest}}
import { createBaileysRest } from 'baileys-rest'
{{/if}}
{{#if withStarter}}
import { echoHandler } from './handlers/echo.js'
import { helpHandler } from './handlers/help.js'
import { pingHandler } from './handlers/ping.js'
{{/if}}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(process.env.WA_AUTH_DIR ?? './wa-auth')

  const raw = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  raw.ev.on('creds.update', saveCreds)

  {{#if withAntiban}}
  const sock = wrapSocket(raw, { preset: 'moderate' })
  {{else}}
  const sock = raw
  {{/if}}

  {{#if withWebhooks}}
  wrapWithWebhooks(sock, {
    endpoints: [
      {
        url: process.env.WEBHOOK_URL ?? 'http://localhost:9000',
        secret: process.env.WEBHOOK_SECRET ?? 'change-me',
        events: '*'
      }
    ]
  })
  {{/if}}

  {{#if withRest}}
  const rest = await createBaileysRest({
    authDir: process.env.WA_AUTH_DIR ?? './wa-auth',
    apiKey: process.env.API_KEY!,
    {{#if withAntiban}}
    withAntiban: true,
    {{/if}}
    port: Number(process.env.PORT ?? {{port}})
  })
  await rest.listen()
  console.log(`REST API listening on port ${process.env.PORT ?? {{port}}}`)
  {{/if}}

  {{#if withStarter}}
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      if (m.key.fromMe) continue

      const text = (m.message?.conversation ?? m.message?.extendedTextMessage?.text ?? '').trim()

      if (text === '/ping') {
        return pingHandler(sock, m)
      }

      if (text === '/help') {
        return helpHandler(sock, m)
      }

      return echoHandler(sock, m, text)
    }
  })
  {{/if}}

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Connection closed. Reconnecting:', shouldReconnect)
      if (shouldReconnect) {
        start()
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp connected')
    }
  })

  console.log('🦀 {{projectName}} started')
}

start().catch(console.error)
