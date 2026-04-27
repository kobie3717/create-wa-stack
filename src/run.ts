import { join, dirname } from 'node:path'
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { Options, TemplateVars } from './types.js'
import { loadManifest } from './manifest.js'
import { buildDependencies, buildDevDependencies, buildScripts } from './deps.js'
import { applyTemplate, stripTpl, getExtension } from './render.js'
import { initGit } from './git.js'
import { installDependencies } from './install.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function run(options: Options, targetDir?: string): Promise<void> {
  const projectDir = targetDir || join(process.cwd(), options.projectName)

  // Check if directory exists
  if (existsSync(projectDir)) {
    p.cancel(`Directory ${pc.cyan(options.projectName)} already exists`)
    process.exit(1)
  }

  const s = p.spinner()
  s.start('Creating project')

  // Create project directory
  mkdirSync(projectDir, { recursive: true })

  // Load manifest
  const manifest = loadManifest()

  // Build template variables
  const vars: TemplateVars = {
    projectName: options.projectName,
    port: '3000',
    withAntiban: options.features.has('antiban'),
    withRest: options.features.has('rest'),
    withWebhooks: options.features.has('webhooks'),
    withMcp: options.features.has('mcp'),
    withN8n: options.features.has('n8n'),
    withDocker: options.features.has('docker'),
    withStarter: options.features.has('starter'),
    withTypeScript: options.useTypeScript
  }

  const templatesDir = join(__dirname, '../templates')
  let fileCount = 0

  // Copy and process files based on manifest
  for (const templateFile of manifest.files) {
    // Check if file should be included based on features
    if (templateFile.features && templateFile.features.length > 0) {
      const hasFeature = templateFile.features.some(f => options.features.has(f))
      if (!hasFeature) continue
    }

    // Check TypeScript condition
    if (templateFile.condition === 'typescript' && !options.useTypeScript) continue
    if (templateFile.condition === 'javascript' && options.useTypeScript) continue

    const srcPath = join(templatesDir, templateFile.path)

    // Strip template directory prefix (base/, docker/, mcp/)
    let relativePath = templateFile.path
    relativePath = relativePath.replace(/^base\//, '')
    relativePath = relativePath.replace(/^docker\//, '')
    relativePath = relativePath.replace(/^mcp\//, '')

    let destPath = join(projectDir, relativePath)

    // Strip .tpl suffix
    if (destPath.endsWith('.tpl')) {
      destPath = stripTpl(destPath)
    }

    // Adjust extension for JS/TS
    if (!options.useTypeScript && destPath.endsWith('.ts') && !destPath.endsWith('tsconfig.json')) {
      destPath = destPath.replace(/\.ts$/, '.js')
    }

    // Ensure parent directory exists
    mkdirSync(dirname(destPath), { recursive: true })

    // Process template
    if (srcPath.endsWith('.tpl')) {
      const content = readFileSync(srcPath, 'utf-8')
      const processed = applyTemplate(content, vars)
      writeFileSync(destPath, processed, 'utf-8')
    } else {
      copyFileSync(srcPath, destPath)
    }

    fileCount++
  }

  // Generate package.json
  const packageJson = {
    name: options.projectName,
    version: '1.0.0',
    type: 'module',
    scripts: buildScripts(options),
    dependencies: buildDependencies(options),
    devDependencies: buildDevDependencies(options)
  }
  writeFileSync(
    join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  )

  s.stop(`Created ${pc.cyan(fileCount)} files`)

  // Initialize git
  if (options.initGit) {
    const s2 = p.spinner()
    s2.start('Initializing git')
    const gitSuccess = initGit(projectDir)
    if (gitSuccess) {
      s2.stop('Git initialized')
    } else {
      s2.stop('Git initialization failed (optional)')
    }
  }

  // Install dependencies
  if (options.installDeps) {
    await installDependencies(projectDir)
  }

  // Outro
  p.outro(pc.green('Done! 🚀'))

  console.log('\nNext steps:')
  console.log(`  ${pc.cyan('cd')} ${options.projectName}`)
  if (!options.installDeps) {
    console.log(`  ${pc.cyan('npm install')}`)
  }
  console.log(`  ${pc.cyan('cp')} .env.example .env`)
  console.log(`  ${pc.dim('# edit .env (API_KEY at minimum)')}`)
  console.log(`  ${pc.cyan('npm run dev')}`)
  console.log()
}
