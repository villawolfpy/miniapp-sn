'use client';

import { useEffect, useState, useCallback } from 'react';

interface MiniAppContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
}

interface MiniAppSDK {
  isReady: boolean;
  context: MiniAppContext | null;
  isSupported: boolean;
  ready: () => void;
  signin: () => Promise<void>;
  composeCast: (text: string) => Promise<void>;
  close: () => void;
  openUrl: (url: string) => void;
  viewProfile: (fid: number) => void;
}

export function useMiniApp(): MiniAppSDK {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined') {
        const inIframe = window.self !== window.top;
        setIsSupported(inIframe);
      }
    };

    checkSupport();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'miniapp:context') {
        setContext(event.data.context);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const ready = useCallback(() => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'miniapp:ready' }, '*');
      setIsReady(true);
    }
  }, []);

  const signin = useCallback(async () => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'miniapp:signin' }, '*');
    }
  }, []);

  const composeCast = useCallback(async (text: string) => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(
        {
          type: 'miniapp:composeCast',
          data: { text },
        },
        '*'
      );
    }
  }, []);

  const close = useCallback(() => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'miniapp:close' }, '*');
    }
  }, []);

  const openUrl = useCallback((url: string) => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(
        {
          type: 'miniapp:openUrl',
          data: { url },
        },
        '*'
      );
    }
  }, []);

  const viewProfile = useCallback((fid: number) => {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(
        {
          type: 'miniapp:viewProfile',
          data: { fid },
        },
        '*'
      );
    }
  }, []);

  return {
    isReady,
    context,
    isSupported,
    ready,
    signin,
    composeCast,
    close,
    openUrl,
    viewProfile,
  };
}
