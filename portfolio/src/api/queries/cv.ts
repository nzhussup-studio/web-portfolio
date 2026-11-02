import type { Certificate, Education, Skill, WorkExperience } from "@/api";
import { getOrderedList } from "./orderedList";

// These casts stay at the API boundary until the OpenAPI list responses use their schemas.
export const getWorkExperience = () => getOrderedList<WorkExperience>("work-experiences");
export const getEducation = () => getOrderedList<Education>("education-records");
export const getSkills = () => getOrderedList<Skill>("skills");
export const getCertificates = () => getOrderedList<Certificate>("certificates");
