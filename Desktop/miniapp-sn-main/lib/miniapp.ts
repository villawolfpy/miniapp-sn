type HostAPI = {
  ready: () => void;
  signin: () => void;
  composeCast: (data: { text: string; url?: string }) => void;
  openUrl: (url: string) => void;
};

declare global {
  interface Window {
    __MINIAPP_HOST__?: HostAPI;
  }
}

const fallback: HostAPI = {
  ready: () => {},
  signin: () => alert('Signin no disponible fuera del host'),
  composeCast: ({ text, url }) => {
    const u = new URL('https://warpcast.com/~/compose');
    u.searchParams.set('text', `${text}${url ? ' ' + url : ''}`);
    window.open(u.toString(), '_blank');
  },
  openUrl: (url) => window.open(url, '_blank'),
};

export function useMiniApp(): HostAPI {
  return (typeof window !== 'undefined' && window.__MINIAPP_HOST__) || fallback;
}
