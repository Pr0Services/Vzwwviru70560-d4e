/**
 * CHE·NU™ CAPTCHA Components V72
 * 
 * React components for CAPTCHA integration:
 * - reCAPTCHA v2/v3
 * - hCaptcha
 * - Cloudflare Turnstile
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication Security
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type CaptchaProvider = 'recaptcha_v2' | 'recaptcha_v3' | 'hcaptcha' | 'turnstile';

interface CaptchaConfig {
  enabled: boolean;
  provider: CaptchaProvider;
  siteKey: string;
}

interface CaptchaProps {
  /** CAPTCHA provider */
  provider?: CaptchaProvider;
  /** Site key for the provider */
  siteKey: string;
  /** Callback when token is received */
  onVerify: (token: string) => void;
  /** Callback on error */
  onError?: (error: string) => void;
  /** Callback when CAPTCHA expires */
  onExpire?: () => void;
  /** Action name for reCAPTCHA v3 */
  action?: string;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Size for v2 */
  size?: 'normal' | 'compact' | 'invisible';
  /** Auto-execute for invisible/v3 */
  autoExecute?: boolean;
  /** Custom className */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CAPTCHA SCRIPT LOADERS
// ═══════════════════════════════════════════════════════════════════════════

const scriptCache = new Map<string, Promise<void>>();

function loadScript(src: string, id: string): Promise<void> {
  if (scriptCache.has(id)) {
    return scriptCache.get(id)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    // Check if already loaded
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  scriptCache.set(id, promise);
  return promise;
}

// ═══════════════════════════════════════════════════════════════════════════
// RECAPTCHA V2 COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

declare global {
  interface Window {
    grecaptcha: any;
    hcaptcha: any;
    turnstile: any;
    onRecaptchaLoad?: () => void;
    onHcaptchaLoad?: () => void;
  }
}

export const ReCaptchaV2: React.FC<CaptchaProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA script
    window.onRecaptchaLoad = () => setReady(true);
    
    loadScript(
      'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit',
      'recaptcha-v2-script'
    ).catch((err) => onError?.(err.message));

    // Check if already loaded
    if (window.grecaptcha?.render) {
      setReady(true);
    }

    return () => {
      window.onRecaptchaLoad = undefined;
    };
  }, [onError]);

  useEffect(() => {
    if (!ready || !containerRef.current || widgetId.current !== null) return;

    try {
      widgetId.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': () => onError?.('CAPTCHA error'),
        'expired-callback': onExpire,
        theme,
        size,
      });
    } catch (err) {
      onError?.('Failed to render CAPTCHA');
    }
  }, [ready, siteKey, onVerify, onError, onExpire, theme, size]);

  // Reset function
  const reset = useCallback(() => {
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.current);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: size === 'invisible' ? 0 : 78 }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RECAPTCHA V3 COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ReCaptchaV3: React.FC<Omit<CaptchaProps, 'theme' | 'size'>> = ({
  siteKey,
  onVerify,
  onError,
  action = 'submit',
  autoExecute = true,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadScript(
      `https://www.google.com/recaptcha/api.js?render=${siteKey}`,
      'recaptcha-v3-script'
    )
      .then(() => {
        window.grecaptcha.ready(() => setReady(true));
      })
      .catch((err) => onError?.(err.message));
  }, [siteKey, onError]);

  const execute = useCallback(async () => {
    if (!ready || !window.grecaptcha) {
      onError?.('reCAPTCHA not ready');
      return;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      onVerify(token);
    } catch (err) {
      onError?.('Failed to execute CAPTCHA');
    }
  }, [ready, siteKey, action, onVerify, onError]);

  useEffect(() => {
    if (ready && autoExecute) {
      execute();
    }
  }, [ready, autoExecute, execute]);

  // Return execute function via ref or expose it
  return null; // v3 is invisible
};

// Hook for v3
export function useReCaptchaV3(siteKey: string, action: string = 'submit') {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadScript(
      `https://www.google.com/recaptcha/api.js?render=${siteKey}`,
      'recaptcha-v3-script'
    ).then(() => {
      window.grecaptcha.ready(() => setReady(true));
    });
  }, [siteKey]);

  const execute = useCallback(async (): Promise<string> => {
    if (!ready || !window.grecaptcha) {
      throw new Error('reCAPTCHA not ready');
    }
    return window.grecaptcha.execute(siteKey, { action });
  }, [ready, siteKey, action]);

  return { ready, execute };
}

