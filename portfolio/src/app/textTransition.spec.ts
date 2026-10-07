import { describe, expect, it } from "vitest";
import { rewrittenText } from "./textTransition";

describe("rewrittenText", () => {
  it("keeps the original text before the rewrite begins", () => {
    expect(rewrittenText("Projects", "Жобалар", 0)).toBe("Projects");
  });

  it("replaces the text progressively from left to right", () => {
    expect(rewrittenText("Projects", "Жобалар", 0.5)).toBe("Жобjects");
  });

  it("returns the exact translation when complete", () => {
    expect(rewrittenText(" Projects ", " Жобалар ", 1)).toBe(" Жобалар ");
  });
});
