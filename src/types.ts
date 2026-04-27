export interface Options {
  projectName: string
  features: Set<Feature>
  useTypeScript: boolean
  initGit: boolean
  installDeps: boolean
  template?: string
}

export type Feature = 'antiban' | 'rest' | 'webhooks' | 'mcp' | 'n8n' | 'docker' | 'starter'

export interface TemplateVars {
  projectName: string
  port: string
  withAntiban: boolean
  withRest: boolean
  withWebhooks: boolean
  withMcp: boolean
  withN8n: boolean
  withDocker: boolean
  withStarter: boolean
  withTypeScript: boolean
}

export interface TemplateFile {
  path: string
  features?: Feature[]
  condition?: string
}

export interface Manifest {
  files: TemplateFile[]
}
