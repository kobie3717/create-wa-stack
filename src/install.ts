import spawn from 'cross-spawn'
import { spinner } from '@clack/prompts'

export async function installDependencies(projectDir: string): Promise<boolean> {
  const s = spinner()
  s.start('Installing dependencies')

  return new Promise((resolve) => {
    const child = spawn('npm', ['install'], {
      cwd: projectDir,
      stdio: 'pipe'
    })

    child.on('close', (code) => {
      if (code === 0) {
        s.stop('Dependencies installed')
        resolve(true)
      } else {
        s.stop('Failed to install dependencies')
        resolve(false)
      }
    })

    child.on('error', () => {
      s.stop('Failed to install dependencies')
      resolve(false)
    })
  })
}
