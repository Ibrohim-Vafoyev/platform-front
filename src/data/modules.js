/**
 * Modular configuration for Incubator Program Modules.
 * Designed to easily extend with more modules without modifying UI logic.
 *
 * Schema:
 * [
 *   {
 *     id: string,
 *     title: string,
 *     subtitle?: string,
 *     fields: [
 *       { id: string, label: string, placeholder: string, type?: 'text' | 'textarea' }
 *     ]
 *   }
 * ]
 */

export const INCUBATOR_MODULES = [
  {
    id: 'problem_audience',
    title: 'Проблема и целевая аудитория',
    subtitle: 'Анализ ключевой боли клиентов, портрета пользователя и текущих альтернатив на рынке',
    fields: [
      {
        id: 'problem',
        label: 'Какую проблему вы решаете?',
        placeholder: 'Опишите ключевую боль клиентов, с которой они сталкиваются ежедневно (например: Фермеры тратят до 40% ресурсов впустую из-за ручного мониторинга влажности почвы)...',
        type: 'textarea',
      },
      {
        id: 'target_audience',
        label: 'Кто страдает от этой проблемы?',
        placeholder: 'Опишите целевой сегмент: кто конкретно платит и кто пользуется продуктом (например: Малые и средние фермерские хозяйства 50-500 га в засушливых регионах)...',
        type: 'textarea',
      },
      {
        id: 'current_solutions',
        label: 'Как они справляются с этим сегодня?',
        placeholder: 'Опишите существующие костыли, альтернативы или конкурентные решения (например: Ручные замеры щупом раз в неделю, интуиция агронома, разрозненные метео-сводки)...',
        type: 'textarea',
      },
    ],
  },
];
