import { useState } from 'react';
import { useBattleStore } from '../../store/useBattleStore';

function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <svg width={30} height={14} viewBox="0 0 30 14" aria-hidden="true">
      {children}
    </svg>
  );
}

const LAYER_LABELS = {
  front: '전선',
  arrows: '이동 화살표',
  units: '부대기호',
  markers: '사건 마커',
  terrain: '지형 라벨',
} as const;

export default function Legend() {
  const [open, setOpen] = useState(false);
  const layers = useBattleStore((s) => s.layers);
  const toggleLayer = useBattleStore((s) => s.toggleLayer);

  return (
    <>
      <button
        type="button"
        className="legend-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        범례 {open ? '▴' : '▾'}
      </button>

      {open && (
        <div className="legend-card" role="region" aria-label="지도 범례">
          <h3>진영</h3>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5} fill="var(--rok)" />
            </Swatch>
            국군 (청 · 원)
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={10.5} y={2.5} width={9} height={9} transform="rotate(45 15 7)" fill="var(--nk)" />
            </Swatch>
            북한군 (적 · 마름모)
          </div>

          <h3>화살표</h3>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--nk)" strokeWidth={3} />
            </Swatch>
            공격 (굵은 실선)
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--nk)" strokeWidth={1.6} opacity={0.8} />
            </Swatch>
            진출·전환
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--rok)" strokeWidth={1.8} strokeDasharray="4 3" />
            </Swatch>
            철수 (점선)
          </div>

          <h3>사건 마커</h3>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <circle cx={15} cy={7} r={3.2} fill="var(--rok)" />
            </Swatch>
            국군 우세
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <rect x={12.6} y={4.6} width={4.8} height={4.8} transform="rotate(45 15 7)" fill="var(--nk)" />
            </Swatch>
            북한군 우세
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <path d="M15,3.8 A3.2,3.2 0 0 0 15,10.2 Z" fill="var(--rok)" />
              <path d="M15,3.8 A3.2,3.2 0 0 1 15,10.2 Z" fill="var(--nk)" />
            </Swatch>
            혼전
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={6.5} fill="none" stroke="var(--amber)" strokeWidth={2} strokeDasharray="3 2" />
            </Swatch>
            ★ 핵심 사건
          </div>

          <h3>부대기호 (날짜 선택 시)</h3>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--rok)" strokeWidth={1.3} />
              <path d="M8,4 L22,12 M8,12 L22,4" stroke="var(--rok)" strokeWidth={1} fill="none" />
            </Swatch>
            보병 (X)
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--rok)" strokeWidth={1.3} />
              <circle cx={15} cy={8} r={2.2} fill="var(--rok)" />
            </Swatch>
            포병 (●)
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--nk)" strokeWidth={1.3} />
              <ellipse cx={15} cy={8} rx={5} ry={3} fill="none" stroke="var(--nk)" strokeWidth={1.1} />
            </Swatch>
            기갑·자주포
          </div>
          <div className="legend-row" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
            <Swatch>
              <text x={15} y={11} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--ink)">
                II·III·XX
              </text>
            </Swatch>
            대대·연대·사단
          </div>

          <h3>지형</h3>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 Q15,3 28,7" fill="none" stroke="var(--water-teal)" strokeWidth={3} />
            </Swatch>
            강
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H28" fill="none" stroke="var(--contour-bistre)" strokeWidth={1.4} strokeDasharray="5 3" />
            </Swatch>
            도로
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H28" fill="none" stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="8 3 2 3" />
            </Swatch>
            38선
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M15,2 L20,11 L10,11 Z" fill="var(--contour-bistre)" />
            </Swatch>
            산·고지
          </div>

          <h3>레이어</h3>
          <div className="legend-layers">
            {(Object.keys(LAYER_LABELS) as (keyof typeof LAYER_LABELS)[]).map((k) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={layers[k]}
                  onChange={() => toggleLayer(k)}
                />
                {LAYER_LABELS[k]}
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
