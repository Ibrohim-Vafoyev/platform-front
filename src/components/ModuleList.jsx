export default function ModuleList({
  modules,
  activeModuleId,
  onSelectModule,
  moduleStatuses,
  t,
}) {
  const completedModulesCount = modules.filter(
    (m) => moduleStatuses[m.id]?.status === 'completed'
  ).length;
  const overallPercent = Math.round(
    (completedModulesCount / (modules.length || 1)) * 100
  );

  return (
    <aside className="module-list-panel">
      <div className="module-list-header">
        <h2 className="panel-title">{t.modulesTitle}</h2>
        <span className="modules-count-badge">
          {modules.length} {t.modulesCountSuffix}
        </span>
      </div>

      <p className="module-list-subtitle">{t.modulesSubtitle}</p>

      {/* Visual Progress Bar Section */}
      <div className="module-panel-progress">
        <div className="module-panel-progress-top">
          <span className="progress-subhead">{t.readiness}</span>
          <span className="progress-percent-highlight">{overallPercent}%</span>
        </div>
        <div className="overall-progress-track">
          <div
            className="overall-progress-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="progress-subhead-foot">
          <span>
            {completedModulesCount} / {modules.length} {t.modulesCountSuffix} {t.statusCompleted.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="module-items">
        {modules.map((mod, index) => {
          const statusInfo = moduleStatuses[mod.id] || {
            status: 'not_started',
            filledCount: 0,
            totalFields: mod.fields.length,
            percent: 0,
          };
          const isActive = mod.id === activeModuleId;

          let badgeClass = 'status-not-started';
          let badgeText = t.statusNotStarted;
          let statusIcon = '○';

          if (statusInfo.status === 'completed') {
            badgeClass = 'status-completed';
            badgeText = t.statusCompleted;
            statusIcon = '✓';
          } else if (statusInfo.status === 'in_progress') {
            badgeClass = 'status-in-progress';
            badgeText = t.statusInProgress;
            statusIcon = '◐';
          }

          const countText = t.answersCount
            .replace('{filled}', statusInfo.filledCount)
            .replace('{total}', statusInfo.totalFields);

          return (
            <div
              key={mod.id}
              className={`module-card-item ${isActive ? 'selected' : ''}`}
              onClick={() => onSelectModule(mod.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectModule(mod.id);
                }
              }}
            >
              <div className="module-card-top">
                <span className="module-index-badge">
                  {t.moduleIndexPrefix} 0{index + 1}
                </span>
                <span className={`status-pill ${badgeClass}`}>
                  <span className="status-dot">{statusIcon}</span>
                  {badgeText}
                </span>
              </div>

              <h3 className="module-card-title">{mod.title}</h3>
              {mod.subtitle && (
                <p className="module-card-desc">{mod.subtitle}</p>
              )}

              <div className="module-card-footer">
                <span className="fields-stat">{countText}</span>
                <span className="action-hint">
                  {isActive ? t.openAction : t.editAction}
                </span>
              </div>

              <div className="card-mini-progress">
                <div
                  className="card-mini-progress-fill"
                  style={{ width: `${statusInfo.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
