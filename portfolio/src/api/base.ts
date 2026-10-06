import { apiClient } from "./client";
import { ApiError } from "./errors";
import type { Certificate, Education, Project, Skill, WorkExperience } from "./types";

async function getOrderedList<T>(path: string): Promise<T[]> {
  const response = await fetch(`https://api.nzhussup.dev/v1/${path}`);
  if (!response.ok) throw new ApiError(response.status);
  const data = (await response.json()) as T[];
  return [...data].sort(
    (left, right) =>
      ((right as { displayOrder?: number }).displayOrder ?? 0) -
      ((left as { displayOrder?: number }).displayOrder ?? 0),
  );
}

// The OpenAPI GET responses currently expose generic objects. Keep the casts at this boundary.
export const getWorkExperience = () => getOrderedList<WorkExperience>("base/work-experience");
export const getEducation = () => getOrderedList<Education>("base/education");
export const getSkills = () => getOrderedList<Skill>("base/skill");
export const getCertificates = () => getOrderedList<Certificate>("base/certificate");
export const getProjects = () => getOrderedList<Project>("base/project");

export async function getAlbumPreviews() {
  const { data, error, response } = await apiClient.GET("/v1/album", {
    params: { query: { type: "public" } },
  });
  if (error) throw new ApiError(response.status);
  return data?.data ?? [];
}

export async function getAlbum(id: string) {
  const { data, error, response } = await apiClient.GET("/v1/album/{id}", {
    params: { path: { id } },
  });
  if (error || !data?.data) throw new ApiError(response.status);
  return data.data;
}
