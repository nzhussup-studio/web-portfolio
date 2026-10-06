import type { Language } from "../app/preferences";

export const queryKeys = {
  about: {
    summary: (language: Language) => ["about", "summary", language] as const,
  },
  albums: {
    list: ["albums", "public"] as const,
    detail: (id: string) => ["albums", "detail", id] as const,
  },
  cv: {
    work: ["cv", "work"] as const,
    education: ["cv", "education"] as const,
    skills: ["cv", "skills"] as const,
    certificates: ["cv", "certificates"] as const,
  },
  projects: {
    list: ["projects"] as const,
  },
} as const;
