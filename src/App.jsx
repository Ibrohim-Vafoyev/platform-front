import { useState, useMemo } from 'react';
import Header from './components/Header';
import ModuleList from './components/ModuleList';
import ModuleForm from './components/ModuleForm';
import OnePagerView from './components/OnePagerView';
import { INCUBATOR_MODULES } from './data/modules';
import {
  getStoredProjects,
  getActiveProjectId,
  setActiveProjectId,
  updateProjectModuleAnswers,
  createNewProject,
  resetStorageToSeed,
  getProjectProgress,
} from './utils/storage';
import './App.css';

export default function App() {
  const [projects, setProjects] = useState(() => getStoredProjects());
  const [activeProjectId, setActiveProjId] = useState(() =>
    getActiveProjectId(projects)
  );
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'onepager'
  const [activeModuleId, setActiveModuleId] = useState(INCUBATOR_MODULES[0].id);

  // Active project memoized
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0] || null;
  }, [projects, activeProjectId]);

  // Progress metrics memoized
  const progress = useMemo(() => {
    return getProjectProgress(activeProject, INCUBATOR_MODULES);
  }, [activeProject]);

  // Active module configuration
  const activeModule = useMemo(() => {
    return (
      INCUBATOR_MODULES.find((m) => m.id === activeModuleId) ||
      INCUBATOR_MODULES[0]
    );
  }, [activeModuleId]);

  // Active module saved answers
  const activeModuleAnswers = useMemo(() => {
    return activeProject?.answers?.[activeModule.id] || {};
  }, [activeProject, activeModule.id]);

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
    if (
      window.confirm(
        'Сбросить данные к исходным демо-проектам (AgroPulse AI и Черновик)? Все несохранённые изменения будут сброшены.'
      )
    ) {
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
      />

      <main className="app-main-content">
        {activeTab === 'modules' ? (
          <div className="modules-view-container">
            <ModuleList
              modules={INCUBATOR_MODULES}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              moduleStatuses={progress.moduleStatuses}
            />

            <section className="module-workspace">
              <ModuleForm
                key={`${activeProject?.id}_${activeModule.id}`}
                module={activeModule}
                currentAnswers={activeModuleAnswers}
                onSave={handleSaveModuleAnswers}
                onGoToOnePager={() => setActiveTab('onepager')}
              />
            </section>
          </div>
        ) : (
          <OnePagerView
            project={activeProject}
            modules={INCUBATOR_MODULES}
            onEditModule={handleEditModuleFromOnePager}
          />
        )}
      </main>
    </div>
  );
}
