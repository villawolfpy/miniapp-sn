declare global {
  interface Window {
    farcaster?: {
      sdk?: {
        actions?: {
          ready?: () => void;
        };
      };
    };
  }
}

export {};
