import type { AlbumPreview, Certificate, Education, Project, Skill, WorkExperience } from "../../api/types";

export const TERMINAL_COMMANDS = ["help", "ls", "cd", "cat", "open", "pwd", "tree", "neofetch", "whoami", "history", "clear", "exit", "date", "echo"] as const;

export type TerminalData = {
  about: string[];
  work?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  certificates?: Certificate[];
  projects?: Project[];
  albums?: AlbumPreview[];
  links?: { name: string; url: string }[];
};

export type TerminalResult = { lines?: string[]; cwd?: string; clear?: boolean; exit?: boolean; showHistory?: boolean; openUrl?: string };

const directoryChildren: Record<string, string[]> = {
  "~": ["about/", "cv/", "projects/", "albums/", "links/"],
  "~/about": ["content.txt", "meta.txt"],
  "~/cv": ["content.txt", "meta.txt", "experience/", "education/", "skills/", "certificates/"],
  "~/cv/experience": ["content.txt", "meta.txt"],
  "~/cv/education": ["content.txt", "meta.txt"],
  "~/cv/skills": ["content.txt", "meta.txt"],
  "~/cv/certificates": ["content.txt", "meta.txt", "links/"],
  "~/cv/certificates/links": ["meta.txt"],
  "~/projects": ["content.txt", "meta.txt", "links/"],
  "~/projects/links": ["meta.txt"],
  "~/albums": ["content.txt", "meta.txt", "links/"],
  "~/albums/links": ["meta.txt"],
  "~/links": ["meta.txt"],
};

