import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { equipmentById } from '../../data/shared/equipment';
import { useBattleStore } from '../../store/useBattleStore';
import type { Equipment } from '../../data/shared/equipment';

/** 측면 실루엣 — 야전 식별표 느낌 */
function Silhouette({ e }: { e: Equipment }) {
  const c = e.user === 'ROK' ? 'var(--rok)' : 'var(--nk)';
  return (
    <svg viewBox="0 0 140 68" className="silhouette-svg" aria-hidden="true">
      <line x1={6} y1={62} x2={134} y2={62} stroke="var(--ink-faint)" strokeWidth={1} strokeDasharray="3 3" />
      <g fill={c}>
        {e.kind === 'tank' && (
          <>
            <ellipse cx={70} cy={58} rx={54} ry={5} opacity={0.25} />
            <rect x={16} y={44} width={108} height={12} rx={3} />
            <path d="M34,44 L44,32 L96,32 L106,44 Z" />
            <rect x={58} y={22} width={30} height={12} rx={2} />
            <rect x={86} y={25} width={44} height={3.4} rx={1.7} />
            {[26, 42, 58, 74, 90, 106].map((x) => (
              <circle key={x} cx={x} cy={57} r={5} />
            ))}
            <circle cx={116} cy={57} r={5} />
          </>
        )}
        {e.kind === 'spgun' && (
          <>
            <ellipse cx={70} cy={58} rx={52} ry={5} opacity={0.25} />
            <rect x={16} y={44} width={104} height={12} rx={3} />
            <path d="M40,44 L48,30 L100,30 L100,44 Z" opacity={0.92} />
            <rect x={20} y={32} width={4} height={12} />
            <rect x={96} y={33} width={40} height={3} rx={1.5} />
            {[26, 42, 58, 74, 90, 106].map((x) => (
              <circle key={x} cx={x} cy={57} r={4.6} />
            ))}
          </>
        )}
        {e.kind === 'armored-car' && (
          <>
            <ellipse cx={70} cy={59} rx={40} ry={4} opacity={0.25} />
            <rect x={34} y={40} width={72} height={12} rx={3} />
            <path d="M46,40 L54,30 L92,30 L98,40 Z" />
            <rect x={70} y={24} width={4} height={7} />
            <circle cx={50} cy={54} r={6.5} />
            <circle cx={92} cy={54} r={6.5} />
          </>
        )}
        {e.kind === 'howitzer' && (
          <>
            <circle cx={54} cy={52} r={9} fill="none" stroke={c} strokeWidth={3} />
            <path d="M54,52 L128,30" stroke={c} strokeWidth={5} strokeLinecap="round" />
            <path d="M54,52 L20,62 M54,52 L34,62" stroke={c} strokeWidth={3} />
            <rect x={48} y={40} width={18} height={5} rx={2} />
          </>
        )}
        {e.kind === 'atgun' && (
          <>
            <circle cx={58} cy={54} r={7} fill="none" stroke={c} strokeWidth={2.6} />
            <path d="M58,54 L126,42" stroke={c} strokeWidth={3.4} strokeLinecap="round" />
            <path d="M58,54 L28,62 M58,54 L40,62" stroke={c} strokeWidth={2.4} />
            <rect x={50} y={44} width={22} height={4} rx={2} transform="rotate(-10 61 46)" />
          </>
        )}
        {e.kind === 'mortar' && (
          <>
            <path d="M64,58 L86,26" stroke={c} strokeWidth={5} strokeLinecap="round" />
            <path d="M58,60 L78,60" stroke={c} strokeWidth={3} />
            <path d="M64,58 L52,60 M64,58 L60,44" stroke={c} strokeWidth={2.6} />
            <circle cx={86} cy={24} r={3} />
          </>
        )}
      </g>
    </svg>
  );
}

export default function EquipmentCard() {
  const selectedEquipId = useBattleStore((s) => s.selectedEquipId);
  const selectEquip = useBattleStore((s) => s.selectEquip);
  const e = selectedEquipId ? equipmentById.get(selectedEquipId) : undefined;
  // 실사 사진 로드 실패 시 측면 실루엣으로 폴백
  const [photoOk, setPhotoOk] = useState(true);
  useEffect(() => setPhotoOk(true), [selectedEquipId]);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedEquipId) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.stopPropagation();
        selectEquip(null);
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // 접근성: 대화상자로 포커스 이동, 닫힐 때 이전 요소로 복원
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (prevFocus && document.contains(prevFocus)) {
        prevFocus.focus({ preventScroll: true });
      }
    };
  }, [selectedEquipId, selectEquip]);

  if (!e) return null;

  return createPortal(
    <div className="person-backdrop" onClick={() => selectEquip(null)}>
      <div
        className={`dossier dossier--${e.user}`}
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${e.name} 제원`}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="dossier-band">
          <span className="dossier-kicker">야전 식별표 · FIELD GUIDE</span>
          <button type="button" className="dossier-close" aria-label="닫기" onClick={() => selectEquip(null)}>
            ✕
          </button>
        </div>

        <div className="equip-hero">
          {e.photo && photoOk ? (
            <img
              className="equip-photo-img"
              src={e.photo.src}
              alt={`${e.name} 사진`}
              loading="lazy"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <Silhouette e={e} />
          )}
        </div>

        <div className="dossier-head" style={{ paddingTop: 12 }}>
          <div className="dossier-id">
            <div className="dossier-faction">
              {e.origin} · {e.klass} · {e.user === 'ROK' ? '국군 운용' : '북한 운용'}
            </div>
            <div className="dossier-name">{e.name}</div>
          </div>
        </div>

        <div className="dossier-body">
          <div className="spec-grid">
            {e.specs.map((s) => (
              <div key={s.label} className="spec-cell">
                <div className="spec-label">{s.label}</div>
                <div className="spec-value">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="dossier-body-label" style={{ marginTop: 12 }}>
            전투에서
          </div>
          <p>{e.note}</p>
          {e.photo && photoOk && (
            <div className="img-credit">
              사진 · {e.photo.credit} · {e.photo.license}
              {e.photo.note ? ` · ${e.photo.note}` : ''}
              {e.photo.sourceUrl && (
                <>
                  {' · '}
                  <a href={e.photo.sourceUrl} target="_blank" rel="noreferrer">
                    원본
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
