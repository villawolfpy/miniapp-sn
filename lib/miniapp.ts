'use client';

import { createContext, useContext } from 'react';

/**
 * Hexadecimal string helper type (0x-prefixed) used for addresses, signatures, and transaction values.
 */
export type Hex = `0x${string}`;

/**
 * EVM address helper type constrained to a 0x-prefixed string.
 */
export type Address = `0x${string}`;

/**
 * Base transaction payload supported by MiniKit when relaying requests to the connected wallet.
 */
export interface BaseTransactionRequest {
  to: Address;
  value?: Hex;
  data?: Hex;
  gas?: Hex;
}

/**
 * Session data returned after the Mini App is initialized or a wallet connection is established.
 */
export interface MiniAppSession {
  address?: Address;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  chainId?: number;
  sessionMessage?: string;
  sessionSignature?: Hex;
}

/**
 * Shape of the object exposed through context to client components.
 */
export interface MiniAppSDK {
  isReady: boolean;
  isSupported: boolean;
  context: MiniAppSession | null;
  lastMessage: unknown;
  lastError: string | null;
  /**
   * Marks the Mini App as ready so the host can hide the splash screen.
   */
  ready: () => void;
  /**
   * Requests a wallet connection and returns the hydrated session data.
   */
  connectWallet: () => Promise<MiniAppSession>;
  /**
   * Asks the connected wallet to sign a message and validates the signature before returning it.
   */
  signMessage: (message: string) => Promise<Hex>;
  /**
   * Triggers the host to open an external URL.
   */
  openUrl: (url: string) => void;
  /**
   * Requests the host to close the Mini App view.
   */
  close: () => void;
  /**
   * Sends a transaction through the connected wallet on Base.
   */
  sendTransaction: (tx: BaseTransactionRequest) => Promise<string>;
  /**
   * Clears the last captured error.
   */
  clearError: () => void;
}

/**
 * React context carrying the MiniKit SDK helpers so any component can interact with the host.
 */
export const MiniAppContext = createContext<MiniAppSDK | null>(null);

/**
 * Hook that surfaces the MiniKit helpers. Must be used under a MiniAppProvider.
 */
export function useMiniApp(): MiniAppSDK {
  const context = useContext(MiniAppContext);
  if (!context) {
    throw new Error('useMiniApp must be used within a MiniAppProvider');
  }
  return context;
}
