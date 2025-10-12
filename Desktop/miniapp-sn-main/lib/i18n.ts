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
    share: 'Share',
    signin: 'Sign In',
    openInSN: 'Open in Stacker News',
    notSupported: 'Mini Apps not supported',
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
    share: 'Compartir',
    signin: 'Iniciar Sesión',
    openInSN: 'Abrir en Stacker News',
    notSupported: 'Mini Apps no soportado',
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
