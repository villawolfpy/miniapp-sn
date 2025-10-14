'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface MiniAppUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface MiniAppContext {
  user?: MiniAppUser;
  [key: string]: unknown;
}

interface MiniKitActions {
  requestSignIn?: () => Promise<void> | void;
  openComposer?: (options: { text: string }) => Promise<void> | void;
  close?: () => void;
  openUrl?: (url: string) => void;
  viewProfile?: (fid: number) => void;
}

interface MiniKitLike {
  context?: MiniAppContext | null;
  getContext?: () => Promise<MiniAppContext | null>;
  onContextChange?: (callback: (context: MiniAppContext | null) => void) => void;
  ready?: () => Promise<void> | void;
  actions?: MiniKitActions | null;
}

export type MiniAppEnvironment = 'browser' | 'embedded' | 'minikit';

interface MiniAppSDK {
  isReady: boolean;
  context: MiniAppContext | null;
  isSupported: boolean;
  environment: MiniAppEnvironment;
  ready: () => Promise<void>;
  signin: () => Promise<void>;
  composeCast: (text: string) => Promise<void>;
  close: () => void;
  openUrl: (url: string) => void;
  viewProfile: (fid: number) => void;
}

function detectMiniKit(): MiniKitLike | null {
  if (typeof window === 'undefined') return null;
  const global = window as typeof window & { BaseMiniKit?: MiniKitLike; miniKit?: MiniKitLike };
  return global.BaseMiniKit || global.miniKit || null;
}

function postMessage(type: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!window.parent || window.parent === window) return;
  window.parent.postMessage({ type, data }, '*');
}

export function useMiniApp(): MiniAppSDK {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [environment, setEnvironment] = useState<MiniAppEnvironment>('browser');
  const kitRef = useRef<MiniKitLike | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const kit = detectMiniKit();
    kitRef.current = kit;

    const isEmbedded = window.self !== window.top;

    if (kit) {
      setIsSupported(true);
      setEnvironment('minikit');
      if (kit.context) {
        setContext(kit.context);
      } else if (typeof kit.getContext === 'function') {
        kit
          .getContext()
          .then((value) => value && setContext(value))
          .catch((error) => {
            console.warn('Failed to resolve MiniKit context', error);
          });
      }

      if (typeof kit.onContextChange === 'function') {
        kit.onContextChange((value) => {
          setContext(value || null);
        });
      }
    } else if (isEmbedded) {
      setEnvironment('embedded');
    } else {
      setEnvironment('browser');
    }

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (typeof data !== 'object' || data === null) return;

      if (data.type === 'miniapp:context' || data.type === 'minikit:context') {
        setContext((data.context as MiniAppContext) || null);
        setIsSupported(true);
        setEnvironment('minikit');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const ready = useCallback(async () => {
    const kit = kitRef.current;

    try {
      if (kit?.ready) {
        await kit.ready();
      } else {
        postMessage('miniapp:ready');
      }
      setIsReady(true);
    } catch (error) {
      console.warn('MiniKit ready failed', error);
    }
  }, []);

  const signin = useCallback(async () => {
    const kit = kitRef.current;

    try {
      if (kit?.actions?.requestSignIn) {
        await kit.actions.requestSignIn();
      } else {
        postMessage('miniapp:signin');
      }
    } catch (error) {
      console.warn('MiniKit signin failed', error);
    }
  }, []);

  const composeCast = useCallback(async (text: string) => {
    const kit = kitRef.current;

    if (!text.trim()) return;

    try {
      if (kit?.actions?.openComposer) {
        await kit.actions.openComposer({ text });
      } else {
        postMessage('miniapp:composeCast', { text });
      }
    } catch (error) {
      console.warn('MiniKit composeCast failed', error);
    }
  }, []);

  const close = useCallback(() => {
    const kit = kitRef.current;

    try {
      if (kit?.actions?.close) {
        kit.actions.close();
      } else {
        postMessage('miniapp:close');
        if (typeof window !== 'undefined') {
          window.close();
        }
      }
    } catch (error) {
      console.warn('MiniKit close failed', error);
    }
  }, []);

  const openUrl = useCallback((url: string) => {
    const kit = kitRef.current;

    try {
      if (kit?.actions?.openUrl) {
        kit.actions.openUrl(url);
      } else if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener');
      } else {
        postMessage('miniapp:openUrl', { url });
      }
    } catch (error) {
      console.warn('MiniKit openUrl failed', error);
    }
  }, []);

  const viewProfile = useCallback((fid: number) => {
    const kit = kitRef.current;

    try {
      if (kit?.actions?.viewProfile) {
        kit.actions.viewProfile(fid);
      } else {
        postMessage('miniapp:viewProfile', { fid });
      }
    } catch (error) {
      console.warn('MiniKit viewProfile failed', error);
    }
  }, []);

  return {
    isReady,
    context,
    isSupported,
    environment,
    ready,
    signin,
    composeCast,
    close,
    openUrl,
    viewProfile,
  };
}
