import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("exposes the approved contact links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:zhussup.nb@gmail.com",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/nzhussup",
    );
    expect(screen.getByRole("link", { name: /studio/i })).toHaveAttribute(
      "href",
      "https://github.com/nzhussup-studio",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/nurzhanat-zhussup/",
    );
  });
});