// ═══════════════════════════════════════════════════════════════════════════
// HCAPTCHA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const HCaptcha: React.FC<CaptchaProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.onHcaptchaLoad = () => setReady(true);
    
    loadScript(
      'https://js.hcaptcha.com/1/api.js?onload=onHcaptchaLoad&render=explicit',
      'hcaptcha-script'
    ).catch((err) => onError?.(err.message));

    if (window.hcaptcha?.render) {
      setReady(true);
    }

    return () => {
      window.onHcaptchaLoad = undefined;
    };
  }, [onError]);

  useEffect(() => {
    if (!ready || !containerRef.current || widgetId.current !== null) return;

    try {
      widgetId.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': () => onError?.('CAPTCHA error'),
        'expired-callback': onExpire,
        theme,
        size,
      });
    } catch (err) {
      onError?.('Failed to render hCaptcha');
    }
  }, [ready, siteKey, onVerify, onError, onExpire, theme, size]);

  const reset = useCallback(() => {
    if (widgetId.current !== null && window.hcaptcha) {
      window.hcaptcha.reset(widgetId.current);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: size === 'invisible' ? 0 : 78 }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CLOUDFLARE TURNSTILE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Turnstile: React.FC<CaptchaProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  action,
  theme = 'light',
  size = 'normal',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadScript(
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      'turnstile-script'
    )
      .then(() => {
        // Wait for turnstile to be available
        const checkReady = () => {
          if (window.turnstile) {
            setReady(true);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      })
      .catch((err) => onError?.(err.message));
  }, [onError]);

  useEffect(() => {
    if (!ready || !containerRef.current || widgetId.current !== null) return;

    try {
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': () => onError?.('CAPTCHA error'),
        'expired-callback': onExpire,
        action,
        theme,
        size,
      });
    } catch (err) {
      onError?.('Failed to render Turnstile');
    }
  }, [ready, siteKey, onVerify, onError, onExpire, action, theme, size]);

  const reset = useCallback(() => {
    if (widgetId.current !== null && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: size === 'invisible' ? 0 : 65 }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED CAPTCHA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface UnifiedCaptchaProps extends Omit<CaptchaProps, 'provider'> {
  /** Auto-detect provider from config, or specify */
  provider?: CaptchaProvider;
}

export const Captcha: React.FC<UnifiedCaptchaProps> = ({
  provider = 'recaptcha_v2',
  siteKey,
  onVerify,
  onError,
  onExpire,
  action,
  theme = 'light',
  size = 'normal',
  className,
}) => {
  switch (provider) {
    case 'recaptcha_v2':
      return (
        <ReCaptchaV2
          siteKey={siteKey}
          onVerify={onVerify}
          onError={onError}
          onExpire={onExpire}
          theme={theme}
          size={size}
          className={className}
        />
      );
    
    case 'recaptcha_v3':
      return (
        <ReCaptchaV3
          siteKey={siteKey}
          onVerify={onVerify}
          onError={onError}
          action={action}
        />
      );
    
    case 'hcaptcha':
      return (
        <HCaptcha
          siteKey={siteKey}
          onVerify={onVerify}
          onError={onError}
          onExpire={onExpire}
          theme={theme}
          size={size}
          className={className}
        />
      );
    
    case 'turnstile':
      return (
        <Turnstile
          siteKey={siteKey}
          onVerify={onVerify}
          onError={onError}
          onExpire={onExpire}
          action={action}
          theme={theme}
          size={size}
          className={className}
        />
      );
    
    default:
      return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CAPTCHA HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface UseCaptchaOptions {
  provider: CaptchaProvider;
  siteKey: string;
  action?: string;
}

interface UseCaptchaResult {
  token: string | null;
  error: string | null;
  verified: boolean;
  reset: () => void;
  setToken: (token: string) => void;
}

export function useCaptcha(options: UseCaptchaOptions): UseCaptchaResult {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const reset = useCallback(() => {
    setToken(null);
    setError(null);
    setVerified(false);
  }, []);

  const handleToken = useCallback((newToken: string) => {
    setToken(newToken);
    setVerified(true);
    setError(null);
  }, []);

  return {
    token,
    error,
    verified,
    reset,
    setToken: handleToken,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CAPTCHA FORM WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

interface CaptchaFormProps {
  children: React.ReactNode;
  provider?: CaptchaProvider;
  siteKey: string;
  action?: string;
  onSubmit: (token: string, event: React.FormEvent) => void;
  theme?: 'light' | 'dark';
}

export const CaptchaForm: React.FC<CaptchaFormProps> = ({
  children,
  provider = 'recaptcha_v2',
  siteKey,
  action,
  onSubmit,
  theme = 'light',
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = useCallback((newToken: string) => {
    setToken(newToken);
    setError(null);
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setToken(null);
  }, []);

  const handleExpire = useCallback(() => {
    setToken(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please complete the CAPTCHA');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(token, e);
    } finally {
      setSubmitting(false);
    }
  }, [token, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {children}
      
      <div style={{ margin: '16px 0' }}>
        <Captcha
          provider={provider}
          siteKey={siteKey}
          action={action}
          onVerify={handleVerify}
          onError={handleError}
          onExpire={handleExpire}
          theme={theme}
        />
      </div>
      
      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '6px',
          fontSize: '14px',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!token || submitting}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: token ? '#3b82f6' : '#9ca3af',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 500,
          cursor: token && !submitting ? 'pointer' : 'not-allowed',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  Captcha,
  ReCaptchaV2,
  ReCaptchaV3,
  HCaptcha,
  Turnstile,
  CaptchaForm,
  useCaptcha,
  useReCaptchaV3,
};
