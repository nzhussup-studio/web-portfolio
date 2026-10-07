const SKIPPED_PARENTS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);

function textNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIPPED_PARENTS.has(parent.tagName) || !node.textContent?.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

export function captureText(root: HTMLElement): string[] {
  return textNodes(root).map((node) => node.data);
}

export function rewrittenText(previous: string, next: string, progress: number): string {
  if (progress >= 1) return next;
  if (progress <= 0) return previous;

  const leading = next.match(/^\s*/)?.[0] ?? "";
  const trailing = next.match(/\s*$/)?.[0] ?? "";
  const previousCore = previous.trim();
  const nextCore = next.trim();
  const revealed = Math.floor(nextCore.length * progress);
  const remainder = previousCore.slice(Math.min(revealed, previousCore.length));
  return `${leading}${nextCore.slice(0, revealed)}${remainder}${trailing}`;
}

export function rewriteText(
  root: HTMLElement,
  previousText: string[],
  duration = 950,
): Promise<void> {
  const nodes = textNodes(root);
  const entries = nodes.flatMap((node, index) => {
    const previous = previousText[index];
    if (previous === undefined || previous === node.data) return [];
    const next = node.data;
    node.data = previous;
    return [{ node, previous, next, delay: Math.min(index * 9, 260) }];
  });

  if (!entries.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    entries.forEach(({ node, next }) => { node.data = next; });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startedAt = performance.now();
    const totalDuration = duration + Math.max(...entries.map(({ delay }) => delay));

    function frame(now: number) {
      const elapsed = now - startedAt;
      entries.forEach(({ node, previous, next, delay }) => {
        const progress = Math.min(1, Math.max(0, (elapsed - delay) / duration));
        node.data = rewrittenText(previous, next, progress);
      });

      if (elapsed < totalDuration) requestAnimationFrame(frame);
      else {
        entries.forEach(({ node, next }) => { node.data = next; });
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}
