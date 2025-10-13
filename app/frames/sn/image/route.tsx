import React from "react";
import { ImageResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  FRAME_IMAGE_HEIGHT,
  FRAME_IMAGE_WIDTH,
} from "@/lib/constants";
import { fetchTerritoryFeed } from "@/lib/rss";
import { formatRelativeTime } from "@/lib/time";
import { normalizeTerritory, territoryLabel } from "@/lib/territories";

export const runtime = "edge";

function frameBackground(children: React.ReactNode) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#080808",
        color: "#f9fafb",
        padding: "72px",
        justifyContent: "space-between",
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get("mode") ?? "feed";

  if (mode === "select") {
    const selected = normalizeTerritory(searchParams.get("selected")) ?? undefined;
    return new ImageResponse(
      frameBackground(
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <header style={{ fontSize: 48, fontWeight: 600 }}>Elige un territorio</header>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: 40, lineHeight: 1.3 }}>
            <span>• ~bitcoin</span>
            <span>• ~nostr</span>
            <span>• ~design</span>
            <span>• ~jobs</span>
          </div>
          <footer style={{ fontSize: 32, color: "#9ca3af", lineHeight: 1.4 }}>
            {selected
              ? `Listo: mostraremos ${selected}`
              : "También puedes escribir otro territorio con el campo de texto."}
          </footer>
        </div>,
      ),
      {
        width: FRAME_IMAGE_WIDTH,
        height: FRAME_IMAGE_HEIGHT,
      },
    );
  }

  if (mode === "empty") {
    const territory = normalizeTerritory(searchParams.get("territory")) ?? "~bitcoin";
    return new ImageResponse(
      frameBackground(
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <header style={{ fontSize: 48, fontWeight: 600 }}>{territory}</header>
          <p style={{ fontSize: 54, fontWeight: 500, maxWidth: "90%", lineHeight: 1.2 }}>
            Sin posts recientes en {territory}.
          </p>
          <footer style={{ fontSize: 36, color: "#9ca3af" }}>Prueba con otro territorio 👀</footer>
        </div>,
      ),
      {
        width: FRAME_IMAGE_WIDTH,
        height: FRAME_IMAGE_HEIGHT,
      },
    );
  }

  const territory = normalizeTerritory(searchParams.get("territory")) ?? "~bitcoin";
  const index = Number.parseInt(searchParams.get("index") ?? "0", 10) || 0;
  const feed = await fetchTerritoryFeed(territory);
  const safeIndex = Math.min(Math.max(index, 0), Math.max(feed.items.length - 1, 0));
  const item = feed.items[safeIndex];

  if (!item) {
    return new ImageResponse(
      frameBackground(
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <header style={{ fontSize: 48, fontWeight: 600 }}>{territory}</header>
          <p style={{ fontSize: 54, fontWeight: 500 }}>Sin contenido disponible.</p>
        </div>,
      ),
      {
        width: FRAME_IMAGE_WIDTH,
        height: FRAME_IMAGE_HEIGHT,
      },
    );
  }

  const relativeTime = formatRelativeTime(item.isoDate);
  const lines = [item.creator, item.sats ? `${item.sats} sats` : null, relativeTime]
    .filter(Boolean)
    .join(" • ");

  return new ImageResponse(
    frameBackground(
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 48, fontWeight: 600 }}>{territory}</span>
          <span style={{ fontSize: 36, color: "#9ca3af" }}>
            {safeIndex + 1}/{feed.items.length}
          </span>
        </header>
        <main style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{item.title}</h1>
          {lines ? <p style={{ fontSize: 36, color: "#d1d5db" }}>{lines}</p> : null}
        </main>
        <footer style={{ fontSize: 32, color: "#9ca3af" }}>stacker.news/{territoryLabel(territory)}</footer>
      </div>,
    ),
    {
      width: FRAME_IMAGE_WIDTH,
      height: FRAME_IMAGE_HEIGHT,
    },
  );
}
