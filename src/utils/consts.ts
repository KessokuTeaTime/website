import * as child from 'child_process'

export const layoutWidth = {
  compact: { min: 0, maxExcluding: 428 },
  mobile: { min: 428, maxExcluding: 768 },
  desktop: { min: 768, maxExcluding: 1024 },
  wide: { min: 1024, maxExcluding: Infinity }
}

export const commitHash = child.execSync('git rev-parse HEAD').toString()
export const commitHashShort = child.execSync('git rev-parse --short HEAD').toString()
