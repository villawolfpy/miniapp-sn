export function formatRelativeTime(dateIso?: string): string | null {
  if (!dateIso) {
    return null;
  }
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (60 * 1000));
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 1) {
    return "ahora";
  }

  const units = [
    { limit: 60, value: "minute", divisor: 1 },
    { limit: 24 * 60, value: "hour", divisor: 60 },
    { limit: 30 * 24 * 60, value: "day", divisor: 24 * 60 },
    { limit: 365 * 24 * 60, value: "month", divisor: 30 * 24 * 60 },
  ] as const;

  for (const unit of units) {
    if (absMinutes < unit.limit) {
      const value = Math.round(diffMinutes / unit.divisor);
      return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(value, unit.value as Intl.RelativeTimeFormatUnit);
    }
  }

  const years = Math.round(diffMinutes / (365 * 24 * 60));
  return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(years, "year");
}
