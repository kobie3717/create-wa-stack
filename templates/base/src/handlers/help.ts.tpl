import type { WASocket, proto } from '@whiskeysockets/baileys'

export async function helpHandler(sock: WASocket, message: proto.IWebMessageInfo) {
  if (!message.key.remoteJid) return

  const helpText = `
🦀 *{{projectName}} Help*

Available commands:
• /ping - Check if bot is alive
• /help - Show this help message

All other messages are echoed back.
  `.trim()

  await sock.sendMessage(message.key.remoteJid, {
    text: helpText
  })
}
