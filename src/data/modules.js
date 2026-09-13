/**
 * Modular configuration for Incubator Program Modules.
 * Contains multi-language support (Uzbek, Russian, English) for titles, field labels, and placeholders.
 */

export const INCUBATOR_MODULES_CONFIG = [
  {
    id: 'problem_audience',
    title: {
      uz: 'Muammo va maqsadli auditoriya',
      ru: 'Проблема и целевая аудитория',
      en: 'Problem & Target Audience',
    },
    subtitle: {
      uz: 'Mijozlarning asosiy og‘riqli nuqtasi, foydalanuvchi portreti va bozordagi mavjud muqobillarni tahlil qilish',
      ru: 'Анализ ключевой боли клиентов, портрета пользователя и текущих альтернатив на рынке',
      en: 'Analysis of key customer pain points, target persona, and existing market alternatives',
    },
    fields: [
      {
        id: 'problem',
        label: {
          uz: 'Qanday muammoni hal qilyapsiz?',
          ru: 'Какую проблему вы решаете?',
          en: 'What problem are you solving?',
        },
        placeholder: {
          uz: 'Mijozlar har kuni duch keladigan asosiy og‘riqni tasvirlab bering (masalan: Fermerlar tuproq namligini qo‘lda o‘lchash tufayli 40% gacha resurslarni yo‘qotishadi)...',
          ru: 'Опишите ключевую боль клиентов, с которой они сталкиваются ежедневно (например: Фермеры тратят до 40% ресурсов впустую из-за ручного мониторинга влажности почвы)...',
          en: 'Describe the core customer pain point they face daily (e.g. Farmers waste up to 40% of irrigation resources due to manual soil monitoring)...',
        },
        type: 'textarea',
      },
      {
        id: 'target_audience',
        label: {
          uz: 'Bu muammodan kim aziyat chekmoqda?',
          ru: 'Кто страдает от этой проблемы?',
          en: 'Who suffers from this problem?',
        },
        placeholder: {
          uz: 'Maqsadli segmentni tasvirlang: mahsulot uchun kim to‘laydi va kim foydalanadi (masalan: Qurg‘oqchil hududlardagi 50-500 gektarli meva-sabzavot fermer xo‘jaliklari)...',
          ru: 'Опишите целевой сегмент: кто конкретно платит и кто пользуется продуктом (например: Малые и средние фермерские хозяйства 50-500 га в засушливых регионах)...',
          en: 'Describe the target customer segment: who pays and who uses the product (e.g. Commercial farms of 50-500 hectares in arid regions)...',
        },
        type: 'textarea',
      },
      {
        id: 'current_solutions',
        label: {
          uz: 'Hozir bu muammoni qanday hal qilishmoqda?',
          ru: 'Как они справляются с этим сегодня?',
          en: 'How do they deal with this today?',
        },
        placeholder: {
          uz: 'Mavjud muqobil yo‘llar yoki raqobatchi vositalarni tasvirlang (masalan: Haftada bir marta qo‘lda o‘lchash, agronomning taxmini, umumiy ob-havo ma‘lumotlari)...',
          ru: 'Опишите существующие костыли, альтернативы или конкурентные решения (например: Ручные замеры щупом раз в неделю, интуиция агронома, разрозненные метео-сводки)...',
          en: 'Describe existing workarounds, substitutes, or competitors (e.g. Manual mechanical probing once a week, agronomist guesswork, generic weather forecasts)...',
        },
        type: 'textarea',
      },
    ],
  },
];

/**
 * Returns module configuration mapped to the specified language code.
 * Falls back to 'uz', then 'ru', then raw string if already a string.
 */
export function getLocalizedModules(lang = 'uz') {
  return INCUBATOR_MODULES_CONFIG.map((mod) => ({
    id: mod.id,
    title: typeof mod.title === 'object' ? mod.title[lang] || mod.title.uz || mod.title.ru : mod.title,
    subtitle:
      typeof mod.subtitle === 'object'
        ? mod.subtitle[lang] || mod.subtitle.uz || mod.subtitle.ru
        : mod.subtitle,
    fields: mod.fields.map((field) => ({
      id: field.id,
      label:
        typeof field.label === 'object'
          ? field.label[lang] || field.label.uz || field.label.ru
          : field.label,
      placeholder:
        typeof field.placeholder === 'object'
          ? field.placeholder[lang] || field.placeholder.uz || field.placeholder.ru
          : field.placeholder,
      type: field.type || 'textarea',
    })),
  }));
}

// Default export in Russian for backward compatibility
export const INCUBATOR_MODULES = getLocalizedModules('ru');
