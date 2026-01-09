export const i18n = {
    defaultLocale: 'mn',
    locales: ['mn', 'en', 'ko'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
