import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useBattleStore } from '../store/useBattleStore';
import { strings } from '../i18n/strings';

/**
 * 렌더 오류 경계 — 라우트 콘텐츠를 감싸 렌더 중 예외가 나면 상황도 미감의
 * 폴백 화면(버프 톤 종이)을 보여준다. 클래스 컴포넌트라 훅을 못 쓰므로
 * 언어는 스토어에서 직접 읽는다(오류 화면은 재렌더가 없으니 정적으로 충분).
 */
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 콘솔에 남겨 진단을 돕는다(프로덕션에서도 유용)
    console.error('ErrorBoundary caught an error', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const lang = useBattleStore.getState().lang;
    const s = (key: string) => strings[key]?.[lang] ?? key;

    return (
      <div className="error-screen" role="alert">
        <div className="error-card">
          <div className="error-kicker">SYSTEM · 상황도</div>
          <h1 className="error-title">{s('error.title')}</h1>
          <p className="error-body">{s('error.body')}</p>
          <button
            type="button"
            className="error-reload"
            onClick={() => window.location.reload()}
          >
            {s('error.reload')}
          </button>
        </div>
      </div>
    );
  }
}
