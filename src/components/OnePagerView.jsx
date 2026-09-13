import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function OnePagerView({
  project,
  modules,
  onEditModule,
  t,
  lang,
}) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const sheetRef = useRef(null);

  if (!project) {
    return (
      <div className="onepager-empty-state">
        <p>{t.noProjectSelected}</p>
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
        fullText += `[${t.emptySectionTitle}]\n\n`;
      }
    });

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadPdf = async () => {
    if (!sheetRef.current || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);

      const element = sheetRef.current;
      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#141a26',
        filter: (node) => {
          // Exclude edit buttons from exported PDF
          return !node.classList?.contains('edit-section-link');
        },
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 20; // 10mm margins on sides
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= (pdfHeight - 20);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= (pdfHeight - 20);
      }

      const cleanFileName = (project.name || 'Startup_OnePager')
        .replace(/[^a-zA-Z0-9_\u0400-\u04FF\u0100-\u017F-]/g, '_');

      // Direct automatic file download as .pdf
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `${cleanFileName}_OnePager.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const localeMap = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };

  const formattedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString(localeMap[lang] || 'ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : t.justNow;

  return (
    <div className="onepager-wrapper">
      <div className="onepager-toolbar">
        <div className="toolbar-info">
          <span className="live-badge">{t.liveAutoAssembly}</span>
          <span className="updated-timestamp">
            {t.updatedAt} {formattedDate}
          </span>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyText}
            title={t.copyOnePager}
          >
            {copied ? t.copiedSuccess : t.copyOnePager}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm btn-pdf-export"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            title={t.downloadPdf}
          >
            {isGeneratingPdf ? t.generatingPdf : t.downloadPdf}
          </button>
        </div>
      </div>

      <article className="onepager-sheet" ref={sheetRef}>
        <header className="onepager-header">
          <div className="onepager-header-top">
            <span className="memo-tag">{t.executiveTag}</span>
            <span className="project-id-chip">ID: {project.id}</span>
          </div>

          <h1 className="onepager-title">{project.name}</h1>
          <p className="onepager-tagline">
            {project.tagline || t.noTaglineProvided}
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
                    title={t.editSection}
                  >
                    {t.editSection}
                  </button>
                </div>

                {isModuleCompletelyEmpty ? (
                  /* Non-breaking graceful Empty Section state */
                  <div className="onepager-empty-section">
                    <div className="empty-section-icon">📝</div>
                    <div className="empty-section-body">
                      <h3 className="empty-section-title">{t.emptySectionTitle}</h3>
                      <p className="empty-section-text">{t.emptySectionText}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onEditModule(mod.id)}
                    >
                      {t.fillModuleBtn}
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
                          <h4 className="onepager-field-question">{field.label}</h4>
                          {hasValue ? (
                            <div className="onepager-field-answer">
                              {answerValue.split('\n').map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="onepager-field-placeholder">
                              <em>{t.emptyFieldNotice}</em>
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
            <span>{t.autoGeneratedNotice}</span>
            <span>•</span>
            <span>{t.noManualLayout}</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
