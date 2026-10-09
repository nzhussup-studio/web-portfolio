import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "@/test/render";
import { Header } from "./Header";

describe("Header", () => {
  it("renders navigation and exposes preference controls", () => {
    const changeLanguage = vi.fn();
    const toggleTheme = vi.fn();
    const toggleNerdMode = vi.fn();
    renderWithApp(
      <Header
        language="en"
        onLanguageChange={changeLanguage}
        theme="light"
        onThemeToggle={toggleTheme}
        nerdModeAvailable
        onNerdModeToggle={toggleNerdMode}
      />,
      { route: "/projects" },
    );

    expect(screen.getByRole("link", { name: "Nurzhanat Zhussup home" }).querySelectorAll("img")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass("is-active");
    fireEvent.click(screen.getByRole("button", { name: "Enter Nerd Mode" }));
    expect(toggleNerdMode).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Қазақ тіліне ауысу" }));
    expect(changeLanguage).toHaveBeenCalledWith("kk");
    fireEvent.click(screen.getByRole("button", { name: "Use dark theme" }));
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("renders Kazakh navigation and switches back to English", () => {
    const changeLanguage = vi.fn();
    renderWithApp(
      <Header
        language="kk"
        onLanguageChange={changeLanguage}
        theme="dark"
        onThemeToggle={vi.fn()}
      />,
    );

    const brandImages = screen.getByRole("link", { name: "Nurzhanat Zhussup home" }).querySelectorAll("img");
    expect([...brandImages].map((image) => image.getAttribute("src"))).toEqual([
      "/brand/nz-light.svg",
      "/brand/nz-dark.svg",
    ]);
    expect(screen.getByRole("link", { name: "Мен туралы" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });
});
