import { useState } from 'react';
import { CheckIcon } from './Icons';

export default function ModuleForm({
  module,
  currentAnswers = {},
  onSave,
  onGoToOnePager,
  t,
}) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    module.fields.forEach((field) => {
      initial[field.id] = currentAnswers[field.id] || '';
    });
    return initial;
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(module.id, formData);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  const filledCount = module.fields.filter(
    (f) => (formData[f.id] || '').trim().length > 0
  ).length;

  const answeredFieldsText = t.answeredFieldsPill
    .replace('{filled}', filledCount)
    .replace('{total}', module.fields.length);

  return (
    <div className="module-form-container">
      <div className="module-form-header">
        <div>
          <div className="module-tag-row">
            <span className="badge-tag">{t.programModuleTag}</span>
            <span className="fields-count-pill">{answeredFieldsText}</span>
          </div>
          <h2 className="form-title">{module.title}</h2>
          {module.subtitle && <p className="form-subtitle">{module.subtitle}</p>}
        </div>
      </div>

      {saveSuccess && (
        <div className="alert-toast success">
          <span className="alert-icon-svg">
            <CheckIcon size={18} />
          </span>
          <div className="alert-content">
            <strong>{t.saveSuccessTitle}</strong>
            <span>{t.saveSuccessSubtitle}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-white"
            onClick={onGoToOnePager}
          >
            {t.openOnePagerBtn}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dynamic-module-form">
        <div className="fields-stack">
          {module.fields.map((field, idx) => {
            const val = formData[field.id] || '';
            const isFilled = val.trim().length > 0;

            return (
              <div key={field.id} className="field-card">
                <div className="field-header">
                  <span className="field-number">{idx + 1}</span>
                  <label htmlFor={`field-${field.id}`} className="field-label">
                    {field.label}
                  </label>
                  {isFilled && (
                    <span className="field-check-badge">
                      <CheckIcon size={12} />
                      <span>{t.fieldFilledBadge}</span>
                    </span>
                  )}
                </div>

                <div className="input-wrapper">
                  <textarea
                    id={`field-${field.id}`}
                    className="form-textarea"
                    rows={4}
                    placeholder={field.placeholder}
                    value={val}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="form-actions-bar">
          <div className="actions-info">
            {hasChanges ? (
              <span className="unsaved-indicator">{t.hasUnsavedChanges}</span>
            ) : (
              <span className="saved-indicator">
                <CheckIcon size={14} />
                <span>{t.allChangesSaved}</span>
              </span>
            )}
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onGoToOnePager}
              title={t.viewOnePagerBtn}
            >
              {t.viewOnePagerBtn}
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              {t.saveAnswersBtn}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
