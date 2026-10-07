export const SUPPORTED_LANGUAGES = ["en", "kk"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export function isLanguage(value: string | null): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export function isTheme(value: string | null): value is Theme {
  return THEMES.includes(value as Theme);
}

export function resolveLanguage(
  urlValue: string | null,
): Language {
  if (isLanguage(urlValue)) return urlValue;
  return "en";
}

export function resolveTheme(urlValue: string | null): Theme {
  if (isTheme(urlValue)) return urlValue;
  return "light";
}
