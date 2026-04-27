import type { WASocket, proto } from '@whiskeysockets/baileys'

export async function echoHandler(sock: WASocket, message: proto.IWebMessageInfo, text: string) {
  if (!message.key.remoteJid) return

  await sock.sendMessage(message.key.remoteJid, {
    text: `Echo: ${text}`
  })
}
