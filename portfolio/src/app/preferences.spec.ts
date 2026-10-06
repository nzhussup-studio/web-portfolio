import { describe, expect, it } from "vitest";
import { resolveLanguage, resolveTheme } from "./preferences";

describe("resolveLanguage", () => {
  it("prefers a supported URL language", () => {
    expect(resolveLanguage("kz", "en")).toBe("kz");
  });

  it("falls back to English for unsupported values", () => {
    expect(resolveLanguage("de", "fr")).toBe("en");
  });
});

describe("resolveTheme", () => {
  it("uses an explicit saved theme", () => {
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("uses the operating-system preference on first visit", () => {
    expect(resolveTheme(null, true)).toBe("dark");
  });
});
