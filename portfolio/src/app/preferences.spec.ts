import { describe, expect, it } from "vitest";
import { isLanguage, isTheme, resolveLanguage, resolveTheme } from "./preferences";

describe("resolveLanguage", () => {
  it("prefers a supported URL language", () => {
    expect(resolveLanguage("kz", "en")).toBe("kz");
  });

  it("falls back to English for unsupported values", () => {
    expect(resolveLanguage("de", "fr")).toBe("en");
  });

  it("uses a saved language when the URL has no supported value", () => {
    expect(resolveLanguage(null, "kz")).toBe("kz");
  });

  it("recognizes only supported languages", () => {
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage("kk")).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });
});

describe("resolveTheme", () => {
  it("uses an explicit saved theme", () => {
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("uses the operating-system preference on first visit", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("recognizes only supported themes", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
  });
});
