import type { Project } from "../types";
import { getOrderedList } from "./orderedList";

export const getProjects = () => getOrderedList<Project>("base/project");
