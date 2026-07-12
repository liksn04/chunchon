import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { personById, personMeta } from '../../data/people';
import RankInsignia from './RankInsignia';
import type { Faction } from '../../types';

type PortraitKind = 'senior' | 'officer' | 'enlisted';

function portraitKind(rankRole: string): PortraitKind {
  if (/일병|이병|병$|병 /.test(rankRole)) return 'enlisted';
  if (/대령|사단장/.test(rankRole)) return 'senior';
  return 'officer';
}

/** 스타일라이즈드 흉상 초상(실사진 아님) — 계급별 모자, 진영색 실루엣 */
function Portrait({ kind, faction }: { kind: PortraitKind; faction: Faction }) {
  const col = faction === 'ROK' ? 'var(--rok)' : 'var(--nk)';
  return (
    <svg viewBox="0 0 80 92" className="portrait-svg" aria-hidden="true">
      <defs>
        <linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--panel-paper)" />
          <stop offset="1" stopColor="var(--map-buff-deep)" />
        </linearGradient>
      </defs>
      <rect width="80" height="92" fill="url(#pbg)" />
      {/* 흉상 */}
      <g fill={col}>
        <path d="M6,92 C6,70 22,63 40,63 C58,63 74,70 74,92 Z" opacity="0.92" />
        <rect x="33" y="52" width="14" height="14" opacity="0.92" />
        <ellipse cx="40" cy="38" rx="15" ry="17" opacity="0.92" />
      </g>
      {/* 두부 장구 */}
      <g fill={col}>
        {kind === 'enlisted' ? (
          <>
            <path d="M22,37 Q22,17 40,17 Q58,17 58,37 Z" />
            <rect x="19" y="35" width="42" height="4.5" rx="2.2" />
          </>
        ) : (
          <>
            <path d="M22,31 Q40,13 58,31 L58,33 L22,33 Z" />
            <rect x="22.5" y="31.5" width="35" height="6.5" />
            <path d="M20,38 Q40,45 60,38 L60,41 Q40,47 20,41 Z" />
          </>
        )}
      </g>
      {kind === 'senior' && (
        <path
          d="M40,32.2 l1.1,2.3 2.5,.2 -1.9,1.6 .6,2.5 -2.3,-1.3 -2.3,1.3 .6,-2.5 -1.9,-1.6 2.5,-.2 Z"
          fill="var(--panel-paper)"
        />
      )}
      {/* 사진 모서리 등록표식 */}
      <g stroke={col} strokeWidth="1.4" opacity="0.5">
        <path d="M4,12 V4 H12" fill="none" />
        <path d="M76,12 V4 H68" fill="none" />
        <path d="M4,80 V88 H12" fill="none" />
        <path d="M76,80 V88 H68" fill="none" />
      </g>
    </svg>
  );
}

/** 인물 약력 카드 — 군 인물기록 카드 양식. body로 포털해 스크롤 컨테이너 밖에 띄운다. */
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!p) return null;
  const meta = personMeta[p.id] ?? {};
  const kind = portraitKind(p.rankRole);
  const factionLabel = p.faction === 'ROK' ? '국군 · 제6사단' : '북한 · 제2군단';

  return createPortal(
    <div className="person-backdrop" onClick={onClose}>
      <div
        className={`dossier dossier--${p.faction}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} 인물 기록`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dossier-band">
          <span className="dossier-kicker">인물 기록 · SERVICE RECORD</span>
          <button type="button" className="dossier-close" aria-label="닫기" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dossier-head">
          <div className="dossier-photo">
            <Portrait kind={kind} faction={p.faction} />
            <span className="dossier-photo-tag">초상 도식</span>
          </div>
          <div className="dossier-id">
            <div className="dossier-faction">{factionLabel}</div>
            <div className="dossier-name">
              {p.name}
              {meta.hanja && <span className="dossier-hanja">{meta.hanja}</span>}
            </div>
            <div className="dossier-role">
              {p.faction === 'ROK' && (
                <span className="dossier-rankmark" title="1950년식 국군 계급장(도식)">
                  <RankInsignia rankRole={p.rankRole} title={`1950년식 계급장 · ${p.rankRole}`} />
                </span>
              )}
              {p.rankRole}
            </div>
            {meta.medals && meta.medals.length > 0 && (
              <div className="dossier-medals">
                {meta.medals.map((m) => (
                  <span key={m} className="ribbon">
                    ★ {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dossier-body">
          <div className="dossier-body-label">약력</div>
          <p>{p.bio}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
