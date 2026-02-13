const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://miniapp-sn.vercel.app';

export const minikitConfig = {
  accountAssociation: {
    // I will fill this later (quickstart step 5)
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1' as const,
    name: 'Cubey',
    subtitle: 'Your AI Ad Companion',
    description: 'Ads',
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: '#000000',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'social',
    tags: ['marketing', 'ads', 'quickstart', 'waitlist'],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;
