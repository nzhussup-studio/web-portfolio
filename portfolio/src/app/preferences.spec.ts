import { describe, expect, it } from "vitest";
import { isLanguage, isTheme, resolveLanguage, resolveTheme } from "./preferences";

describe("resolveLanguage", () => {
  it("prefers a supported URL language", () => {
    expect(resolveLanguage("kk")).toBe("kk");
  });

  it("falls back to English for unsupported values", () => {
    expect(resolveLanguage("de")).toBe("en");
  });

  it("uses English when the URL has no language", () => {
    expect(resolveLanguage(null)).toBe("en");
  });

  it("recognizes only supported languages", () => {
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage("kk")).toBe(true);
    expect(isLanguage("de")).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });
});

describe("resolveTheme", () => {
  it("prefers a supported URL theme", () => {
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("uses light when the URL has no theme", () => {
    expect(resolveTheme(null)).toBe("light");
  });

  it("recognizes only supported themes", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
  });
});
