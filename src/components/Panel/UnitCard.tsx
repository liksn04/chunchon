import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { equipmentById } from '../../data/shared/equipment';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import type { MilitaryUnit } from '../../types';

const ECHELON_LABEL: Record<MilitaryUnit['echelon'], string> = {
  corps: '군단',
  division: '사단',
  regiment: '연대',
  battalion: '대대',
  battery: '포대',
};

const ECHELON_MARK: Record<MilitaryUnit['echelon'], string> = {
  battery: 'I',
  battalion: 'II',
  regiment: 'III',
  division: 'XX',
  corps: 'XXX',
};

const SYMBOL_LABEL: Record<MilitaryUnit['symbol'], string> = {
  infantry: '보병',
  artillery: '포병',
  armor: '기갑·자주포',
  motorized: '차량화',
};

/** APP-6 부대기호(대형) — 카드용 */
function UnitEmblem({ u }: { u: MilitaryUnit }) {
  const color = u.faction === 'ROK' ? 'var(--rok)' : 'var(--nk)';
  return (
    <svg viewBox="0 0 92 66" className="emblem-svg" aria-hidden="true">
      <text
        x={46}
        y={12}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={11}
        fontWeight={700}
        fill={color}
      >
        {ECHELON_MARK[u.echelon]}
      </text>
      <rect x={14} y={18} width={64} height={40} fill="var(--panel-paper)" stroke={color} strokeWidth={3} />
      {u.symbol === 'infantry' && (
        <path d="M18,22 L74,54 M18,54 L74,22" stroke={color} strokeWidth={2.4} fill="none" />
      )}
      {u.symbol === 'artillery' && <circle cx={46} cy={38} r={7.5} fill={color} />}
      {u.symbol === 'armor' && <ellipse cx={46} cy={38} rx={18} ry={11} fill="none" stroke={color} strokeWidth={2.6} />}
      {u.symbol === 'motorized' && (
        <g stroke={color} strokeWidth={2.4} fill="none">
          <path d="M18,22 L74,54 M18,54 L74,22" />
          <path d="M46,20 V56" />
        </g>
      )}
    </svg>
  );
}

export default function UnitCard() {
  const selectedUnitId = useBattleStore((s) => s.selectedUnitId);
  const selectUnit = useBattleStore((s) => s.selectUnit);
  const selectEquip = useBattleStore((s) => s.selectEquip);
  const unitById = useBattle().unitById;
  const u = selectedUnitId ? unitById.get(selectedUnitId) : undefined;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedUnitId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        selectUnit(null);
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
  }, [selectedUnitId, selectUnit]);

  if (!u) return null;
  const parent = u.parent ? unitById.get(u.parent) : undefined;
  const factionLabel = u.faction === 'ROK' ? '국군' : '북한';

  return createPortal(
    <div className="person-backdrop" onClick={() => selectUnit(null)}>
      <div
        className={`dossier dossier--${u.faction}`}
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${u.designation} 부대 기록`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dossier-band">
          <span className="dossier-kicker">부대 기록 · ORDER OF BATTLE</span>
          <button type="button" className="dossier-close" aria-label="닫기" onClick={() => selectUnit(null)}>
            ✕
          </button>
        </div>

        <div className="dossier-head">
          <div className="dossier-photo dossier-photo--unit">
            <UnitEmblem u={u} />
          </div>
          <div className="dossier-id">
            <div className="dossier-faction">
              {factionLabel} · {ECHELON_LABEL[u.echelon]} · {SYMBOL_LABEL[u.symbol]}
            </div>
            <div className="dossier-name">{u.designation}</div>
            {u.commander && <div className="dossier-role">지휘 · {u.commander}</div>}
            {u.role && <div className="dossier-medals"><span className="ribbon ribbon--plain">{u.role}</span></div>}
          </div>
        </div>

        <div className="dossier-body">
          {(parent || u.strength || u.equipment) && (
            <table className="fact-table" style={{ marginBottom: 10 }}>
              <tbody>
                {parent && (
                  <tr>
                    <th scope="row">소속</th>
                    <td>
                      <button className="link-btn" type="button" onClick={() => selectUnit(parent.id)}>
                        {parent.designation}
                      </button>
                    </td>
                  </tr>
                )}
                {u.strength && (
                  <tr>
                    <th scope="row">편성</th>
                    <td>{u.strength}</td>
                  </tr>
                )}
                {u.equipment && !u.equipmentIds && (
                  <tr>
                    <th scope="row">장비</th>
                    <td>{u.equipment}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {u.equipmentIds && u.equipmentIds.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div className="dossier-body-label">주요 장비</div>
              <div className="unit-chips">
                {u.equipmentIds.map((id) => {
                  const eq = equipmentById.get(id);
                  if (!eq) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`unit-chip unit-chip--btn unit-chip--${eq.user}`}
                      onClick={() => selectEquip(id)}
                      title={`${eq.name} 제원`}
                    >
                      {eq.name}
                      <span className="unit-chip-more">›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {u.detail && (
            <>
              <div className="dossier-body-label">전투 역할</div>
              <p>{u.detail}</p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
