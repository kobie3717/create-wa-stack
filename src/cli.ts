#!/usr/bin/env node
import { parseArgs } from 'node:util'
import validatePackageName from 'validate-npm-package-name'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { Options, Feature } from './types.js'
import { promptForOptions } from './prompts.js'
import { run } from './run.js'

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      yes: { type: 'boolean', short: 'y' },
      features: { type: 'string' },
      template: { type: 'string' },
      'no-docker': { type: 'boolean' },
      'no-typescript': { type: 'boolean' },
      'no-git': { type: 'boolean' },
      'no-install': { type: 'boolean' },
      force: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' }
    },
    allowPositionals: true
  })

  if (values.help) {
    console.log(`
${pc.cyan('create-wa-stack')} - Production WhatsApp bot scaffolder

Usage:
  ${pc.cyan('npm create wa-stack')} [project-name] [options]
  ${pc.cyan('npx create-wa-stack')} [project-name] [options]

Options:
  ${pc.dim('--yes, -y')}              Use defaults (skip prompts)
  ${pc.dim('--features <list>')}      Comma-separated features
  ${pc.dim('--template <name>')}      Preset template (future)
  ${pc.dim('--no-docker')}            Skip Docker files
  ${pc.dim('--no-typescript')}        Use JavaScript instead of TypeScript
  ${pc.dim('--no-git')}               Skip git initialization
  ${pc.dim('--no-install')}           Skip npm install
  ${pc.dim('--force')}                Overwrite existing directory
  ${pc.dim('--help, -h')}             Show this help

Features:
  antiban, rest, webhooks, mcp, n8n, docker, starter

Examples:
  ${pc.cyan('npm create wa-stack my-bot')}
  ${pc.cyan('npx create-wa-stack my-bot --yes')}
  ${pc.cyan('npx create-wa-stack my-bot --features antiban,rest,mcp')}
`)
    process.exit(0)
  }

  const projectName = positionals[0]

  // Non-interactive mode
  if (values.yes) {
    if (!projectName) {
      console.error(pc.red('Error: project name required in non-interactive mode'))
      process.exit(1)
    }

    const validation = validatePackageName(projectName)
    if (!validation.validForNewPackages) {
      console.error(pc.red(`Error: invalid project name "${projectName}"`))
      if (validation.errors) {
        validation.errors.forEach(err => console.error(pc.red(`  - ${err}`)))
      }
      process.exit(1)
    }

    const features = new Set<Feature>()

    if (values.features) {
      const featuresArray = values.features.split(',').map(f => f.trim())
      featuresArray.forEach(f => {
        if (['antiban', 'rest', 'webhooks', 'mcp', 'n8n', 'docker', 'starter'].includes(f)) {
          features.add(f as Feature)
        }
      })
    } else {
      // Defaults
      features.add('antiban')
      features.add('rest')
      features.add('webhooks')
      if (!values['no-docker']) {
        features.add('docker')
      }
      features.add('starter')
    }

    if (values['no-docker']) {
      features.delete('docker')
    }

    const options: Options = {
      projectName,
      features,
      useTypeScript: !values['no-typescript'],
      initGit: !values['no-git'],
      installDeps: !values['no-install']
    }

    await run(options)
    return
  }

  // Interactive mode
  const options = await promptForOptions(projectName)

  if (!options) {
    process.exit(0)
  }

  const validation = validatePackageName(options.projectName)
  if (!validation.validForNewPackages) {
    p.cancel(`Invalid project name "${options.projectName}"`)
    if (validation.errors) {
      validation.errors.forEach(err => console.error(pc.red(`  - ${err}`)))
    }
    process.exit(1)
  }

  await run(options)
}

main().catch((error) => {
  console.error(pc.red('Error:'), error)
  process.exit(1)
})
