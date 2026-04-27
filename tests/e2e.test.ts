import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { run } from '../src/run.js'
import type { Options } from '../src/types.js'

describe('E2E scaffolding', () => {
  let testDir: string

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'create-wa-stack-test-'))
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should scaffold a minimal project', async () => {
    const options: Options = {
      projectName: 'test-bot',
      features: new Set(['antiban', 'starter']),
      useTypeScript: true,
      initGit: false,
      installDeps: false
    }

    const projectDir = join(testDir, options.projectName)
    await run(options, projectDir)

    // Check essential files exist
    expect(existsSync(join(projectDir, 'package.json'))).toBe(true)
    expect(existsSync(join(projectDir, '.gitignore'))).toBe(true)
    expect(existsSync(join(projectDir, '.env.example'))).toBe(true)
    expect(existsSync(join(projectDir, 'tsconfig.json'))).toBe(true)
    expect(existsSync(join(projectDir, 'README.md'))).toBe(true)
    expect(existsSync(join(projectDir, 'src/index.ts'))).toBe(true)
    expect(existsSync(join(projectDir, 'src/handlers/echo.ts'))).toBe(true)
    expect(existsSync(join(projectDir, 'src/handlers/help.ts'))).toBe(true)
    expect(existsSync(join(projectDir, 'src/handlers/ping.ts'))).toBe(true)

    // Check package.json is valid
    const pkgContent = readFileSync(join(projectDir, 'package.json'), 'utf-8')
    const pkg = JSON.parse(pkgContent)
    expect(pkg.name).toBe('test-bot')
    expect(pkg.dependencies).toHaveProperty('@whiskeysockets/baileys')
    expect(pkg.dependencies).toHaveProperty('baileys-antiban')
  })

  it('should scaffold with all features', async () => {
    const options: Options = {
      projectName: 'full-bot',
      features: new Set(['antiban', 'rest', 'webhooks', 'mcp', 'docker', 'starter']),
      useTypeScript: true,
      initGit: false,
      installDeps: false
    }

    const projectDir = join(testDir, options.projectName)
    await run(options, projectDir)

    // Check feature-specific files
    expect(existsSync(join(projectDir, 'Dockerfile'))).toBe(true)
    expect(existsSync(join(projectDir, 'docker-compose.yml'))).toBe(true)
    expect(existsSync(join(projectDir, '.dockerignore'))).toBe(true)
    expect(existsSync(join(projectDir, 'src/mcp-server.ts'))).toBe(true)

    // Check package.json has all deps
    const pkgContent = readFileSync(join(projectDir, 'package.json'), 'utf-8')
    const pkg = JSON.parse(pkgContent)
    expect(pkg.dependencies).toHaveProperty('baileys-antiban')
    expect(pkg.dependencies).toHaveProperty('baileys-rest')
    expect(pkg.dependencies).toHaveProperty('baileys-webhooks')
    expect(pkg.dependencies).toHaveProperty('baileys-mcp')
  })

  it('should scaffold JavaScript project', async () => {
    const options: Options = {
      projectName: 'js-bot',
      features: new Set(['antiban']),
      useTypeScript: false,
      initGit: false,
      installDeps: false
    }

    const projectDir = join(testDir, options.projectName)
    await run(options, projectDir)

    // Should not have TypeScript files
    expect(existsSync(join(projectDir, 'tsconfig.json'))).toBe(false)
    expect(existsSync(join(projectDir, 'src/index.js'))).toBe(true)

    // Check package.json doesn't have TS deps
    const pkgContent = readFileSync(join(projectDir, 'package.json'), 'utf-8')
    const pkg = JSON.parse(pkgContent)
    expect(pkg.devDependencies).not.toHaveProperty('typescript')
  })

  it('should apply template variables correctly', async () => {
    const options: Options = {
      projectName: 'vars-bot',
      features: new Set(['webhooks']),
      useTypeScript: true,
      initGit: false,
      installDeps: false
    }

    const projectDir = join(testDir, options.projectName)
    await run(options, projectDir)

    // Check README contains project name
    const readme = readFileSync(join(projectDir, 'README.md'), 'utf-8')
    expect(readme).toContain('vars-bot')

    // Check .env.example has webhook config
    const env = readFileSync(join(projectDir, '.env.example'), 'utf-8')
    expect(env).toContain('WEBHOOK_URL')
    expect(env).toContain('WEBHOOK_SECRET')
  })

  it('should only include docker files when docker feature selected', async () => {
    const options: Options = {
      projectName: 'no-docker',
      features: new Set(['antiban']),
      useTypeScript: true,
      initGit: false,
      installDeps: false
    }

    const projectDir = join(testDir, options.projectName)
    await run(options, projectDir)

    expect(existsSync(join(projectDir, 'Dockerfile'))).toBe(false)
    expect(existsSync(join(projectDir, 'docker-compose.yml'))).toBe(false)
  })
})
