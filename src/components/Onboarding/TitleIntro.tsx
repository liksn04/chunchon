import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/morph';

const KEY = 'chuncheon1950-introseen';

/** 진입 타이틀 인트로 — 최초 1회, 스킵 가능, 축소모션 존중 */
export default function TitleIntro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!window.localStorage.getItem(KEY);
    } catch {
      seen = false;
    }
    if (seen || prefersReducedMotion()) return;
    setShow(true);
    const t = setTimeout(() => dismiss(), 3600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, '1');
    } catch {
      /* noop */
    }
    setLeaving(true);
    setTimeout(() => setShow(false), 650);
  };

  if (!show) return null;

  return (
    <div className={`intro ${leaving ? 'intro--leaving' : ''}`} onClick={dismiss} role="presentation">
      <div className="intro-inner">
        <div className="intro-wire">1950 · 06 · 25 &nbsp; 04:00</div>
        <h1 className="intro-title">
          춘천–홍천 전투
        </h1>
        <div className="intro-sub">— 대한민국을 구한 3일 —</div>
        <div className="intro-rule" />
        <div className="intro-hint">화면을 누르면 시작</div>
      </div>
    </div>
  );
}
