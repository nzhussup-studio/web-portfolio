export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function projectKey(project: { id?: number; name?: string }, index: number): string {
  return String(project.id ?? project.name ?? index);
}
