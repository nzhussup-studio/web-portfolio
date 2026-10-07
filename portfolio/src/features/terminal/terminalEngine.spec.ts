import { describe, expect, it } from "vitest";
import { completeTerminalInput, executeTerminalCommand, type TerminalData } from "./terminalEngine";

const data: TerminalData = {
  about: ["About Nurzhanat"],
  work: [{ position: "Software Engineer", company: "Example", startDate: "2025", techStack: "Go" }],
  education: [{ degree: "MSc", institution: "Example University" }],
  skills: [{ category: "Backend", skillNames: "Go, Java" }],
  certificates: [{ name: "Cloud", issuer: "Example", url: "https://example.com/cloud" }],
  projects: [{ name: "Portfolio", techStack: "React", url: "https://github.com/example/portfolio" }],
  albums: [{ id: "alps", title: "Alps", type: "public", image_count: 3 }],
  links: [{ name: "GitHub", url: "https://github.com/example" }],
};

describe("terminalEngine", () => {
  it("lists and navigates the virtual portfolio", () => {
    expect(executeTerminalCommand("ls", "~", data).lines).toContain("cv/");
    expect(executeTerminalCommand("cd cv", "~", data).cwd).toBe("~/cv");
    expect(executeTerminalCommand("cd skills", "~/cv", data).cwd).toBe("~/cv/skills");
    expect(executeTerminalCommand("cat content.txt", "~/cv/skills", data).lines?.join(" ")).toContain("Go, Java");
    const tree = executeTerminalCommand("tree", "~", data).lines ?? [];
    expect(tree).toContain("│   ├── experience/");
    expect(tree).toContain("│   │   ├── content.txt");
    expect(tree.some((line) => line.includes("{"))).toBe(false);
  });

  it("maps content files to API-backed data", () => {
    expect(executeTerminalCommand("cat projects/content.txt", "~", data).lines?.join(" ")).toContain("Portfolio");
    expect(executeTerminalCommand("cat albums/content.txt", "~", data).lines?.join(" ")).toContain("3 photos");
    expect(executeTerminalCommand("cat cv/content.txt", "~", data).lines?.join(" ")).toContain("Software Engineer");
    expect(executeTerminalCommand("cat meta.txt", "~/projects", data).lines?.join(" ")).toContain("/projects");
  });

  it("handles terminal control commands safely", () => {
    expect(executeTerminalCommand("clear", "~", data).clear).toBe(true);
    expect(executeTerminalCommand("exit", "~", data).exit).toBe(true);
    expect(executeTerminalCommand("rm -rf /", "~", data).lines?.[0]).toContain("command not found");
  });

  it("renders portfolio system information with neofetch", () => {
    const output = executeTerminalCommand("neofetch", "~", data).lines?.join("\n") ?? "";
    expect(output).toContain("nurzhanat@studio");
    expect(output).toContain("OS: NZHUSSUP Studio System");
    expect(output).toContain("Projects: 1");
    expect(output).toContain("Albums: 1");
  });

  it("exposes API and footer destinations as safe link files", () => {
    expect(executeTerminalCommand("ls", "~/projects", data).lines).toContain("links/");
    expect(executeTerminalCommand("ls", "~/projects/links", data).lines).toContain("portfolio.link");
    expect(executeTerminalCommand("cat cloud.link", "~/cv/certificates/links", data).lines).toEqual(["https://example.com/cloud"]);
    expect(executeTerminalCommand("cat meta.txt", "~/projects/links", data).lines?.join(" ")).toContain("open <name>.link");
    expect(executeTerminalCommand("open portfolio.link", "~/projects/links", data).openUrl).toBe("https://github.com/example/portfolio");
    expect(executeTerminalCommand("open albums/links/alps.link", "~", data).openUrl).toBe("/albums/alps");
    expect(executeTerminalCommand("open https://example.com", "~", data).openUrl).toBeUndefined();
  });

  it("completes unique commands and section names", () => {
    expect(completeTerminalInput("whoa", "~")).toBe("whoami");
    expect(completeTerminalInput("cd pro", "~")).toBe("cd projects/");
    expect(completeTerminalInput("cat conten", "~/projects")).toBe("cat content.txt");
    expect(completeTerminalInput("open port", "~/projects/links", data)).toBe("open portfolio.link");
    expect(completeTerminalInput("cat port", "~/projects/links", data)).toBe("cat portfolio.link");
    expect(completeTerminalInput("cat links/port", "~/projects", data)).toBe("cat links/portfolio.link");
    expect(completeTerminalInput("cat li", "~/projects", data)).toBe("cat links/");
    expect(completeTerminalInput("ls proj", "~", data)).toBe("ls projects/");
  });
});
