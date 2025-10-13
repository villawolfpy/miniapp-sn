export const DEFAULT_TERRITORY = process.env.DEFAULT_TERRITORY ?? "~bitcoin";
export const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS ?? 300);
export const ALLOWED_TERRITORIES = (process.env.ALLOWED_TERRITORIES ?? "~bitcoin,~nostr,~design,~jobs")
  .split(",")
  .map((territory) => territory.trim())
  .filter(Boolean);

export type FrameState = {
  territory: string;
  index: number;
};

export const FRAME_IMAGE_WIDTH = 1200;
export const FRAME_IMAGE_HEIGHT = 1200;
