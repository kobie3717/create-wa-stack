import type { TemplateVars } from './types.js'

/**
 * Simple template renderer supporting:
 * - {{variable}} substitution
 * - {{#if condition}}...{{/if}} blocks
 * - {{#if condition}}...{{else}}...{{/if}} blocks
 */
export function applyTemplate(content: string, vars: TemplateVars): string {
  let result = content

  // Handle conditionals first
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, condition, block) => {
    // Check for {{else}}
    const parts = block.split(/\{\{else\}\}/)
    const truthyBlock = parts[0] || ''
    const falsyBlock = parts[1] || ''

    const value = vars[condition as keyof TemplateVars]
    return value ? truthyBlock : falsyBlock
  })

  // Handle simple variable substitution
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = vars[key as keyof TemplateVars]
    return String(value ?? '')
  })

  return result
}

/**
 * Get file extension based on TypeScript flag
 */
export function getExtension(filename: string, useTypeScript: boolean): string {
  if (!useTypeScript && filename.endsWith('.ts')) {
    return filename.replace(/\.ts$/, '.js')
  }
  return filename
}

/**
 * Strip .tpl suffix from filename
 */
export function stripTpl(filename: string): string {
  return filename.replace(/\.tpl$/, '')
}
