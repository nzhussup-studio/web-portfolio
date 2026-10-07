export function shouldTransitionPage(currentPath: string, nextPath: string): boolean {
  return currentPath !== nextPath;
}
