import { API_BASE_URL } from "../client";
import { ApiError } from "../errors";

type OrderedRecord = { displayOrder?: number };

export async function getOrderedList<T extends OrderedRecord>(path: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/${path}`);
  if (!response.ok) throw new ApiError(response.status);
  const data = (await response.json()) as T[];
  return [...data].sort(
    (left, right) => (right.displayOrder ?? 0) - (left.displayOrder ?? 0),
  );
}
