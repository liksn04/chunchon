import { useState } from 'react';
import { useBattleStore } from '../../store/useBattleStore';
import { useT } from '../../i18n';

function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <svg width={30} height={14} viewBox="0 0 30 14" aria-hidden="true">
      {children}
    </svg>
  );
}

const LAYER_KEYS = ['front', 'arrows', 'units', 'markers', 'plan', 'terrain'] as const;

export default function Legend() {
  const t = useT();
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
        {t('legend.title')} {open ? '▴' : '▾'}
      </button>

      {open && (
        <div className="legend-card" role="region" aria-label={t('legend.title')}>
          <h3>{t('legend.faction')}</h3>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5} fill="var(--rok)" />
            </Swatch>
            {t('legend.rok')}
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={10.5} y={2.5} width={9} height={9} transform="rotate(45 15 7)" fill="var(--nk)" />
            </Swatch>
            {t('legend.nk')}
          </div>

          <h3>{t('legend.arrows')}</h3>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--nk)" strokeWidth={3} />
            </Swatch>
            {t('legend.attack')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--nk)" strokeWidth={1.6} opacity={0.8} />
            </Swatch>
            {t('legend.advance')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--rok)" strokeWidth={1.8} strokeDasharray="4 3" />
            </Swatch>
            {t('legend.withdraw')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H22 M22,3.5 L27,7 L22,10.5" fill="none" stroke="var(--nk)" strokeWidth={1.8} strokeDasharray="5 4" opacity={0.45} />
            </Swatch>
            {t('legend.plan')}
          </div>

          <h3>{t('legend.markers')}</h3>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <circle cx={15} cy={7} r={3.2} fill="var(--rok)" />
            </Swatch>
            {t('legend.mRok')}
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <rect x={12.6} y={4.6} width={4.8} height={4.8} transform="rotate(45 15 7)" fill="var(--nk)" />
            </Swatch>
            {t('legend.mNk')}
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={5.5} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.3} />
              <path d="M15,3.8 A3.2,3.2 0 0 0 15,10.2 Z" fill="var(--rok)" />
              <path d="M15,3.8 A3.2,3.2 0 0 1 15,10.2 Z" fill="var(--nk)" />
            </Swatch>
            {t('legend.mMixed')}
          </div>
          <div className="legend-row">
            <Swatch>
              <circle cx={15} cy={7} r={6.5} fill="none" stroke="var(--amber)" strokeWidth={2} strokeDasharray="3 2" />
            </Swatch>
            {t('legend.mKey')}
          </div>

          <h3>{t('legend.units')}</h3>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--rok)" strokeWidth={1.3} />
              <path d="M8,4 L22,12 M8,12 L22,4" stroke="var(--rok)" strokeWidth={1} fill="none" />
            </Swatch>
            {t('legend.uInf')}
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--rok)" strokeWidth={1.3} />
              <circle cx={15} cy={8} r={2.2} fill="var(--rok)" />
            </Swatch>
            {t('legend.uArt')}
          </div>
          <div className="legend-row">
            <Swatch>
              <rect x={6} y={2.5} width={18} height={11} fill="none" stroke="var(--nk)" strokeWidth={1.3} />
              <ellipse cx={15} cy={8} rx={5} ry={3} fill="none" stroke="var(--nk)" strokeWidth={1.1} />
            </Swatch>
            {t('legend.uArmor')}
          </div>
          <div className="legend-row" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
            <Swatch>
              <text x={15} y={11} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--ink)">
                II·III·XX
              </text>
            </Swatch>
            {t('legend.uEch')}
          </div>

          <h3>{t('legend.terrain')}</h3>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 Q15,3 28,7" fill="none" stroke="var(--water-teal)" strokeWidth={3} />
            </Swatch>
            {t('legend.river')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H28" fill="none" stroke="var(--contour-bistre)" strokeWidth={1.4} strokeDasharray="5 3" />
            </Swatch>
            {t('legend.road')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M2,7 H28" fill="none" stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="8 3 2 3" />
            </Swatch>
            {t('legend.38')}
          </div>
          <div className="legend-row">
            <Swatch>
              <path d="M15,2 L20,11 L10,11 Z" fill="var(--contour-bistre)" />
            </Swatch>
            {t('legend.mountain')}
          </div>

          <h3>{t('legend.layers')}</h3>
          <div className="legend-layers">
            {LAYER_KEYS.map((k) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={layers[k]}
                  onChange={() => toggleLayer(k)}
                />
                {t(`layer.${k}`)}
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
