import type { Metadata } from 'next';
import { minikitConfig } from '@/minikit.config';

const cfg = minikitConfig.miniapp;

export type MiniappEmbed = {
  version: '1';
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: 'launch_miniapp';
      name: string;
      url: string;
      splashImageUrl?: string;
      splashBackgroundColor?: string;
    };
  };
};

export function buildMiniappEmbed(path = '/'): MiniappEmbed {
  const url = new URL(path, cfg.homeUrl).toString();

  return {
    version: '1',
    imageUrl: cfg.heroImageUrl,
    button: {
      title: `Open ${cfg.name}`,
      action: {
        type: 'launch_miniapp',
        name: cfg.name,
        url,
        splashImageUrl: cfg.splashImageUrl,
        splashBackgroundColor: cfg.splashBackgroundColor,
      },
    },
  };
}

export function buildMiniappMetadata(path = '/'): Metadata {
  const embed = buildMiniappEmbed(path);
  const url = new URL(path, cfg.homeUrl).toString();
  const embedJson = JSON.stringify(embed);

  return {
    metadataBase: new URL(cfg.homeUrl),
    openGraph: {
      title: cfg.ogTitle || cfg.name,
      description: cfg.ogDescription || cfg.description,
      url,
      images: [cfg.ogImageUrl],
      type: 'website',
    },
    other: {
      // Farcaster spec uses "fc:frame" for embed metadata
      'fc:frame': embedJson,
    },
  };
}

export function buildManifest() {
  const { accountAssociation } = minikitConfig;

  const hasAssociation =
    accountAssociation.header &&
    accountAssociation.payload &&
    accountAssociation.signature;

  // Farcaster spec requires the key "frame", not "miniapp"
  return {
    ...(hasAssociation ? { accountAssociation } : {}),
    frame: {
      version: cfg.version,
      name: cfg.name,
      subtitle: cfg.subtitle,
      description: cfg.description,
      screenshotUrls: cfg.screenshotUrls,
      iconUrl: cfg.iconUrl,
      splashImageUrl: cfg.splashImageUrl,
      splashBackgroundColor: cfg.splashBackgroundColor,
      homeUrl: cfg.homeUrl,
      webhookUrl: cfg.webhookUrl,
      primaryCategory: cfg.primaryCategory,
      tags: cfg.tags,
      heroImageUrl: cfg.heroImageUrl,
      tagline: cfg.tagline,
      ogTitle: cfg.ogTitle,
      ogDescription: cfg.ogDescription,
      ogImageUrl: cfg.ogImageUrl,
    },
  };
}
