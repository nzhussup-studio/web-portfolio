export function formatDate(value: string | undefined, locale: string): string {
  if (!value) return "";
  if (!/^\d{4}-\d{2}(-\d{2})?/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(date);
}

export function formatRange(
  start: string | undefined,
  end: string | undefined,
  locale: string,
  present: string,
) {
  const formattedStart = formatDate(start, locale);
  const formattedEnd = end ? formatDate(end, locale) : present;
  return [formattedStart, formattedEnd].filter(Boolean).join(" — ");
}

export function splitValues(value: string | undefined): string[] {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}
