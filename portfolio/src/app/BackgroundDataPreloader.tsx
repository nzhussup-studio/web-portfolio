import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeys } from "@/api";
import {
  getAlbumPreviews,
  getCertificates,
  getEducation,
  getProjects,
  getSkills,
  getWorkExperience,
} from "@/api/queries";

export function BackgroundDataPreloader() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const preload = () => {
      void queryClient
        .query({ queryKey: queryKeys.cv.work, queryFn: getWorkExperience })
        .catch(() => undefined);
      void queryClient
        .query({ queryKey: queryKeys.cv.education, queryFn: getEducation })
        .catch(() => undefined);
      void queryClient
        .query({ queryKey: queryKeys.cv.skills, queryFn: getSkills })
        .catch(() => undefined);
      void queryClient
        .query({
          queryKey: queryKeys.cv.certificates,
          queryFn: getCertificates,
        })
        .catch(() => undefined);
      void queryClient
        .query({ queryKey: queryKeys.projects.list, queryFn: getProjects })
        .catch(() => undefined);
      void queryClient
        .query({ queryKey: queryKeys.albums.list, queryFn: getAlbumPreviews })
        .catch(() => undefined);
    };

    if ("requestIdleCallback" in window) {
      const callbackID = window.requestIdleCallback(preload, { timeout: 2_000 });
      return () => window.cancelIdleCallback(callbackID);
    }

    const timeoutID = globalThis.setTimeout(preload, 0);
    return () => globalThis.clearTimeout(timeoutID);
  }, [queryClient]);

  return null;
}
