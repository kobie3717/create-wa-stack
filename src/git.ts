import spawn from 'cross-spawn'

export function initGit(projectDir: string): boolean {
  try {
    const init = spawn.sync('git', ['init'], { cwd: projectDir, stdio: 'pipe' })
    if (init.status !== 0) return false

    const add = spawn.sync('git', ['add', '-A'], { cwd: projectDir, stdio: 'pipe' })
    if (add.status !== 0) return false

    const commit = spawn.sync(
      'git',
      ['commit', '-m', 'Initial commit from create-wa-stack'],
      { cwd: projectDir, stdio: 'pipe' }
    )
    if (commit.status !== 0) return false

    return true
  } catch {
    return false
  }
}
