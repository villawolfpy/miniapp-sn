import { NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_TERRITORIES,
  DEFAULT_TERRITORY,
  FrameState,
} from "@/lib/constants";
import { decodeState, encodeState } from "@/lib/state";
import { getBaseUrl } from "@/lib/url";
import { normalizeTerritory } from "@/lib/territories";

export const runtime = "edge";

const BUTTON_MORE = 4;

type SelectState = FrameState & {
  stage?: "select" | "confirm";
};

function parseRequestState(body: unknown): {
  state: SelectState;
  buttonIndex: number;
  inputText: string;
} {
  if (!body || typeof body !== "object") {
    return {
      state: { territory: DEFAULT_TERRITORY, index: 0, stage: "select" },
      buttonIndex: 0,
      inputText: "",
    };
  }
  const payload = body as Record<string, any>;
  const untrustedData = (payload.untrustedData ?? {}) as Record<string, any>;
  const baseState = decodeState(untrustedData.state as string | undefined) as SelectState;
  const buttonIndex = Number(untrustedData.buttonIndex ?? 0);
  const inputText = typeof untrustedData.inputText === "string" ? untrustedData.inputText.trim() : "";
  return { state: baseState, buttonIndex, inputText };
}

export async function GET(request: NextRequest) {
  return renderSelect(request, { territory: DEFAULT_TERRITORY, index: 0, stage: "select" }, 0, "");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => undefined);
  const { state, buttonIndex, inputText } = parseRequestState(body);
  return renderSelect(request, state, buttonIndex, inputText);
}

async function renderSelect(
  request: NextRequest,
  previousState: SelectState,
  buttonIndex: number,
  inputText: string,
) {
  const baseUrl = getBaseUrl(request);
  const postUrl = `${baseUrl}/frames/sn/select`;

  let territory = previousState.territory ?? DEFAULT_TERRITORY;
  let stage: SelectState["stage"] = previousState.stage ?? "select";

  const territoryByButton = ALLOWED_TERRITORIES[buttonIndex - 1];

  if (territoryByButton) {
    territory = territoryByButton;
    stage = "confirm";
  }

  const inputTerritory = normalizeTerritory(inputText);
  if (buttonIndex === BUTTON_MORE && inputTerritory) {
    territory = inputTerritory;
    stage = "confirm";
  }

  if (stage === "confirm") {
    const stateString = encodeState({ territory, index: 0 });
    const imageUrl = `${baseUrl}/frames/sn/image?mode=select&selected=${encodeURIComponent(territory)}`;
    const feedUrl = `${baseUrl}/frames/sn?territory=${encodeURIComponent(territory)}`;

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
              label: "Ver posts",
              action: "post",
              target: feedUrl,
            },
            {
              label: "Elegir otro",
              action: "post",
              target: postUrl,
            },
          ],
          postUrl: feedUrl,
          state: stateString,
          inputText: "",
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

  const imageUrl = `${baseUrl}/frames/sn/image?mode=select`;
  const stateString = encodeState({ territory, index: 0 });

  return NextResponse.json(
    {
      frame: {
        version: "vNext",
        image: {
          url: imageUrl,
          aspectRatio: "1:1",
        },
        buttons: ALLOWED_TERRITORIES.slice(0, 3).map((territoryOption) => ({
          label: territoryOption,
          action: "post",
          target: postUrl,
        })).concat([
          {
            label: "Más…",
            action: "post",
            target: postUrl,
          },
        ]),
        postUrl,
        state: stateString,
        inputText: "Escribe ~territorio",
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
