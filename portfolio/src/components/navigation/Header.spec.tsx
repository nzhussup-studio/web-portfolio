import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "../../test/render";
import { Header } from "./Header";

describe("Header", () => {
  it("renders navigation and exposes preference controls", () => {
    const changeLanguage = vi.fn();
    const toggleTheme = vi.fn();
    renderWithApp(
      <Header
        language="en"
        onLanguageChange={changeLanguage}
        theme="light"
        onThemeToggle={toggleTheme}
      />,
      { route: "/projects" },
    );

    expect(screen.getByRole("link", { name: "Nurzhanat Zhussup home" }).querySelector("img")).toHaveAttribute("src", "/brand/nz-light.svg");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass("is-active");
    fireEvent.click(screen.getByRole("button", { name: "Қазақ тіліне ауысу" }));
    expect(changeLanguage).toHaveBeenCalledWith("kz");
    fireEvent.click(screen.getByRole("button", { name: "Use dark theme" }));
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("renders Kazakh navigation and switches back to English", () => {
    const changeLanguage = vi.fn();
    renderWithApp(
      <Header
        language="kz"
        onLanguageChange={changeLanguage}
        theme="dark"
        onThemeToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole("link", { name: "Nurzhanat Zhussup home" }).querySelector("img")).toHaveAttribute("src", "/brand/nz-dark.svg");
    expect(screen.getByRole("link", { name: "Мен туралы" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });
});
