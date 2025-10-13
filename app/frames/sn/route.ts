import { NextRequest, NextResponse } from "next/server";

import {
  DEFAULT_TERRITORY,
  FrameState,
} from "@/lib/constants";
import { fetchTerritoryFeed } from "@/lib/rss";
import { decodeState, encodeState } from "@/lib/state";
import { getBaseUrl } from "@/lib/url";
import { normalizeTerritory } from "@/lib/territories";

export const runtime = "edge";

const BUTTON_PREV = 1;
const BUTTON_NEXT = 2;

function parseRequestState(body: unknown): {
  state: FrameState;
  buttonIndex: number;
  inputText: string;
} {
  if (!body || typeof body !== "object") {
    return { state: { territory: DEFAULT_TERRITORY, index: 0 }, buttonIndex: 0, inputText: "" };
  }
  const payload = body as Record<string, any>;
  const untrustedData = (payload.untrustedData ?? {}) as Record<string, any>;
  const state = decodeState(untrustedData.state as string | undefined);
  const buttonIndex = Number(untrustedData.buttonIndex ?? 0);
  const inputText = typeof untrustedData.inputText === "string" ? untrustedData.inputText.trim() : "";
  return { state, buttonIndex, inputText };
}

function territoryFromRequest(request: NextRequest): string | null {
  const fromQuery = request.nextUrl.searchParams.get("territory");
  return normalizeTerritory(fromQuery);
}

export async function GET(request: NextRequest) {
  return handleFrame(request, { territory: DEFAULT_TERRITORY, index: 0 }, 0, "");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => undefined);
  const { state, buttonIndex, inputText } = parseRequestState(body);
  return handleFrame(request, state, buttonIndex, inputText);
}

async function handleFrame(
  request: NextRequest,
  previousState: FrameState,
  buttonIndex: number,
  inputText: string,
) {
  const baseUrl = getBaseUrl(request);
  const territoryFromQuery = territoryFromRequest(request);

  let territory = territoryFromQuery ?? previousState.territory ?? DEFAULT_TERRITORY;
  let index = Number.isFinite(previousState.index) ? Math.max(0, Math.floor(previousState.index)) : 0;

  if (territoryFromQuery && territoryFromQuery !== previousState.territory) {
    index = 0;
  }

  if (inputText) {
    const normalizedInput = normalizeTerritory(inputText);
    if (normalizedInput) {
      territory = normalizedInput;
      index = 0;
    }
  }

  let feed;
  try {
    feed = await fetchTerritoryFeed(territory);
  } catch (error) {
    console.error("Failed to fetch feed", error);
    const stateString = encodeState({ territory, index: 0 });
    const imageUrl = `${baseUrl}/frames/sn/image?territory=${encodeURIComponent(territory)}&mode=empty`;
    return NextResponse.json(
      {
        frame: {
          version: "vNext",
          image: {
            url: imageUrl,
            aspectRatio: "1:1",
          },
          buttons: [
            {
              label: "Cambiar territorio",
              action: "post",
              target: `${baseUrl}/frames/sn/select`,
            },
          ],
          postUrl: `${baseUrl}/frames/sn`,
          state: stateString,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (feed.items.length === 0) {
    const stateString = encodeState({ territory, index: 0 });
    const imageUrl = `${baseUrl}/frames/sn/image?territory=${encodeURIComponent(territory)}&mode=empty`;
    return NextResponse.json(
      {
        frame: {
          version: "vNext",
          image: {
            url: imageUrl,
            aspectRatio: "1:1",
          },
          buttons: [
            {
              label: "Cambiar territorio",
              action: "post",
              target: `${baseUrl}/frames/sn/select`,
            },
          ],
          postUrl: `${baseUrl}/frames/sn`,
          state: stateString,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (buttonIndex === BUTTON_PREV) {
    index = Math.max(index - 1, 0);
  } else if (buttonIndex === BUTTON_NEXT) {
    index = Math.min(index + 1, feed.items.length - 1);
  }

  if (index >= feed.items.length) {
    index = feed.items.length - 1;
  }

  const item = feed.items[index];
  const stateString = encodeState({ territory, index });
  const itemLink = item.link || `https://stacker.news/${territory}`;
  const imageUrl = `${baseUrl}/frames/sn/image?territory=${encodeURIComponent(territory)}&index=${index}&mode=feed`;
  const postUrl = `${baseUrl}/frames/sn?territory=${encodeURIComponent(territory)}`;

  return NextResponse.json(
    {
      frame: {
        version: "vNext",
        image: {
          url: imageUrl,
          aspectRatio: "1:1",
        },
        buttons: [
          {
            label: "Anterior",
            action: "post",
            target: postUrl,
          },
          {
            label: "Siguiente",
            action: "post",
            target: postUrl,
          },
          {
            label: "Abrir post",
            action: "link",
            target: itemLink,
          },
          {
            label: "Cambiar territorio",
            action: "post",
            target: `${baseUrl}/frames/sn/select`,
          },
        ],
        postUrl,
        state: stateString,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
}
