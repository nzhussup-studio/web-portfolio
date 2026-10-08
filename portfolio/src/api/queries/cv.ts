import type { Certificate, Education, Skill, WorkExperience } from "@/api";
import { getOrderedList } from "./orderedList";

// These casts stay at the API boundary until the OpenAPI list responses use their schemas.
export const getWorkExperience = () => getOrderedList<WorkExperience>("base/work-experience");
export const getEducation = () => getOrderedList<Education>("base/education");
export const getSkills = () => getOrderedList<Skill>("base/skill");
export const getCertificates = () => getOrderedList<Certificate>("base/certificate");
