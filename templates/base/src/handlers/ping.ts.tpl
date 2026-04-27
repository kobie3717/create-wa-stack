import type { WASocket, proto } from '@whiskeysockets/baileys'

export async function pingHandler(sock: WASocket, message: proto.IWebMessageInfo) {
  if (!message.key.remoteJid) return

  await sock.sendMessage(message.key.remoteJid, {
    text: '🏓 Pong!'
  })
}
