import { useState } from 'react';

export default function OnePagerView({
  project,
  modules,
  onEditModule,
}) {
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div className="onepager-empty-state">
        <p>Проект не выбран</p>
      </div>
    );
  }

  const answers = project.answers || {};

  const handleCopyText = () => {
    let fullText = `=== ONE-PAGER: ${project.name} ===\n`;
    if (project.tagline) fullText += `${project.tagline}\n`;
    fullText += `\n`;

    modules.forEach((mod, idx) => {
      fullText += `--- ${idx + 1}. ${mod.title} ---\n`;
      const modAnswers = answers[mod.id] || {};
      let hasContent = false;

      mod.fields.forEach((field) => {
        const val = modAnswers[field.id];
        if (val && val.trim().length > 0) {
          hasContent = true;
          fullText += `• ${field.label}\n${val.trim()}\n\n`;
        }
      });

      if (!hasContent) {
        fullText += `[Раздел не заполнен]\n\n`;
      }
    });

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="onepager-wrapper">
      <div className="onepager-toolbar">
        <div className="toolbar-info">
          <span className="live-badge">● Live автосборка из модулей</span>
          <span className="updated-timestamp">
            Обновлено:{' '}
            {project.updatedAt
              ? new Date(project.updatedAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Только что'}
          </span>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyText}
          >
            {copied ? '✓ Скопировано в буфер!' : '📋 Копировать One-Pager'}
          </button>
        </div>
      </div>

      <article className="onepager-sheet">
        <header className="onepager-header">
          <div className="onepager-header-top">
            <span className="memo-tag">Startup Executive One-Pager</span>
            <span className="project-id-chip">ID: {project.id}</span>
          </div>

          <h1 className="onepager-title">{project.name}</h1>
          <p className="onepager-tagline">
            {project.tagline || 'Проект инкубационной программы (описание не указано)'}
          </p>
        </header>

        <div className="onepager-modules-flow">
          {modules.map((mod, index) => {
            const modAnswers = answers[mod.id] || {};
            const filledFieldCount = mod.fields.filter(
              (f) => typeof modAnswers[f.id] === 'string' && modAnswers[f.id].trim().length > 0
            ).length;

            const isModuleCompletelyEmpty = filledFieldCount === 0;

            return (
              <section key={mod.id} className="onepager-section-card">
                <div className="section-card-header">
                  <div className="section-heading-group">
                    <span className="section-roman-index">0{index + 1}</span>
                    <h2 className="section-card-title">{mod.title}</h2>
                  </div>

                  <button
                    type="button"
                    className="edit-section-link"
                    onClick={() => onEditModule(mod.id)}
                    title="Перейти к редактированию модуля"
                  >
                    ✏ Редактировать
                  </button>
                </div>

                {isModuleCompletelyEmpty ? (
                  /* CRITICAL: Non-breaking graceful Empty Section state */
                  <div className="onepager-empty-section">
                    <div className="empty-section-icon">📝</div>
                    <div className="empty-section-body">
                      <h4 className="empty-section-title">Раздел пока не заполнен</h4>
                      <p className="empty-section-text">
                        Ответы по этому модулю ещё не внесены командой. Заполните форму в
                        модуле, чтобы сгенерировать этот раздел One-Pager.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onEditModule(mod.id)}
                    >
                      Заполнить модуль →
                    </button>
                  </div>
                ) : (
                  <div className="section-fields-grid">
                    {mod.fields.map((field) => {
                      const answerValue = modAnswers[field.id];
                      const hasValue =
                        typeof answerValue === 'string' && answerValue.trim().length > 0;

                      return (
                        <div key={field.id} className="onepager-field-block">
                          <h3 className="onepager-field-question">{field.label}</h3>
                          {hasValue ? (
                            <div className="onepager-field-answer">
                              {answerValue.split('\n').map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="onepager-field-placeholder">
                              <em>[Ответ на этот вопрос ещё не внесён]</em>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <footer className="onepager-footer">
          <div className="footer-legend">
            <span>Сформировано автоматически платформой IncubatorOS</span>
            <span>•</span>
            <span>Без ручной верстки</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
