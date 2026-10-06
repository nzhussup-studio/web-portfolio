import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackToTop } from "./BackToTop";

describe("BackToTop", () => {
  it("appears after scrolling and returns to the top", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 700 });
    render(<BackToTop />);
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: "redesign.common.backToTop" });
    expect(button).toHaveClass("is-visible");
    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("stays outside the tab order near the top of the page", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    render(<BackToTop />);
    expect(screen.getByRole("button", { hidden: true })).toHaveAttribute("tabindex", "-1");
  });
});
