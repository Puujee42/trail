import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: string[] = i18n.locales as unknown as string[];

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales
    );

    const locale = matchLocale(languages, locales, i18n.defaultLocale);

    return locale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Skip if the path already has a locale or is a public file
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        // 2. Optimized locale detection
        const locale = getLocale(request);

        // 3. Use 301 for permanent redirect if it's the root to help SEO, 
        // but 307 is generally safer for dynamic locale matching.
        // We'll use 307 here to avoid caching the wrong locale.
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname === '/' ? '' : pathname}`,
                request.url
            )
        );
    }
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, and `/static/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
