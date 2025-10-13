import { DEFAULT_TERRITORY, FrameState } from "./constants";
import { normalizeTerritory } from "./territories";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function encodeBase64(value: string): string {
  if (typeof btoa === "function") {
    const bytes = textEncoder.encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  // Node.js fallback
  return Buffer.from(value, "utf-8").toString("base64");
}

function decodeBase64(value: string): string {
  if (typeof atob === "function") {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return textDecoder.decode(bytes);
  }
  return Buffer.from(value, "base64").toString("utf-8");
}

export function decodeState(stateString: string | null | undefined): FrameState {
  if (!stateString) {
    return { territory: DEFAULT_TERRITORY, index: 0 };
  }
  try {
    const json = decodeBase64(stateString);
    const parsed = JSON.parse(json) as Partial<FrameState>;
    const territory = normalizeTerritory(parsed.territory ?? DEFAULT_TERRITORY) ?? DEFAULT_TERRITORY;
    const index = Number.isFinite(parsed.index) ? Math.max(0, Math.floor(parsed.index as number)) : 0;
    return { territory, index };
  } catch (error) {
    return { territory: DEFAULT_TERRITORY, index: 0 };
  }
}

export function encodeState(state: FrameState): string {
  return encodeBase64(JSON.stringify(state));
}
