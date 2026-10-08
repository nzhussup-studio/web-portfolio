import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithApp } from "@/test/render";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("exposes the approved contact links", () => {
    renderWithApp(<Footer />);

    expect(screen.getByRole("link", { name: "Nurzhanat Zhussup home" })).toHaveAttribute("href", "/");
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
