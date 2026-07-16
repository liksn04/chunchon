import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppShell from './AppShell.tsx'
import { applyLegacyRedirect } from './router'

// 구형 딥링크(/?day=&event=) → /b/chuncheon 리다이렉트 (라우팅 전 1회)
applyLegacyRedirect()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
)

// PWA 오프라인: 프로덕션에서만 서비스워커 등록
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* 등록 실패는 조용히 무시 (앱은 정상 동작) */
    })
  })
}
