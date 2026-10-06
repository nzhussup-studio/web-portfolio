export const SUPPORTED_LANGUAGES = ["en", "kz"] as const;
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
  storedValue: string | null,
): Language {
  if (isLanguage(urlValue)) return urlValue;
  if (isLanguage(storedValue)) return storedValue;
  return "en";
}

export function resolveTheme(
  storedValue: string | null,
  prefersDark: boolean,
): Theme {
  if (isTheme(storedValue)) return storedValue;
  return prefersDark ? "dark" : "light";
}
