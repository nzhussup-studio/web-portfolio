import type { Project } from "@/api";
import { getOrderedList } from "./orderedList";

export const getProjects = () => getOrderedList<Project>("base/project");