const linkFilename = (name: string) => {
  const slug = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "link"}.link`;
};

function linkFiles(path: string, data: TerminalData): Record<string, string> {
  const entries = path === "~/projects/links"
    ? (data.projects ?? []).flatMap((item) => item.url ? [{ name: value(item.name, "project"), url: item.url }] : [])
    : path === "~/cv/certificates/links"
      ? (data.certificates ?? []).flatMap((item) => item.url ? [{ name: value(item.name, "certificate"), url: item.url }] : [])
      : path === "~/albums/links"
        ? (data.albums ?? []).flatMap((item) => item.id ? [{ name: item.title, url: `/albums/${encodeURIComponent(item.id)}` }] : [])
        : path === "~/links" ? (data.links ?? []) : [];
  const files: Record<string, string> = {};
  entries.forEach((item) => {
    const base = linkFilename(item.name);
    let filename = base;
    let duplicate = 2;
    while (files[filename]) filename = base.replace(/\.link$/, `-${duplicate++}.link`);
    files[filename] = item.url;
  });
  return files;
}

const value = (input: string | undefined, fallback = "—") => input?.trim() || fallback;
const range = (start: string | undefined, end: string | undefined) => `${value(start, "?")} — ${value(end, "Present")}`;
const loading = (name: string) => [`${name}: content is still loading. Try again in a moment.`];

function formatExperience(items: WorkExperience[] | undefined) {
  if (!items) return loading("experience");
  if (!items.length) return ["No experience entries available."];
  return items.flatMap((item) => [
    `${range(item.startDate, item.endDate)}  ${value(item.position)}`,
    `${value(item.company)} · ${value(item.location)}`,
    ...value(item.description, "").split(/\r?\n/).filter(Boolean).map((line) => `  ${line}`),
    ...(item.techStack ? [`  stack: ${item.techStack}`] : []), "",
  ]);
}

function formatEducation(items: Education[] | undefined) {
  if (!items) return loading("education");
  if (!items.length) return ["No education entries available."];
  return items.flatMap((item) => [
    `${range(item.startDate, item.endDate)}  ${value(item.degree)}`,
    `${value(item.institution)} · ${value(item.location)}`,
    ...(item.thesis ? [`  thesis: ${item.thesis}`] : []),
    ...(item.description ? [`  ${item.description}`] : []), "",
  ]);
}

function formatSkills(items: Skill[] | undefined) {
  if (!items) return loading("skills");
  if (!items.length) return ["No skills available."];
  return items.map((item) => `${value(item.category).padEnd(30)} ${value(item.skillNames)}`);
}

function formatCertificates(items: Certificate[] | undefined) {
  if (!items) return loading("certificates");
  if (!items.length) return ["No certificates available."];
  return items.map((item, index) => `${String(index + 1).padStart(2, "0")}  ${value(item.name)} · ${value(item.issuer)}`);
}

function formatProjects(items: Project[] | undefined) {
  if (!items) return loading("projects");
  if (!items.length) return ["No projects available."];
  return items.flatMap((item, index) => [
    `${String(index + 1).padStart(2, "0")}  ${value(item.name)}`,
    ...(item.techStack ? [`    ${item.techStack}`] : []), ...(item.url ? [`    ${item.url}`] : []),
  ]);
}

function formatAlbums(items: AlbumPreview[] | undefined) {
  if (!items) return loading("albums");
  if (!items.length) return ["No public albums available."];
  return items.flatMap((item, index) => [
    `${String(index + 1).padStart(2, "0")}  ${item.title}  [${item.image_count ?? 0} photos]`,
    ...([item.date, item.desc].filter(Boolean).length ? [[item.date, item.desc].filter(Boolean).join(" · ")] : []),
  ]);
}

function contentForDirectory(path: string, data: TerminalData): string[] | undefined {
  switch (path) {
    case "~/about": return data.about;
    case "~/cv/experience": return formatExperience(data.work);
    case "~/cv/education": return formatEducation(data.education);
    case "~/cv/skills": return formatSkills(data.skills);
    case "~/cv/certificates": return formatCertificates(data.certificates);
    case "~/projects": return formatProjects(data.projects);
    case "~/albums": return formatAlbums(data.albums);
    case "~/cv": return ["// experience", ...formatExperience(data.work), "", "// education", ...formatEducation(data.education), "", "// skills", ...formatSkills(data.skills), "", "// certificates", ...formatCertificates(data.certificates)];
    default: return undefined;
  }
}

function metadataForDirectory(path: string) {
  const linkInstructions = (source: string) => [
    `source: ${source}`,
    "description: openable destinations represented as .link files",
    "usage: ls",
    "usage: cat <name>.link",
    "usage: open <name>.link",
    "behavior: open launches the destination in a new browser tab",
  ];
  const metadata: Record<string, string[]> = {
    "~/about": ["route: /", "source: localized portfolio content", "description: personal introduction"],
    "~/cv": ["route: /curriculum-vitae", "source: portfolio API", "contains: experience education skills certificates"],
    "~/cv/experience": ["route: /curriculum-vitae#experience", "source: GET /v1/base/work-experience"],
    "~/cv/education": ["route: /curriculum-vitae#education", "source: GET /v1/base/education"],
    "~/cv/skills": ["route: /curriculum-vitae#skills", "source: GET /v1/base/skill"],
    "~/cv/certificates": ["route: /curriculum-vitae#certificates", "source: GET /v1/base/certificate"],
    "~/cv/certificates/links": linkInstructions("certificate URLs from GET /v1/base/certificate"),
    "~/projects": ["route: /projects", "source: GET /v1/base/project"],
    "~/projects/links": linkInstructions("project URLs from GET /v1/base/project"),
    "~/albums": ["route: /albums", "source: GET /v1/album?type=public"],
    "~/albums/links": linkInstructions("public album routes from GET /v1/album?type=public"),
    "~/links": linkInstructions("site footer contact and profile links"),
  };
  return metadata[path];
}

function resolvePath(cwd: string, target: string) {
  const expanded = target.startsWith("/home/nurzhanat") ? `~${target.slice("/home/nurzhanat".length)}`
    : target.startsWith("~") ? target : target.startsWith("/") ? `~${target}` : `${cwd}/${target}`;
  const segments = expanded.replace(/^~\/?/, "").split("/").filter(Boolean);
  const normalized: string[] = [];
  for (const segment of segments) {
    if (segment === ".") continue;
    if (segment === "..") normalized.pop();
    else normalized.push(segment);
  }
  return normalized.length ? `~/${normalized.join("/")}` : "~";
}

const displayPath = (path: string) => path === "~" ? "/home/nurzhanat" : `/home/nurzhanat/${path.slice(2)}`;

function listDirectory(path: string, detailed: boolean, data: TerminalData) {
  const children = directoryChildren[path];
  if (!children) return undefined;
  const items = [...children, ...Object.keys(linkFiles(path, data))];
  if (!detailed) return items;
  return ["drwxr-xr-x  .", "drwxr-xr-x  ..", ...items.map((item) => `${item.endsWith("/") ? "drwxr-xr-x" : "-rw-r--r--"}  ${item}`)];
}

function treeForDirectory(path: string, data: TerminalData) {
  const lines = ["."];
  const walk = (directory: string, prefix: string) => {
    const items = [...(directoryChildren[directory] ?? []), ...Object.keys(linkFiles(directory, data))];
    items.forEach((item, index) => {
      const last = index === items.length - 1;
      lines.push(`${prefix}${last ? "└──" : "├──"} ${item}`);
      if (item.endsWith("/")) {
        const child = resolvePath(directory, item.slice(0, -1));
        walk(child, `${prefix}${last ? "    " : "│   "}`);
      }
    });
  };
  walk(path, "");
  return lines;
}

function readFile(cwd: string, target: string, data: TerminalData) {
  const path = resolvePath(cwd, target);
  const slash = path.lastIndexOf("/");
  const directory = slash < 2 ? "~" : path.slice(0, slash);
  const filename = path.slice(slash + 1);
  const link = linkFiles(directory, data)[filename];
  if (link) return [link];
  if (!directoryChildren[directory]?.includes(filename)) return undefined;
  if (filename === "content.txt") return contentForDirectory(directory, data);
  if (filename === "meta.txt") return metadataForDirectory(directory);
  return undefined;
}

function resolveLink(cwd: string, target: string, data: TerminalData) {
  const path = resolvePath(cwd, target);
  const slash = path.lastIndexOf("/");
  const directory = slash < 2 ? "~" : path.slice(0, slash);
  const filename = path.slice(slash + 1);
  if (!filename.endsWith(".link")) return undefined;
  return linkFiles(directory, data)[filename];
}

function neofetch(data: TerminalData) {
  const projectCount = data.projects?.length ?? 0;
  const certificateCount = data.certificates?.length ?? 0;
  const albumCount = data.albums?.length ?? 0;
  return [
    "███╗   ██╗███████╗    nurzhanat@studio",
    "████╗  ██║╚══███╔╝    ----------------",
    "██╔██╗ ██║  ███╔╝     OS: NZHUSSUP Studio System",
    "██║╚██╗██║ ███╔╝      Host: nzhussup.dev",
    "██║ ╚████║███████╗     Kernel: portfolio-web",
    "╚═╝  ╚═══╝╚══════╝     Shell: bash 5.x",
    "                       Interface: terminal",
    "                       Role: Software Engineer",
    "                       Location: Vienna, Austria",
    `                       Projects: ${projectCount}`,
    `                       Certificates: ${certificateCount}`,
    `                       Albums: ${albumCount}`,
    "                       Theme: mineral graphite",
    "",
    "● ● ● ● ● ● ● ●",
  ];
}

export function executeTerminalCommand(rawInput: string, cwd: string, data: TerminalData): TerminalResult {
  const input = rawInput.trim();
  if (!input) return {};
  const [rawCommand, ...args] = input.split(/\s+/);
  const command = rawCommand.toLowerCase();

  if (command === "exit") return { exit: true };
  if (command === "clear") return { clear: true };
  if (command === "history") return { showHistory: true };
  if (command === "date") return { lines: [new Date().toString()] };
  if (command === "echo") return { lines: [args.join(" ")] };
  if (command === "whoami") return { lines: ["nurzhanat"] };
  if (command === "pwd") return { lines: [displayPath(cwd)] };
  if (command === "neofetch") return { lines: neofetch(data) };
  if (command === "help") return { lines: [
    "GNU bash, version 5.x — portfolio shell", "", "Available commands:",
    "  ls [-la]       list directory contents", "  cd <path>      change directory", "  cat <file>     print a file",
    "  open <file>    open a .link file in a new tab",
    "  pwd            print working directory", "  tree           display the directory tree", "  neofetch       display system information", "  whoami         print the current user",
    "  history        print command history", "  date           print the current date", "  echo <text>    print text",
    "  clear          clear the terminal", "  exit           return to the graphical interface", "", "Navigate into a section, then run: cat content.txt",
  ] };
  if (command === "ls") {
    const target = args.find((arg) => !arg.startsWith("-"));
    const path = target ? resolvePath(cwd, target) : cwd;
    const lines = listDirectory(path, args.some((arg) => arg.includes("a") || arg.includes("l")), data);
    return { lines: lines ?? [`ls: cannot access '${target}': No such file or directory`] };
  }
  if (command === "tree") return { lines: treeForDirectory(cwd, data) };
  if (command === "cd") {
    const target = args[0] ?? "~";
    const path = resolvePath(cwd, target);
    return directoryChildren[path] ? { cwd: path } : { lines: [`bash: cd: ${target}: No such file or directory`] };
  }
  if (command === "cat") {
    if (!args.length) return { lines: ["cat: missing operand"] };
    return { lines: args.flatMap((target) => readFile(cwd, target, data) ?? [`cat: ${target}: No such file or directory`]) };
  }
  if (command === "open") {
    if (!args.length) return { lines: ["open: missing operand"] };
    if (args.length > 1) return { lines: ["open: too many operands"] };
    const url = resolveLink(cwd, args[0], data);
    return url ? { lines: [`Opening ${args[0]}…`], openUrl: url } : { lines: [`open: ${args[0]}: No such link file`] };
  }
  return { lines: [`bash: ${command}: command not found`] };
}

export function completeTerminalInput(input: string, cwd: string, data?: TerminalData) {
  const parts = input.split(/\s+/);
  const fragment = parts.at(-1) ?? "";
  let options: string[];

  if (parts.length === 1) {
    options = [...TERMINAL_COMMANDS];
  } else {
    const slash = fragment.lastIndexOf("/");
    const pathPrefix = slash >= 0 ? fragment.slice(0, slash + 1) : "";
    const nameFragment = slash >= 0 ? fragment.slice(slash + 1) : fragment;
    const searchDirectory = pathPrefix ? resolvePath(cwd, pathPrefix) : cwd;
    const staticEntries = directoryChildren[searchDirectory] ?? [];
    const generatedLinks = Object.keys(linkFiles(searchDirectory, data ?? { about: [] }));
    const command = parts[0].toLowerCase();
    const entries = command === "cd"
      ? [...staticEntries.filter((item) => item.endsWith("/")), ...(pathPrefix ? [] : ["../", "~/"])]
      : command === "cat"
        ? [...staticEntries, ...generatedLinks]
        : command === "open"
          ? [...staticEntries.filter((item) => item.endsWith("/")), ...generatedLinks]
          : command === "ls" ? [...staticEntries, ...generatedLinks] : [];
    options = entries
      .filter((option) => option.toLowerCase().startsWith(nameFragment.toLowerCase()))
      .map((option) => `${pathPrefix}${option}`);
  }

  const matches = parts.length === 1
    ? options.filter((option) => option.startsWith(fragment.toLowerCase()))
    : options;
  if (!matches.length) return input;
  const completion = matches.length === 1
    ? matches[0]
    : matches.reduce((prefix, match) => {
      let index = 0;
      while (index < prefix.length && index < match.length && prefix[index].toLowerCase() === match[index].toLowerCase()) index++;
      return prefix.slice(0, index);
    });
  if (completion.length <= fragment.length) return input;
  parts[parts.length - 1] = completion;
  return parts.join(" ");
}
