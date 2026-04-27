import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { Options, Feature } from './types.js'

export async function promptForOptions(initialName?: string): Promise<Options | null> {
  p.intro(pc.bgCyan(pc.black(' create-wa-stack v0.1.0 ')))

  const projectName = await p.text({
    message: 'Project name:',
    placeholder: 'my-wa-bot',
    initialValue: initialName,
    validate: (value) => {
      if (!value) return 'Project name is required'
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Project name must only contain lowercase letters, numbers, and hyphens'
      }
    }
  })

  if (p.isCancel(projectName)) {
    p.cancel('Operation cancelled')
    return null
  }

  const features = await p.multiselect({
    message: 'Which features?',
    options: [
      { value: 'antiban' as Feature, label: 'Anti-ban (rate limit + warmup) — recommended', hint: 'baileys-antiban' },
      { value: 'rest' as Feature, label: 'REST API (HTTP endpoints for sending)', hint: 'baileys-rest' },
      { value: 'webhooks' as Feature, label: 'Webhooks (event forwarding to your URLs)', hint: 'baileys-webhooks' },
      { value: 'mcp' as Feature, label: 'MCP server (Claude/Cursor agents can call WA)', hint: 'baileys-mcp' },
      { value: 'n8n' as Feature, label: 'n8n adapter (no-code workflows)', hint: 'n8n-nodes-baileys-antiban' },
      { value: 'docker' as Feature, label: 'Docker (Dockerfile + docker-compose.yml)', hint: 'production deployment' },
      { value: 'starter' as Feature, label: 'Starter handlers (echo, /help, /ping)', hint: 'example code' }
    ],
    initialValues: ['antiban', 'rest', 'webhooks', 'docker', 'starter'] as Feature[],
    required: false
  })

  if (p.isCancel(features)) {
    p.cancel('Operation cancelled')
    return null
  }

  const useTypeScript = await p.confirm({
    message: 'Use TypeScript?',
    initialValue: true
  })

  if (p.isCancel(useTypeScript)) {
    p.cancel('Operation cancelled')
    return null
  }

  const initGit = await p.confirm({
    message: 'Initialize git?',
    initialValue: true
  })

  if (p.isCancel(initGit)) {
    p.cancel('Operation cancelled')
    return null
  }

  const installDeps = await p.confirm({
    message: 'Install dependencies now?',
    initialValue: true
  })

  if (p.isCancel(installDeps)) {
    p.cancel('Operation cancelled')
    return null
  }

  return {
    projectName: projectName as string,
    features: new Set(features as Feature[]),
    useTypeScript: useTypeScript as boolean,
    initGit: initGit as boolean,
    installDeps: installDeps as boolean
  }
}
