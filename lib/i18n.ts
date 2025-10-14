export type Locale = 'en' | 'es';

const translations = {
  en: {
    appName: 'SN Reader',
    selectTerritory: 'Select Territory',
    loading: 'Loading...',
    error: 'Error loading posts',
    retry: 'Retry',
    points: 'points',
    by: 'by',
    share: 'Share Proof',
    signin: 'Sign In',
    connectWallet: 'Connect Wallet',
    connecting: 'Connecting...',
    connectedAs: 'Connected as',
    sessionVerified: 'Session proof verified',
    sessionFailed: 'Unable to verify wallet signature',
    sessionSignature: 'Latest signature',
    sessionMessageLabel: 'Signed message',
    shareProofTitle: 'Signed endorsement',
    shareProofMessage: 'Message',
    shareProofSignature: 'Signature',
    signMessage: 'Sign Post Proof',
    openInSN: 'Open in Stacker News',
    tipButton: 'Tip creator (0.0001 ETH)',
    tipSuccess: 'Tip transaction submitted',
    tipError: 'Unable to submit tip',
    tipHashLabel: 'Transaction hash',
    tipRequirement: 'Tips require a connected Base wallet.',
    notSupported: 'Mini Apps not supported — Please open this in a Farcaster client that supports Mini Apps.',
    openInBrowser: 'Open in Browser',
    noPostsFound: 'No posts found',
    postDetail: 'Post Detail',
  },
  es: {
    appName: 'SN Reader',
    selectTerritory: 'Seleccionar Territorio',
    loading: 'Cargando...',
    error: 'Error al cargar posts',
    retry: 'Reintentar',
    points: 'puntos',
    by: 'por',
    share: 'Compartir prueba',
    signin: 'Iniciar Sesión',
    connectWallet: 'Conectar wallet',
    connecting: 'Conectando...',
    connectedAs: 'Conectado como',
    sessionVerified: 'Prueba de sesión verificada',
    sessionFailed: 'No se pudo validar la firma de la wallet',
    sessionSignature: 'Última firma',
    sessionMessageLabel: 'Mensaje firmado',
    shareProofTitle: 'Aval firmado',
    shareProofMessage: 'Mensaje',
    shareProofSignature: 'Firma',
    signMessage: 'Firmar prueba del post',
    openInSN: 'Abrir en Stacker News',
    tipButton: 'Dar propina (0.0001 ETH)',
    tipSuccess: 'Transacción de propina enviada',
    tipError: 'No se pudo enviar la propina',
    tipHashLabel: 'Hash de la transacción',
    tipRequirement: 'Las propinas requieren una wallet de Base conectada.',
    notSupported: 'Mini Apps no soportado — Abre esto en un cliente de Farcaster que soporte Mini Apps.',
    openInBrowser: 'Abrir en Navegador',
    noPostsFound: 'No se encontraron posts',
    postDetail: 'Detalle del Post',
  },
};

export function useI18n(locale: Locale = 'en') {
  return translations[locale];
}

export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('es') ? 'es' : 'en';
}
