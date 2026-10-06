import { describe, expect, it } from "vitest";
import { calculateScrollProgress } from "./cvNavigation";

describe("calculateScrollProgress", () => {
  it("returns the percentage of the scrollable page", () => {
    expect(calculateScrollProgress(750, 2000, 500)).toBe(50);
  });

  it("clamps progress and handles pages that cannot scroll", () => {
    expect(calculateScrollProgress(-20, 2000, 500)).toBe(0);
    expect(calculateScrollProgress(2000, 2000, 500)).toBe(100);
    expect(calculateScrollProgress(0, 500, 500)).toBe(0);
  });
});
