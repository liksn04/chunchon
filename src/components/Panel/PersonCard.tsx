import { useEffect } from 'react';
import { personById } from '../../data/people';

/** 인물 약력 카드 — 배경 클릭·Esc로 닫힘 (모바일 하단시트 / 데스크탑 중앙 카드) */
export default function PersonCard({
  personId,
  onClose,
}: {
  personId: string;
  onClose: () => void;
}) {
  const p = personById.get(personId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!p) return null;

  return (
    <div className="person-backdrop" onClick={onClose}>
      <div
        className={`person-card person-card--${p.faction}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} 약력`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-btn" aria-label="닫기" onClick={onClose}>
          ✕
        </button>
        <div className="person-head">
          <div className={`person-portrait person-portrait--${p.faction}`} aria-hidden="true">
            {p.name.slice(0, 1)}
          </div>
          <div>
            <div className="person-name">{p.name}</div>
            <div className="person-role">{p.rankRole}</div>
          </div>
        </div>
        <p className="person-bio">{p.bio}</p>
      </div>
    </div>
  );
}
