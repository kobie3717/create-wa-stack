import { describe, it, expect } from 'vitest'
import { buildDependencies, buildDevDependencies, buildScripts } from '../src/deps.js'
import type { Options } from '../src/types.js'

describe('buildDependencies', () => {
  it('should always include baileys', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const deps = buildDependencies(options)
    expect(deps).toHaveProperty('@whiskeysockets/baileys')
  })

  it('should include antiban when selected', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(['antiban']),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const deps = buildDependencies(options)
    expect(deps).toHaveProperty('baileys-antiban')
  })

  it('should include all features when selected', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(['antiban', 'rest', 'webhooks', 'mcp', 'n8n']),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const deps = buildDependencies(options)
    expect(deps).toHaveProperty('baileys-antiban')
    expect(deps).toHaveProperty('baileys-rest')
    expect(deps).toHaveProperty('baileys-webhooks')
    expect(deps).toHaveProperty('baileys-mcp')
    expect(deps).toHaveProperty('n8n-nodes-baileys-antiban')
  })

  it('should not include features not selected', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(['antiban']),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const deps = buildDependencies(options)
    expect(deps).not.toHaveProperty('baileys-rest')
    expect(deps).not.toHaveProperty('baileys-webhooks')
  })
})

describe('buildDevDependencies', () => {
  it('should include typescript deps when using TS', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const devDeps = buildDevDependencies(options)
    expect(devDeps).toHaveProperty('typescript')
    expect(devDeps).toHaveProperty('@types/node')
    expect(devDeps).toHaveProperty('tsx')
  })

  it('should not include typescript deps when using JS', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(),
      useTypeScript: false,
      initGit: true,
      installDeps: true
    }
    const devDeps = buildDevDependencies(options)
    expect(devDeps).not.toHaveProperty('typescript')
  })
})

describe('buildScripts', () => {
  it('should have build script for TypeScript', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(),
      useTypeScript: true,
      initGit: true,
      installDeps: true
    }
    const scripts = buildScripts(options)
    expect(scripts).toHaveProperty('build')
    expect(scripts.dev).toContain('tsx')
  })

  it('should use node --watch for JavaScript', () => {
    const options: Options = {
      projectName: 'test',
      features: new Set(),
      useTypeScript: false,
      initGit: true,
      installDeps: true
    }
    const scripts = buildScripts(options)
    expect(scripts).not.toHaveProperty('build')
    expect(scripts.dev).toContain('node --watch')
  })
})
