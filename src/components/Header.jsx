import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../data/translations';
import {
  RocketIcon,
  PlusIcon,
  RefreshIcon,
  ClipboardListIcon,
  FileTextIcon,
  CheckIcon,
} from './Icons';

export default function Header({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onResetDemo,
  activeTab,
  onSelectTab,
  progress,
  lang,
  onSelectLanguage,
  t,
}) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');

  const langMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName, newTagline);
    setNewName('');
    setNewTagline('');
    setShowNewModal(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="logo-badge">
            <span className="logo-icon-svg">
              <RocketIcon size={20} />
            </span>
            <span className="logo-text">IncubatorOS</span>
          </div>
          <span className="tournament-tag">{t.brandTag}</span>
        </div>

        <div className="header-actions-cluster">
          {/* Language Switcher Dropdown */}
          <div className="lang-dropdown-wrapper" ref={langMenuRef}>
            <button
              type="button"
              className="btn btn-secondary lang-dropdown-toggle"
              onClick={() => setShowLangMenu((prev) => !prev)}
              aria-expanded={showLangMenu}
              aria-label="Tanlangan til"
            >
              <span className="lang-flag">{currentLang.flag}</span>
              <span className="lang-name">{currentLang.label}</span>
              <span className="dropdown-caret">▾</span>
            </button>

            {showLangMenu && (
              <div className="lang-dropdown-menu">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={`lang-menu-item ${item.code === lang ? 'active' : ''}`}
                    onClick={() => {
                      onSelectLanguage(item.code);
                      setShowLangMenu(false);
                    }}
                  >
                    <span className="lang-menu-flag">{item.flag}</span>
                    <span className="lang-menu-label">{item.label}</span>
                    {item.code === lang && (
                      <span className="lang-active-check">
                        <CheckIcon size={14} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="project-switcher-group">
            <label htmlFor="project-select" className="project-label">
              {t.projectLabel}
            </label>
            <select
              id="project-select"
              className="project-select"
              value={activeProject?.id || ''}
              onChange={(e) => onSelectProject(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.answers && Object.keys(p.answers).length === 0 ? t.emptyTag : ''}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowNewModal(true)}
              title={t.newProject}
            >
              <PlusIcon size={14} />
              <span>{t.newProject}</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onResetDemo}
              title={t.resetDemo}
            >
              <RefreshIcon size={13} />
              <span>{t.resetDemo}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <nav className="tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => onSelectTab('modules')}
          >
            <span className="tab-icon-svg">
              <ClipboardListIcon size={16} />
            </span>
            <span>{t.tabModules}</span>
            <span className="tab-count-badge">
              {progress.completedCount}/{progress.totalCount}
            </span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'onepager' ? 'active' : ''}`}
            onClick={() => onSelectTab('onepager')}
          >
            <span className="tab-icon-svg">
              <FileTextIcon size={16} />
            </span>
            <span>{t.tabOnePager}</span>
            {progress.completedCount > 0 ? (
              <span className="tab-status-pill ready">{t.statusReady}</span>
            ) : (
              <span className="tab-status-pill pending">{t.statusDraft}</span>
            )}
          </button>
        </nav>

        <div className="header-progress-summary">
          <div className="progress-info">
            <span className="progress-label">{t.readiness}</span>
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
              <h3>{t.modalTitle}</h3>
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
                <label htmlFor="new-proj-name">{t.projectNameLabel}</label>
                <input
                  id="new-proj-name"
                  type="text"
                  className="form-input"
                  placeholder={t.projectNamePlaceholder}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-proj-tagline">{t.projectTaglineLabel}</label>
                <input
                  id="new-proj-tagline"
                  type="text"
                  className="form-input"
                  placeholder={t.projectTaglinePlaceholder}
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
                  {t.cancelBtn}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
