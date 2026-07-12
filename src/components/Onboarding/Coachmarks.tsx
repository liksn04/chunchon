import { useEffect, useState } from 'react';
import { useBattleStore } from '../../store/useBattleStore';

const KEY = 'chuncheon1950-onboarded';

const STEPS = [
  {
    title: { ko: '자유 탐색 지도', en: 'Explore the map' },
    body: {
      ko: '춘천–홍천 삼각지대의 1950년 상황도입니다. 손가락(마우스)으로 끌어 이동하고 두 손가락(휠)으로 확대·축소하세요. 붉은 점선은 끝내 그어지지 못한 북한군의 포위 계획선입니다.',
      en: 'A 1950 situation map of the Chuncheon–Hongcheon triangle. Drag to pan, pinch/scroll to zoom. The red dashed line is the KPA’s encirclement plan that was never drawn.',
    },
  },
  {
    title: { ko: '날짜와 스크러버', en: 'Days & scrubber' },
    body: {
      ko: '아래 날짜 칩으로 그날의 전선·부대·사건을 보고, 슬라이더를 문지르면 전선이 연속으로 남하합니다. ← → 키로도 날짜를 넘길 수 있어요.',
      en: 'Use the day chips below to see that day’s front, units and events. Drag the slider to slide the front line south continuously. ← → keys also step through days.',
    },
  },
  {
    title: { ko: '사건 · 브리핑', en: 'Events & briefing' },
    body: {
      ko: '지도의 마커를 누르면 그 전투의 상세와 인물·출처가 열립니다. ▶ 브리핑을 누르면 카메라가 하루하루를 순회하며 전문(電文) 자막으로 브리핑합니다.',
      en: 'Tap a marker to open that battle’s detail, people and sources. Hit ▶ Briefing to let the camera tour each day with field-wire captions.',
    },
  },
];

export default function Coachmarks() {
  const lang = useBattleStore((s) => s.lang);
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setStep(0);
    } catch {
      /* localStorage 불가 환경: 표시 생략 */
    }
  }, []);

  if (step === null) return null;

  const close = () => {
    try {
      window.localStorage.setItem(KEY, '1');
    } catch {
      /* noop */
    }
    setStep(null);
  };
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="coach-backdrop" onClick={close}>
      <div
        className="coach-card"
        role="dialog"
        aria-modal="true"
        aria-label={`사용 안내 ${step + 1}/${STEPS.length}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="coach-kicker">
          {lang === 'ko' ? '사용 안내' : 'Getting started'} · {step + 1}/{STEPS.length}
        </div>
        <h2 className="coach-title">{s.title[lang]}</h2>
        <p className="coach-body">{s.body[lang]}</p>
        <div className="coach-dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? 'on' : ''} />
          ))}
        </div>
        <div className="coach-actions">
          <button type="button" className="coach-skip" onClick={close}>
            {lang === 'ko' ? '건너뛰기' : 'Skip'}
          </button>
          <button
            type="button"
            className="coach-next"
            onClick={() => (last ? close() : setStep(step + 1))}
          >
            {last ? (lang === 'ko' ? '시작' : 'Start') : lang === 'ko' ? '다음' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
