import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * public/sw.js는 정적 자산이라 vite가 그대로 dist/에 복사한다(변환 없음).
 * 캐시 이름을 빌드마다 바꿔야 배포 시 이전 서비스워커 캐시가 자동 폐기되므로,
 * 번들 완료 후(closeBundle) dist/sw.js를 직접 열어 '__SW_VERSION__' 플레이스홀더를
 * git short sha(불가하면 타임스탬프)로 치환한다.
 */
function swVersionPlugin(): Plugin {
  let outDir = 'dist'
  return {
    name: 'sw-version',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const distSw = path.resolve(outDir, 'sw.js')
      if (!existsSync(distSw)) return

      let version: string
      try {
        version = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
          .toString()
          .trim()
        if (!version) throw new Error('empty sha')
      } catch {
        version = Date.now().toString(36)
      }

      const contents = readFileSync(distSw, 'utf-8')
      writeFileSync(distSw, contents.replaceAll('__SW_VERSION__', version))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), swVersionPlugin()],
})
