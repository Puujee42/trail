import Script from 'next/script';

export default function AuthoritySchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Mongol Trail',
        url: 'https://www.mongoltrail.com',
        logo: 'https://www.mongoltrail.com/logo.jpg',
        sameAs: [
            'https://www.facebook.com/mongoltrail',
            'https://www.instagram.com/mongoltrail',
            'https://x.com/mongoltrail'
        ],
        knowsAbout: [
            'Mongolia Travel',
            'Gobi Desert',
            'Eagle Hunting',
            'Nomadic Culture',
            'Ulaanbaatar Tourism',
            'Altai Mountains Trekking',
            'Trans-Mongolian Railway'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+976-99123456',
            contactType: 'customer service',
            areaServed: ['US', 'DE', 'KR', 'MN'],
            availableLanguage: ['en', 'mn', 'ko', 'de']
        }
    };

    return (
        <Script
            id="authority-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />
    );
}
