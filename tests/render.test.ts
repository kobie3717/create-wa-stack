import { describe, it, expect } from 'vitest'
import { applyTemplate, stripTpl } from '../src/render.js'
import type { TemplateVars } from '../src/types.js'

describe('applyTemplate', () => {
  const baseVars: TemplateVars = {
    projectName: 'test-bot',
    port: '3000',
    withAntiban: true,
    withRest: false,
    withWebhooks: false,
    withMcp: false,
    withN8n: false,
    withDocker: false,
    withStarter: true,
    withTypeScript: true
  }

  it('should replace simple variables', () => {
    const template = 'Project: {{projectName}}, Port: {{port}}'
    const result = applyTemplate(template, baseVars)
    expect(result).toBe('Project: test-bot, Port: 3000')
  })

  it('should handle if blocks when true', () => {
    const template = '{{#if withAntiban}}Anti-ban enabled{{/if}}'
    const result = applyTemplate(template, baseVars)
    expect(result).toBe('Anti-ban enabled')
  })

  it('should handle if blocks when false', () => {
    const template = '{{#if withRest}}REST enabled{{/if}}'
    const result = applyTemplate(template, baseVars)
    expect(result).toBe('')
  })

  it('should handle if-else blocks', () => {
    const template = '{{#if withRest}}REST{{else}}No REST{{/if}}'
    const result = applyTemplate(template, baseVars)
    expect(result).toBe('No REST')
  })

  it('should handle nested conditions', () => {
    const template = `
{{#if withAntiban}}
import { wrapSocket } from 'baileys-antiban'
{{/if}}
{{#if withRest}}
import { createRest } from 'baileys-rest'
{{/if}}
    `.trim()
    const result = applyTemplate(template, baseVars)
    expect(result).toContain("import { wrapSocket } from 'baileys-antiban'")
    expect(result).not.toContain('baileys-rest')
  })
})

describe('stripTpl', () => {
  it('should remove .tpl suffix', () => {
    expect(stripTpl('index.ts.tpl')).toBe('index.ts')
    expect(stripTpl('package.json.tpl')).toBe('package.json')
  })

  it('should leave files without .tpl unchanged', () => {
    expect(stripTpl('index.ts')).toBe('index.ts')
    expect(stripTpl('.gitignore')).toBe('.gitignore')
  })
})
