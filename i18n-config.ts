export const i18n = {
    defaultLocale: 'en',
    locales: ['mn', 'en', 'ko', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
