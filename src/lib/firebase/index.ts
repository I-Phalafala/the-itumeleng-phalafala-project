// Firebase configuration
export { db, auth, storage } from "./config";
export { default as app } from "./config";

// Service response types
export type { ServiceResponse, ServiceSuccess, ServiceError } from "./services/types";

// Project services
export {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "./services/projects";

// Experience services
export {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "./services/experience";

// Skill services
export {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "./services/skills";

// Storage services
export { uploadImage, deleteImage } from "./services/storage";
