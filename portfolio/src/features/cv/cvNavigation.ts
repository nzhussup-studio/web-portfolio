export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  viewportHeight: number,
) {
  const scrollableDistance = scrollHeight - viewportHeight;
  if (scrollableDistance <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollTop / scrollableDistance) * 100));
}
