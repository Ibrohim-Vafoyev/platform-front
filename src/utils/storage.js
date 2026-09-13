import { INCUBATOR_MODULES } from '../data/modules.js';

const STORAGE_KEY_PROJECTS = 'incubator_platform_projects';
const STORAGE_KEY_ACTIVE_ID = 'incubator_platform_active_project_id';

export const SEED_PROJECTS = [
  {
    id: 'proj_agropulse',
    name: 'AgroPulse AI',
    tagline: 'IoT-система точечного орошения для агропредприятий',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-12T14:30:00Z',
    answers: {
      problem_audience: {
        problem:
          'Агропредприятия теряют до 35% урожая и перерасходуют воду и удобрения из-за отсутствия точечного оперативного мониторинга влажности и минерализации почвы в реальном времени.',
        target_audience:
          'Владельцы и главные агрономы коммерческих фермерских хозяйств (50–500 га) в засушливых регионах Центральной Азии, специализирующиеся на фруктовых садах и овощеводстве.',
        current_solutions:
          'Используют ручной замер влажности механическим щупом 1-2 раза в неделю, субъективную оценку агронома «на глаз» и усреднённые метеорологические сводки без учёта микрозон.',
      },
    },
  },
  {
    id: 'proj_cleantech_draft',
    name: 'EcoSort (Черновик)',
    tagline: 'Умная сортировка вторичного сырья на базе Computer Vision',
    createdAt: '2026-03-10T09:15:00Z',
    updatedAt: '2026-03-10T09:15:00Z',
    answers: {},
  },
];

/**
 * Initializes and retrieves projects from localStorage.
 * Only writes seed data if no projects currently exist.
 */
export function getStoredProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
      return SEED_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
      return SEED_PROJECTS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read projects from localStorage:', err);
    return SEED_PROJECTS;
  }
}

/**
 * Persists project list to localStorage
 */
export function saveStoredProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

/**
 * Gets currently active project ID or falls back to first project.
 */
export function getActiveProjectId(projects) {
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (activeId && projects.some((p) => p.id === activeId)) {
      return activeId;
    }
    const defaultId = projects[0]?.id || SEED_PROJECTS[0].id;
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, defaultId);
    return defaultId;
  } catch {
    return projects[0]?.id || SEED_PROJECTS[0].id;
  }
}

/**
 * Saves active project ID
 */
export function setActiveProjectId(projectId) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, projectId);
  } catch (err) {
    console.error('Failed to save active project ID:', err);
  }
}

/**
 * Updates answers for a specific project and module
 */
export function updateProjectModuleAnswers(projectId, moduleId, fieldAnswers) {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === projectId);

  if (index === -1) return projects;

  const project = { ...projects[index] };
  const currentAnswers = project.answers || {};

  project.answers = {
    ...currentAnswers,
    [moduleId]: {
      ...(currentAnswers[moduleId] || {}),
      ...fieldAnswers,
    },
  };
  project.updatedAt = new Date().toISOString();

  const updatedProjects = [...projects];
  updatedProjects[index] = project;
  saveStoredProjects(updatedProjects);
  return updatedProjects;
}

/**
 * Creates a new project
 */
export function createNewProject(name, tagline = '') {
  const projects = getStoredProjects();
  const newProject = {
    id: `proj_${Date.now()}`,
    name: name.trim() || 'Новый проект',
    tagline: tagline.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: {},
  };
  const updated = [newProject, ...projects];
  saveStoredProjects(updated);
  setActiveProjectId(newProject.id);
  return { updatedProjects: updated, newProject };
}

/**
 * Resets localStorage back to initial seed mock data
 */
export function resetStorageToSeed() {
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, SEED_PROJECTS[0].id);
  return { projects: SEED_PROJECTS, activeId: SEED_PROJECTS[0].id };
}

/**
 * Computes completion status for a project across modules
 */
export function getProjectProgress(project, modules = INCUBATOR_MODULES) {
  if (!project || !modules.length) {
    return { completedCount: 0, totalCount: 0, percent: 0, moduleStatuses: {} };
  }

  const moduleStatuses = {};
  let completedCount = 0;

  modules.forEach((mod) => {
    const modAnswers = project.answers?.[mod.id] || {};
    const fieldKeys = mod.fields.map((f) => f.id);
    const filledFields = fieldKeys.filter(
      (key) => typeof modAnswers[key] === 'string' && modAnswers[key].trim().length > 0
    );

    let status = 'not_started'; // 'completed' | 'in_progress' | 'not_started'
    if (filledFields.length === fieldKeys.length && fieldKeys.length > 0) {
      status = 'completed';
      completedCount++;
    } else if (filledFields.length > 0) {
      status = 'in_progress';
    }

    moduleStatuses[mod.id] = {
      status,
      filledCount: filledFields.length,
      totalFields: fieldKeys.length,
      percent: Math.round((filledFields.length / (fieldKeys.length || 1)) * 100),
    };
  });

  const percent = Math.round((completedCount / modules.length) * 100);

  return {
    completedCount,
    totalCount: modules.length,
    percent,
    moduleStatuses,
  };
}
