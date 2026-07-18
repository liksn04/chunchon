import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/morph';
import { getStored, setStored } from '../../lib/storage';
import { useBattle } from '../../battles/useBattle';

/** 'YYYY-MM-DD' → 'YYYY · MM · DD' */
const wireDate = (d: string) => d.replaceAll('-', ' · ');

/** 진입 타이틀 인트로 — 전투별 최초 1회, 스킵 가능, 축소모션 존중 */
export default function TitleIntro() {
  const meta = useBattle().meta;
  const key = `introseen:${meta.id}`;
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (getStored(key) || prefersReducedMotion()) return;
    setShow(true);
    const t = setTimeout(() => dismiss(), 3600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const dismiss = () => {
    setStored(key, '1');
    setLeaving(true);
    setTimeout(() => setShow(false), 650);
  };

  if (!show || !meta.intro) return null;

  return (
    <div className={`intro ${leaving ? 'intro--leaving' : ''}`} onClick={dismiss} role="presentation">
      <div className="intro-inner">
        <div className="intro-wire">{wireDate(meta.dateRange.start)}</div>
        <h1 className="intro-title">{meta.intro.headline}</h1>
        <div className="intro-sub">{meta.intro.body}</div>
        <div className="intro-rule" />
        <div className="intro-hint">화면을 누르면 시작</div>
      </div>
    </div>
  );
}
