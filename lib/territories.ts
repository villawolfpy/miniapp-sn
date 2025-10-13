export function normalizeTerritory(input: string | null | undefined): string | null {
  if (!input) {
    return null;
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const normalized = trimmed.startsWith("~") ? trimmed : `~${trimmed}`;
  return normalized.toLowerCase();
}

export function territoryLabel(territory: string): string {
  return territory.startsWith("~") ? territory.substring(1) : territory;
}
