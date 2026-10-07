import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useEffect, useRef, useState, type AnimationEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { getAlbumPreviews } from "../../api/queries/albums";
import { getCertificates, getEducation, getSkills, getWorkExperience } from "../../api/queries/cv";
import { getProjects } from "../../api/queries/projects";
import { queryKeys } from "../../api/queryKeys";
import { profile } from "../../app/profile";
import { completeTerminalInput, executeTerminalCommand, type TerminalData } from "./terminalEngine";

type TerminalLine = { id: number; kind: "system" | "prompt" | "output" | "error"; text: string };

const initialLines: TerminalLine[] = [
  { id: 1, kind: "system", text: "NZHUSSUP STUDIO SYSTEM" },
  { id: 2, kind: "output", text: "interface: terminal" },
  { id: 3, kind: "output", text: "content: connected" },
  { id: 4, kind: "output", text: "" },
  { id: 5, kind: "output", text: "Type `help` or `ls` to get started." },
];

export function NerdTerminal({ onExit }: { onExit: () => void }) {
  const { t } = useTranslation();
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [closing, setClosing] = useState(false);
  const nextLineId = useRef(6);
  const exitCommitted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const work = useQuery({ queryKey: queryKeys.cv.work, queryFn: getWorkExperience });
  const education = useQuery({ queryKey: queryKeys.cv.education, queryFn: getEducation });
  const skills = useQuery({ queryKey: queryKeys.cv.skills, queryFn: getSkills });
  const certificates = useQuery({ queryKey: queryKeys.cv.certificates, queryFn: getCertificates });
  const projects = useQuery({ queryKey: queryKeys.projects.list, queryFn: getProjects });
  const albums = useQuery({ queryKey: queryKeys.albums.list, queryFn: getAlbumPreviews });

  const data: TerminalData = {
    about: [
      t("portfolio.about.subtitle"),
      "",
      t("portfolio.about.intro1"),
      t("portfolio.about.intro2"),
    ],
    work: work.isSuccess ? work.data : undefined,
    education: education.isSuccess ? education.data : undefined,
    skills: skills.isSuccess ? skills.data : undefined,
    certificates: certificates.isSuccess ? certificates.data : undefined,
    projects: projects.isSuccess ? projects.data : undefined,
    albums: albums.isSuccess ? albums.data : undefined,
    links: [
      { name: "Email", url: `mailto:${profile.email}` },
      { name: "GitHub", url: profile.githubUrl },
      { name: "Studio", url: profile.githubOrganizationUrl },
      { name: "LinkedIn", url: profile.linkedinUrl },
    ],
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function append(kind: TerminalLine["kind"], text: string) {
    return { id: nextLineId.current++, kind, text };
  }

  function runCommand() {
    const command = input.trim();
    if (!command) return;
    const result = executeTerminalCommand(command, cwd, data);

    if (result.openUrl) {
      const opened = window.open(result.openUrl, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    }

    if (result.exit) {
      setClosing(true);
      return;
    }

    const nextHistory = [...history, command];
    setHistory(nextHistory);
    setHistoryIndex(-1);
    setInput("");

    if (result.clear) {
      setLines([]);
      return;
    }

    const output = result.showHistory
      ? nextHistory.map((entry, index) => `${String(index + 1).padStart(3, " ")}  ${entry}`)
      : result.lines ?? [];
    const isError = output.some((line) => {
      const normalized = line.toLowerCase();
      return normalized.includes("not found") || normalized.includes("no such") || normalized.includes("missing");
    });
    setLines((current) => [
      ...current,
      append("prompt", `nurzhanat@studio:${cwd}$ ${command}`),
      ...output.map((line) => append(isError ? "error" : "output", line)),
    ]);
    if (result.cwd) setCwd(result.cwd);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setClosing(true);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      setInput((current) => completeTerminalInput(current, cwd, data));
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      setLines((current) => [...current, append("prompt", `nurzhanat@studio:${cwd}$ ${input}^C`)]);
      setInput("");
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  }

  function finishPowerAnimation(event: AnimationEvent<HTMLElement>) {
    if (event.target === event.currentTarget && closing && !exitCommitted.current) {
      exitCommitted.current = true;
      onExit();
    }
  }

  return (
    <section
      className={`nerd-terminal${closing ? " is-powering-off" : ""}`}
      aria-label="Nerd Mode terminal"
      onClick={() => inputRef.current?.focus()}
      onAnimationEnd={finishPowerAnimation}
    >
      <header className="terminal-bar">
        <div className="terminal-brand"><span aria-hidden="true">NZ.</span> NZHUSSUP STUDIO SYSTEM</div>
        <button type="button" onClick={() => setClosing(true)} aria-label="Exit Nerd Mode" disabled={closing}>
          <LogOut aria-hidden="true" />
          <span>Exit</span>
        </button>
      </header>
      <div className="terminal-screen" role="log" aria-live="polite" aria-relevant="additions">
        {lines.map((line) => <div className={`terminal-line terminal-${line.kind}`} key={line.id}>{line.text || "\u00a0"}</div>)}
        <label className="terminal-input-row">
          <span aria-hidden="true">nurzhanat@studio:{cwd}$</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={closing}
          />
        </label>
        <div ref={endRef} />
      </div>
    </section>
  );
}
