import { useEffect } from 'react';
import BattleView from './BattleView';
import BattleIndex from './components/Index/BattleIndex';
import { useRoute } from './router';
import { battleById } from './battles/registry';
import { useBattleStore } from './store/useBattleStore';
import { useT } from './i18n';

const THEME_SURFACE = { light: '#e4dec9', dark: '#131a24' } as const;

export default function AppShell() {
  const route = useRoute();
  const theme = useBattleStore((s) => s.theme);
  const toggleTheme = useBattleStore((s) => s.toggleTheme);
  const lang = useBattleStore((s) => s.lang);
  const toggleLang = useBattleStore((s) => s.toggleLang);
  const t = useT();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // iOS Safari 상단바 색을 지도 표면에 맞춤
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_SURFACE[theme]);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const battleMeta = route.kind === 'battle' ? battleById.get(route.id) : undefined;
  const onBattle = !!battleMeta;

  return (
    <div className="app">
      <header className="app-header">
        {onBattle ? (
          <h1 className="app-title">
            <span className="title-year">{battleMeta.dateRange.start.slice(0, 4)}</span>
            {battleMeta.name.ko} 상황도
          </h1>
        ) : (
          <h1 className="app-title">{t('app.title')}</h1>
        )}
        <span className="app-subtitle">
          {onBattle ? t('app.subtitle') : t('index.subtitle')}
        </span>
        <div className="header-toggles">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            {t('app.lang')}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '야간(지휘소 콘솔) 모드로 전환' : '주간 모드로 전환'}
          >
            {theme === 'light' ? t('app.toDark') : t('app.toLight')}
          </button>
        </div>
      </header>

      {route.kind === 'battle' ? (
        <BattleView key={route.id} battleId={route.id} />
      ) : (
        <BattleIndex />
      )}
    </div>
  );
}
