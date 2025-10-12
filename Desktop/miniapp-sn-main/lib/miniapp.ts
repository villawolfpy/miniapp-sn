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
  ready: () => {
    console.log('Mini app ready (fallback mode)');
  },
  signin: () => {
    console.log('Signin no disponible fuera del host');
    alert('Signin no disponible fuera del host');
  },
  composeCast: ({ text, url }) => {
    try {
      const u = new URL('https://warpcast.com/~/compose');
      u.searchParams.set('text', `${text}${url ? ' ' + url : ''}`);
      window.open(u.toString(), '_blank');
    } catch (error) {
      console.error('Error opening compose:', error);
      alert('Error al abrir el compositor');
    }
  },
  openUrl: (url) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening URL:', error);
      alert('Error al abrir la URL');
    }
  },
};

export function useMiniApp(): HostAPI {
  return (typeof window !== 'undefined' && window.__MINIAPP_HOST__) || fallback;
}
