import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { StartupErrorBoundary, StartupFailure } from './components/StartupErrorBoundary';
import { isChunkLoadError, reloadStaleChunkOnce } from './lib/startupRecovery';
import './index.css';
import { installPhoneCallTracking } from './utils/googleAdsConversions';
installPhoneCallTracking();

const THIRD_PARTY_ERROR_HOSTS = [
  'tawk.to',
  'googletagmanager.com',
  'googleadservices.com',
  'doubleclick.net',
  'connect.facebook.net',
  'facebook.com',
  'consent.cookiebot.com',
];

const PREVIEW_HOST_PATTERNS = [
  'lovableproject.com',
  'lovable.app',
  'localhost',
  'webcontainer',
];

const isPreviewOrDevHost = () => {
  if (typeof window === 'undefined') return false;
  return PREVIEW_HOST_PATTERNS.some((host) => window.location.hostname.includes(host));
};

const isThirdPartySource = (source?: string | null) => {
  if (!source) return false;
  return THIRD_PARTY_ERROR_HOSTS.some((host) => source.includes(host));
};

const shouldIgnoreScriptError = (
  message: string | Event,
  source?: string,
  error?: Error,
) => {
  const msg = typeof message === 'string' ? message : '';
  const genericScriptError = msg === 'Script error.' || msg === 'Script error';
  const unknownSource = !source || source === 'Unknown file';

  return isThirdPartySource(source) || (genericScriptError && unknownSource && !error?.stack);
};

if (typeof window !== 'undefined') {
  const w = window as Window & {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  };

  if (isPreviewOrDevHost()) {
    w.dataLayer = [];

    w.gtag = (...args: any[]) => {
      const [command, target] = args;

      if (command === 'event' && (target === 'conversion' || target === 'purchase')) {
        return;
      }

      if (
        command === 'config' &&
        typeof target === 'string' &&
        (target.startsWith('GT-') || target.startsWith('AW-') || target.startsWith('G-'))
      ) {
        return;
      }

      w.dataLayer?.push(args);
    };

    w.fbq = () => {};
  }

  const previousOnError = window.onerror;

  window.onerror = (message, source, lineno, colno, error) => {
    if (shouldIgnoreScriptError(message, source, error ?? undefined)) {
      console.warn('[Runtime] Ignored third-party script error:', { message, source, lineno, colno });
      return true;
    }

    if (typeof previousOnError === 'function') {
      return previousOnError(message, source, lineno, colno, error);
    }

    return false;
  };

  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLScriptElement | null;
      const source = target?.src;
      const errorEvent = event as ErrorEvent;

      const isThirdPartyScriptLoadError =
        target instanceof HTMLScriptElement && isThirdPartySource(source);
      const isGenericCrossOriginScriptError =
        errorEvent instanceof ErrorEvent &&
        shouldIgnoreScriptError(
          errorEvent.message,
          errorEvent.filename,
          (errorEvent.error as Error | undefined) ?? undefined,
        );

      if (isThirdPartyScriptLoadError || isGenericCrossOriginScriptError) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation();
        }
      }
    },
    true,
  );
}

// Handle stale dynamic-import chunks after a redeploy.
// When the user has an old index.html cached, dynamically imported chunk hashes
// no longer exist on the server and Vite throws "Importing a module script failed"
// or "Failed to fetch dynamically imported module". Force a one-time reload.
const tryReloadOnce = () => {
  try {
    return reloadStaleChunkOnce(window.sessionStorage, () => window.location.reload());
  } catch {
    return false;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event?.message && isChunkLoadError(event.message)) {
      tryReloadOnce();
    }
  });
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (isChunkLoadError(msg)) {
      tryReloadOnce();
    }
  });
}

// Install recovery before loading the application graph so startup failures are caught.
const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);
Promise.all([import('./i18n/i18n'), import('./App.tsx')]).then(([, { default: App }]) => {
  root.render(
    <React.StrictMode>
      <StartupErrorBoundary>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StartupErrorBoundary>
    </React.StrictMode>
  );
}).catch((error: unknown) => {
  console.error('[Runtime] Application startup failed', error);
  const message = error instanceof Error ? error.message : String(error);
  if (isChunkLoadError(message) && tryReloadOnce()) return;
  root.render(<StartupFailure />);
});
