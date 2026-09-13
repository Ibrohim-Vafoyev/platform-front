import { useState } from 'react';

export default function Header({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onResetDemo,
  activeTab,
  onSelectTab,
  progress,
}) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName, newTagline);
    setNewName('');
    setNewTagline('');
    setShowNewModal(false);
  };

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="logo-badge">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">IncubatorOS</span>
          </div>
          <span className="tournament-tag">Vibe Coding Tournament MVP</span>
        </div>

        <div className="project-switcher-group">
          <label htmlFor="project-select" className="project-label">
            Проект:
          </label>
          <select
            id="project-select"
            className="project-select"
            value={activeProject?.id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.answers && Object.keys(p.answers).length === 0 ? '(Пустой)' : ''}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowNewModal(true)}
            title="Создать новый проект"
          >
            + Новый проект
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetDemo}
            title="Восстановить исходные демо-проекты"
          >
            ↺ Демо-данные
          </button>
        </div>
      </div>

      <div className="header-bottom">
        <nav className="tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => onSelectTab('modules')}
          >
            <span className="tab-icon">📋</span>
            <span>Модули акселератора</span>
            <span className="tab-count-badge">
              {progress.completedCount}/{progress.totalCount}
            </span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'onepager' ? 'active' : ''}`}
            onClick={() => onSelectTab('onepager')}
          >
            <span className="tab-icon">📄</span>
            <span>One-Pager проекта</span>
            {progress.completedCount > 0 ? (
              <span className="tab-status-pill ready">Готов к показу</span>
            ) : (
              <span className="tab-status-pill pending">Черновик</span>
            )}
          </button>
        </nav>

        <div className="header-progress-summary">
          <div className="progress-info">
            <span className="progress-label">Готовность One-Pager:</span>
            <span className="progress-val">{progress.percent}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Создать новый проект</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowNewModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label htmlFor="new-proj-name">Название проекта *</label>
                <input
                  id="new-proj-name"
                  type="text"
                  className="form-input"
                  placeholder="например: MedBot, AgroAI, FinPulse..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-proj-tagline">Краткое описание (tagline)</label>
                <input
                  id="new-proj-tagline"
                  type="text"
                  className="form-input"
                  placeholder="например: Платформа предиктивной аналитики для..."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowNewModal(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
