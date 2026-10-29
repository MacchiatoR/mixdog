import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BrowserPane from '../BrowserPane.lazy';
import { BrowserTabStrip } from '../BrowserTabStrip';
import { useComposerFocus, usePaneTypingFocus } from '../use-composer-focus';
import '../styles.css';

const fixture = window as unknown as {
  setSurfaceActive(value: boolean): void;
  setBrowserMode(value: 'main' | 'dock'): void;
  setFixtureVisible(value: boolean): void;
  fixtureReady: boolean;
};
let visible = true;
// The harness window is never shown; exercise the visible-document client
// without activating an actual desktop window.
Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (visible ? 'visible' : 'hidden') });
fixture.setFixtureVisible = (value) => {
  visible = value;
  document.dispatchEvent(new Event('visibilitychange'));
};

function Fixture() {
  const [active, setActive] = useState(true);
  const [mode, setMode] = useState<'main' | 'dock'>('dock');
  const [draft, setDraft] = useState('keep editing');
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  useComposerFocus({ textarea, transitioning: false, focusRequest: 0, paneActive: true });
  usePaneTypingFocus('editing', 'session');
  fixture.setSurfaceActive = setActive;
  fixture.setBrowserMode = setMode;
  fixture.fixtureReady = true;
  return (
    <>
      <section data-pane-id="editing">
        <form className="composer">
          <textarea id="composer" ref={textarea} value={draft} onChange={(event) => setDraft(event.target.value)} />
          <output id="draft">{draft}</output>
        </form>
      </section>
      {/* Match the live portal's clipping, not a bare rectangular test mount. */}
      <div
        id="browser-dock"
        className="session-browser-surface-container"
        style={{ position: 'relative', width: 600, height: 400, marginTop: 30, overflow: 'hidden', borderRadius: 9 }}
      >
        <BrowserPane sessionId="visible-session" mode={mode} active={active} foreground={active} focusAddressOnActivate={false} />
      </div>
      <div id="loading-tab-fixture" style={{ width: 240, height: 38 }}>
        <BrowserTabStrip
          tabs={[
            {
              id: 'loading',
              title: 'Loading page',
              url: 'https://example.test/',
              active: true,
              loading: true,
              kind: 'page',
            },
          ]}
          onSelect={async () => {}}
          onClose={async () => {}}
        />
      </div>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
