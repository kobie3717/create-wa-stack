import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Manifest } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function loadManifest(): Manifest {
  const manifestPath = join(__dirname, '../templates/manifest.json')
  const content = readFileSync(manifestPath, 'utf-8')
  return JSON.parse(content) as Manifest
}
