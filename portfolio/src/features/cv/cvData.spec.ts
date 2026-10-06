import { describe, expect, it } from "vitest";
import { formatDate, formatRange, splitValues } from "./cvData";

describe("CV data formatting", () => {
  it("keeps backend date strings that are not ISO dates", () => {
    expect(formatRange("Spring 2020", "Autumn 2021", "en", "Present")).toBe(
      "Spring 2020 — Autumn 2021",
    );
  });

  it("uses the translated present label for an open range", () => {
    expect(formatRange("2024-01-01", undefined, "en", "Present")).toContain("Present");
  });

  it("splits comma-separated API values", () => {
    expect(splitValues("Go, React, Kubernetes")).toEqual(["Go", "React", "Kubernetes"]);
  });

  it("removes empty values from comma-separated API fields", () => {
    expect(splitValues("Go, , React,")).toEqual(["Go", "React"]);
    expect(splitValues(undefined)).toEqual([]);
  });

  it("formats valid ISO dates and preserves invalid values", () => {
    expect(formatDate("2024-01-15", "en")).toMatch(/Jan 2024/);
    expect(formatDate("2024-99-99", "en")).toBe("2024-99-99");
    expect(formatDate(undefined, "en")).toBe("");
  });
});
