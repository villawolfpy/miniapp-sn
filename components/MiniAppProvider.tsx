'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MiniAppContext,
  type Address,
  type BaseTransactionRequest,
  type Hex,
  type MiniAppSDK,
  type MiniAppSession,
} from '@/lib/miniapp';
import { getBrowserLocale, useI18n, type Locale } from '@/lib/i18n';

/**
 * Shape of the payload emitted by MiniKit when the host bootstraps the Mini App.
 * The SDK keeps the structure flexible so we only pluck the fields we need.
 */
interface MiniKitInitializePayload {
  user?: {
    address?: Address;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  account?: {
    address?: Address;
  };
  chain?: {
    id?: number;
  };
  environment?: {
    chainId?: number;
  };
}

interface MiniKitWalletAPI {
  requestAccounts?: () => Promise<Address[]>;
  signMessage?: (params: { message: string }) => Promise<Hex>;
  verifyMessage?: (params: {
    address: Address;
    message: string;
    signature: Hex;
  }) => Promise<boolean>;
}

interface MiniKitBaseAPI {
  sendTransaction?: (tx: BaseTransactionRequest) => Promise<string>;
}

interface MiniKitNavigationAPI {
  openUrl?: (url: string) => void;
}

interface MiniKitHost {
  ready?: () => void;
  close?: () => void;
  onInitialize?: (
    handler: (payload: MiniKitInitializePayload) => void
  ) => (() => void) | void;
  onMessage?: (handler: (payload: unknown) => void) => (() => void) | void;
  onClose?: (handler: () => void) => (() => void) | void;
  wallet?: MiniKitWalletAPI;
  base?: MiniKitBaseAPI;
  navigation?: MiniKitNavigationAPI;
}

declare global {
  interface Window {
    MiniKit?: MiniKitHost;
  }
}

/**
 * Provider that wires the React tree with the MiniKit SDK helpers.
 */
export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isSupported, setIsSupported] = useState(false);
  const [checkedSupport, setCheckedSupport] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<MiniAppSession | null>(null);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const contextRef = useRef<MiniAppSession | null>(null);
  const readyCalledRef = useRef(false);

  /**
   * Tracks the locale from the browser to localize fallback messaging.
   */
  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  /**
   * Keeps a reference to the latest context so callbacks can read it without stale closures.
   */
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const t = useI18n(locale);

  const getKit = useCallback((): MiniKitHost | undefined => {
    if (typeof window === 'undefined') return undefined;
    return window.MiniKit;
  }, []);

  /**
   * Marks the Mini App as ready and informs the host that the splash screen can be hidden.
   */
  const ready = useCallback(() => {
    const kit = getKit();
    if (readyCalledRef.current) return;
    if (kit?.ready) {
      kit.ready();
    }
    readyCalledRef.current = true;
    setIsReady(true);
  }, [getKit]);

  /**
   * Helper that ensures the MiniKit host is available before performing privileged actions.
   */
  const requireKit = useCallback((): MiniKitHost => {
    const kit = getKit();
    if (!kit) {
      throw new Error('MiniKit host is not available in this context.');
    }
    return kit;
  }, [getKit]);

  /**
   * Validates a user signature via the MiniKit wallet API before the app processes it.
   */
  const verifySignature = useCallback(
    async (kit: MiniKitHost, address: Address, message: string, signature: Hex) => {
      if (kit.wallet?.verifyMessage) {
        const valid = await kit.wallet.verifyMessage({ address, message, signature });
        if (!valid) {
          throw new Error('The provided signature could not be validated by the host.');
        }
        return;
      }
      throw new Error('MiniKit wallet verification API is unavailable.');
    },
    []
  );

  /**
   * Hooks into MiniKit lifecycle events such as initialization, messages, and close requests.
   */
  useEffect(() => {
    const kit = getKit();
    setCheckedSupport(true);

    if (!kit) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const handleInitialize = (payload: MiniKitInitializePayload) => {
      setContext((prev) => ({
        ...prev,
        address: payload.account?.address ?? payload.user?.address ?? prev?.address,
        username: payload.user?.username ?? prev?.username,
        displayName: payload.user?.displayName ?? prev?.displayName,
        avatarUrl: payload.user?.avatarUrl ?? prev?.avatarUrl,
        chainId: payload.chain?.id ?? payload.environment?.chainId ?? prev?.chainId,
      }));
      setLastError(null);
      ready();
    };

    const handleMessage = (payload: unknown) => {
      setLastMessage(payload);
    };

    const handleClose = () => {
      setContext(null);
    };

    const cleanups: Array<() => void> = [];

    const maybeCleanupInit = kit.onInitialize?.(handleInitialize);
    if (typeof maybeCleanupInit === 'function') cleanups.push(maybeCleanupInit);

    const maybeCleanupMessage = kit.onMessage?.(handleMessage);
    if (typeof maybeCleanupMessage === 'function') cleanups.push(maybeCleanupMessage);

    const maybeCleanupClose = kit.onClose?.(handleClose);
    if (typeof maybeCleanupClose === 'function') cleanups.push(maybeCleanupClose);

    return () => {
      cleanups.forEach((cleanup) => {
        try {
          cleanup();
        } catch {
          // no-op — MiniKit handlers are best-effort for hosts that expose removers
        }
      });
    };
  }, [getKit, ready]);

  /**
   * Requests the connected wallet via MiniKit and stores a validated session.
   */
  const connectWallet = useCallback(async (): Promise<MiniAppSession> => {
    const kit = requireKit();
    if (!kit.wallet?.requestAccounts || !kit.wallet.signMessage) {
      throw new Error('MiniKit wallet API is not available in this host.');
    }

    try {
      const accounts = await kit.wallet.requestAccounts();
      const address = accounts?.[0];
      if (!address) {
        throw new Error('No wallet address was returned by the host.');
      }

      const message = `SN Reader session proof @ ${new Date().toISOString()}`;
      const signature = (await kit.wallet.signMessage({ message })) as Hex;

      await verifySignature(kit, address, message, signature);

      let nextSession: MiniAppSession | null = null;
      setContext((prev) => {
        nextSession = {
          ...prev,
          address,
          sessionMessage: message,
          sessionSignature: signature,
        };
        return nextSession;
      });
      setLastError(null);

      return (
        nextSession ?? {
          address,
          sessionMessage: message,
          sessionSignature: signature,
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown wallet error';
      setLastError(message);
      throw error;
    }
  }, [requireKit, verifySignature]);

  /**
   * Signs an arbitrary message after confirming that the signature matches the connected wallet.
   */
  const signMessage = useCallback(
    async (message: string): Promise<Hex> => {
      const kit = requireKit();
      const address = contextRef.current?.address;
      if (!address) {
        throw new Error('Connect a wallet before signing messages.');
      }
      if (!kit.wallet?.signMessage) {
        throw new Error('MiniKit wallet API does not support signing messages.');
      }

      try {
        const signature = (await kit.wallet.signMessage({ message })) as Hex;
        await verifySignature(kit, address, message, signature);
        setLastError(null);
        return signature;
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown signing error';
        setLastError(msg);
        throw error;
      }
    },
    [requireKit, verifySignature]
  );

  /**
   * Requests the host to open an external URL using the MiniKit navigation API when available.
   */
  const openUrl = useCallback(
    (url: string) => {
      const kit = getKit();
      if (kit?.navigation?.openUrl) {
        kit.navigation.openUrl(url);
        return;
      }
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [getKit]
  );

  /**
   * Closes the Mini App gracefully by delegating to the host when possible.
   */
  const close = useCallback(() => {
    const kit = getKit();
    if (kit?.close) {
      kit.close();
    } else if (typeof window !== 'undefined') {
      window.close();
    }
  }, [getKit]);

  /**
   * Sends a transaction through the MiniKit Base API after ensuring the wallet is connected.
   */
  const sendTransaction = useCallback(
    async (tx: BaseTransactionRequest) => {
      const kit = requireKit();
      if (!contextRef.current?.address) {
        throw new Error('Connect a wallet before submitting transactions.');
      }
      if (!kit.base?.sendTransaction) {
        throw new Error('MiniKit transaction API is unavailable.');
      }

      try {
        const hash = await kit.base.sendTransaction(tx);
        setLastError(null);
        return hash;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown transaction error';
        setLastError(message);
        throw error;
      }
    },
    [requireKit]
  );

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const sdkValue: MiniAppSDK = useMemo(
    () => ({
      isReady,
      isSupported,
      context,
      lastMessage,
      lastError,
      ready,
      connectWallet,
      signMessage,
      openUrl,
      close,
      sendTransaction,
      clearError,
    }),
    [
      isReady,
      isSupported,
      context,
      lastMessage,
      lastError,
      ready,
      connectWallet,
      signMessage,
      openUrl,
      close,
      sendTransaction,
      clearError,
    ]
  );

  if (!isSupported && checkedSupport) {
    return (
      <MiniAppContext.Provider value={sdkValue}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="text-center max-w-sm">
            <h2 className="text-xl font-semibold text-gray-900">{t.notSupported}</h2>
          </div>
        </div>
      </MiniAppContext.Provider>
    );
  }

  return <MiniAppContext.Provider value={sdkValue}>{children}</MiniAppContext.Provider>;
}
