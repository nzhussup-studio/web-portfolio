import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithApp } from "@/test/render";
import { BrandMark } from "./BrandMark";

describe("BrandMark", () => {
  it("uses the explicit theme asset when provided", () => {
    renderWithApp(<BrandMark theme="dark" />);
    expect(screen.getByRole("link", { name: "Nurzhanat Zhussup home" }).querySelector("img")).toHaveAttribute("src", "/brand/nz-dark.svg");
  });
});
