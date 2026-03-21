import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

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

// Initialize i18n after React is set up
import('./i18n/i18n').then(() => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}).catch(console.error);
