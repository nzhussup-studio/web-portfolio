import { describe, expect, it } from "vitest";
import { parsePdfDescription, pdfBulletForLevel } from "./cvPdfMarkdown";

describe("parsePdfDescription", () => {
  it("preserves deep Markdown list levels and bold group labels", () => {
    const result = parsePdfDescription(`- **Project with ECB — Ongoing**
  - **Key Responsibilities**
    - Develop backend services
  - **Key Achievements**
    - Reduced cloud costs`);

    expect(result.map(({ value, level, isStrong }) => ({ value, level, isStrong }))).toEqual([
      { value: "Project with ECB — Ongoing", level: 0, isStrong: true },
      { value: "Key Responsibilities", level: 1, isStrong: true },
      { value: "Develop backend services", level: 2, isStrong: false },
      { value: "Key Achievements", level: 1, isStrong: true },
      { value: "Reduced cloud costs", level: 2, isStrong: false },
    ]);
    expect([0, 1, 2].map(pdfBulletForLevel)).toEqual(["•", "–", "·"]);
  });
});
