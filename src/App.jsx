import { useState, useMemo } from 'react';
import Header from './components/Header';
import ModuleList from './components/ModuleList';
import ModuleForm from './components/ModuleForm';
import OnePagerView from './components/OnePagerView';
import { getLocalizedModules } from './data/modules';
import { TRANSLATIONS } from './data/translations';
import {
  getStoredProjects,
  getActiveProjectId,
  setActiveProjectId,
  updateProjectModuleAnswers,
  createNewProject,
  resetStorageToSeed,
  getProjectProgress,
  getStoredLanguage,
  saveStoredLanguage,
} from './utils/storage';
import './App.css';

export default function App() {
  const [lang, setLang] = useState(() => getStoredLanguage());
  const [projects, setProjects] = useState(() => getStoredProjects());
  const [activeProjectId, setActiveProjId] = useState(() =>
    getActiveProjectId(projects)
  );
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'onepager'
  const [activeModuleId, setActiveModuleId] = useState('problem_audience');

  // Translation dictionary for active language
  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS.uz;
  }, [lang]);

  // Localized modules list for active language
  const modules = useMemo(() => {
    return getLocalizedModules(lang);
  }, [lang]);

  // Active project memoized
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0] || null;
  }, [projects, activeProjectId]);

  // Progress metrics memoized
  const progress = useMemo(() => {
    return getProjectProgress(activeProject, modules);
  }, [activeProject, modules]);

  // Active module configuration
  const activeModule = useMemo(() => {
    return (
      modules.find((m) => m.id === activeModuleId) ||
      modules[0]
    );
  }, [modules, activeModuleId]);

  // Active module saved answers
  const activeModuleAnswers = useMemo(() => {
    return activeProject?.answers?.[activeModule.id] || {};
  }, [activeProject, activeModule.id]);

  const handleSelectLanguage = (newLang) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
  };

  const handleSelectProject = (id) => {
    setActiveProjId(id);
    setActiveProjectId(id);
  };

  const handleCreateProject = (name, tagline) => {
    const { updatedProjects, newProject } = createNewProject(name, tagline);
    setProjects(updatedProjects);
    setActiveProjId(newProject.id);
    setActiveTab('modules');
  };

  const handleResetDemo = () => {
    if (window.confirm(t.resetConfirm)) {
      const { projects: seedProjects, activeId } = resetStorageToSeed();
      setProjects(seedProjects);
      setActiveProjId(activeId);
    }
  };

  const handleSaveModuleAnswers = (moduleId, fieldAnswers) => {
    if (!activeProject) return;
    const updated = updateProjectModuleAnswers(
      activeProject.id,
      moduleId,
      fieldAnswers
    );
    setProjects(updated);
  };

  const handleEditModuleFromOnePager = (moduleId) => {
    setActiveModuleId(moduleId);
    setActiveTab('modules');
  };

  return (
    <div className="app-layout">
      <Header
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onResetDemo={handleResetDemo}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        progress={progress}
        lang={lang}
        onSelectLanguage={handleSelectLanguage}
        t={t}
      />

      <main className="app-main-content">
        {activeTab === 'modules' ? (
          <div className="modules-view-container">
            <ModuleList
              modules={modules}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              moduleStatuses={progress.moduleStatuses}
              t={t}
            />

            <section className="module-workspace">
              <ModuleForm
                key={`${activeProject?.id}_${activeModule.id}_${lang}`}
                module={activeModule}
                currentAnswers={activeModuleAnswers}
                onSave={handleSaveModuleAnswers}
                onGoToOnePager={() => setActiveTab('onepager')}
                t={t}
              />
            </section>
          </div>
        ) : (
          <OnePagerView
            project={activeProject}
            modules={modules}
            onEditModule={handleEditModuleFromOnePager}
            t={t}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
