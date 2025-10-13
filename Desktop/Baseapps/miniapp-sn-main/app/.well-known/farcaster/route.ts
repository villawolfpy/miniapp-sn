import { NextResponse } from "next/server";
import { minikitConfig } from "@/lib/config"; // adjust the path according to your structure

export async function GET() {
  const { miniapp, accountAssociation } = minikitConfig;

  // Build the manifest from your existing config
  const manifest = {
    name: miniapp.name,
    iconUrl: miniapp.iconUrl,
    homeUrl: miniapp.homeUrl,
    appUrl: miniapp.homeUrl, // alias used by some viewers
    description: miniapp.description || undefined,
    screenshotUrls: miniapp.screenshotUrls?.length
      ? miniapp.screenshotUrls
      : undefined,
    splash: {
      imageUrl: miniapp.splashImageUrl,
      backgroundColor: miniapp.splashBackgroundColor,
    },
    // Expose account association if you need it from the manifest
    accountAssociation: {
      header: accountAssociation.header,
      payload: accountAssociation.payload,
      signature: accountAssociation.signature,
    },
    // Optional fields useful for stores/preview
    author: { name: miniapp.name, url: miniapp.homeUrl },
    categories: [miniapp.primaryCategory],
    tags: miniapp.tags,
    heroImageUrl: miniapp.heroImageUrl,
    tagline: miniapp.tagline,
    ogTitle: miniapp.ogTitle,
    ogDescription: miniapp.ogDescription,
    ogImageUrl: miniapp.ogImageUrl,
    version: miniapp.version,
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    },
  });
}