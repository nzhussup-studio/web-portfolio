export type PdfDescriptionLine = {
  value: string;
  isBullet: boolean;
  level: number;
  isStrong: boolean;
};

function markdownToPlainText(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^(?:#{1,6})\s+/, "")
    .replace(/(?:\*\*|__|~~|`)/g, "")
    .replace(/(^|\W)[*_]([^*_]+)[*_](?=\W|$)/g, "$1$2")
    .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1");
}

export function parsePdfDescription(description: string | undefined): PdfDescriptionLine[] {
  return description?.split(/\r?\n/).map((line) => {
    const whitespace = line.match(/^\s*/)?.[0].replace(/\t/g, "  ") ?? "";
    const trimmed = line.trim();
    const marker = trimmed.match(/^(?:[•*+-]|\d+\.)\s+/)?.[0] ?? "";
    const markdownValue = trimmed.slice(marker.length);
    const isStrong = /^(?:\*\*[^*]+\*\*|__[^_]+__)$/.test(markdownValue);

    return {
      value: markdownToPlainText(markdownValue),
      isBullet: Boolean(marker),
      level: marker ? Math.min(Math.floor(whitespace.length / 2), 5) : 0,
      isStrong,
    };
  }).filter((line) => line.value) ?? [];
}

export function pdfBulletForLevel(level: number) {
  return ["•", "–", "·"][level % 3];
}
