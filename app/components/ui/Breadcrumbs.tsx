"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    lang: string;
}

export default function Breadcrumbs({ items, lang }: BreadcrumbsProps) {
    const breadcrumbListJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2, // 1 is Home
            "name": item.label,
            "item": `https://www.mongoltrail.com${item.href}`
        }))
    };

    // Add Home to start of JSON-LD
    breadcrumbListJsonLd.itemListElement.unshift({
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://www.mongoltrail.com/${lang}`
    });

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            {/* Schema.org JSON-LD */}
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbListJsonLd)
                }}
            />

            <ol className="flex items-center space-x-2 text-sm text-slate-500 flex-wrap">
                <li>
                    <Link
                        href={`/${lang}`}
                        className="flex items-center hover:text-blue-600 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />

                        {index === items.length - 1 ? (
                            <span className="font-semibold text-slate-900" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
