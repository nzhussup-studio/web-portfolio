import { describe, expect, it } from "vitest";
import { formatRange, splitValues } from "./cvData";

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
});
