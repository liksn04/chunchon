import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/morph';
import { getStored, setStored } from '../../lib/storage';

// 인트로는 전투별 — 전투 진입 첫 1회 (Stage 2에서 전투 id 파라미터화)
const KEY = 'introseen:chuncheon';

/** 진입 타이틀 인트로 — 최초 1회, 스킵 가능, 축소모션 존중 */
export default function TitleIntro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (getStored(KEY) || prefersReducedMotion()) return;
    setShow(true);
    const t = setTimeout(() => dismiss(), 3600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    setStored(KEY, '1');
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
