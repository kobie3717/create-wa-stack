import type { Options } from './types.js'

export function buildDependencies(options: Options): Record<string, string> {
  const deps: Record<string, string> = {
    '@whiskeysockets/baileys': '^6.7.8'
  }

  if (options.features.has('antiban')) {
    deps['baileys-antiban'] = '^0.1.0'
  }

  if (options.features.has('webhooks')) {
    deps['baileys-webhooks'] = '^0.1.0'
  }

  if (options.features.has('rest')) {
    deps['baileys-rest'] = '^0.1.0'
  }

  if (options.features.has('mcp')) {
    deps['baileys-mcp'] = '^0.1.0'
  }

  if (options.features.has('n8n')) {
    deps['n8n-nodes-baileys-antiban'] = '^0.1.0'
  }

  return deps
}

export function buildDevDependencies(options: Options): Record<string, string> {
  const devDeps: Record<string, string> = {}

  if (options.useTypeScript) {
    devDeps['typescript'] = '^5.3.3'
    devDeps['@types/node'] = '^20.11.19'
    devDeps['tsx'] = '^4.7.1'
  }

  return devDeps
}

export function buildScripts(options: Options): Record<string, string> {
  const scripts: Record<string, string> = {}

  if (options.useTypeScript) {
    scripts['build'] = 'tsc'
    scripts['dev'] = 'tsx watch src/index.ts'
    scripts['start'] = 'node dist/index.js'
  } else {
    scripts['dev'] = 'node --watch src/index.js'
    scripts['start'] = 'node src/index.js'
  }

  return scripts
}
