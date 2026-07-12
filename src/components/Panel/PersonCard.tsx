import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { personById } from '../../data/people';

/** 인물 약력 카드 — 배경 클릭·Esc로 닫힘. body로 포털해 스크롤 컨테이너 밖에 띄운다. */
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
    // 모달 열려 있는 동안 배경 스크롤 잠금
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!p) return null;

  return createPortal(
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
    </div>,
    document.body,
  );
}
