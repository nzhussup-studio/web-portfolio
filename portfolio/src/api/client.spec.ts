import { describe, expect, it } from "vitest";
import { API_ORIGIN, assertData, resolveApiAsset } from "./client";

describe("resolveApiAsset", () => {
  it("keeps absolute HTTP URLs unchanged", () => {
    expect(resolveApiAsset("https://cdn.example.com/photo.jpg")).toBe(
      "https://cdn.example.com/photo.jpg",
    );
    expect(resolveApiAsset("http://cdn.example.com/photo.jpg")).toBe(
      "http://cdn.example.com/photo.jpg",
    );
  });

  it("resolves API paths with or without a leading slash", () => {
    expect(resolveApiAsset("/media/photo.jpg")).toBe(`${API_ORIGIN}/media/photo.jpg`);
    expect(resolveApiAsset("media/photo.jpg")).toBe(`${API_ORIGIN}/media/photo.jpg`);
  });

  it("returns undefined when no asset URL is available", () => {
    expect(resolveApiAsset(undefined)).toBeUndefined();
    expect(resolveApiAsset("")).toBeUndefined();
  });
});

describe("assertData", () => {
  it("returns defined values without changing them", () => {
    const value = { id: 1 };
    expect(assertData(value, "Project")).toBe(value);
  });

  it("throws a useful boundary error for missing data", () => {
    expect(() => assertData(undefined, "Project")).toThrow(
      "Project response did not include data",
    );
  });
});
