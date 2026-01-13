import { getPostById } from "@/lib/mongo/blog";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from 'next';
import { Locale } from "@/i18n-config";

interface PageProps {
  params: Promise<{ id: string; lang: Locale }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const lang = (await props.params).lang as Locale;
  const post = await getPostById(id);

  if (!post) return {};

  const title = `${post.title[lang] || post.title.en} | Mongol Trail Blog`;
  const description = post.excerpt[lang] || post.excerpt.en;

  const baseUrl = 'https://www.mongoltrail.com';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${id}`,
      languages: {
        'mn': `${baseUrl}/mn/blog/${id}`,
        'en': `${baseUrl}/en/blog/${id}`,
        'ko': `${baseUrl}/ko/blog/${id}`,
      }
    },
    openGraph: {
      title,
      description,
      images: [post.image],
      type: 'article',
      url: `${baseUrl}/${lang}/blog/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage(props: PageProps) {
  // 1. Await params (Next.js 15 requirement)
  const params = await props.params;

  // 2. Fetch the post from MongoDB
  const post = await getPostById(params.id);

  // 3. Handle 404
  if (!post) {
    notFound();
  }

  const lang = params.lang as Locale;
  const baseUrl = 'https://www.mongoltrail.com';

  // JSON-LD for Blog SEO
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title[lang] || post.title.en,
    image: post.image,
    datePublished: post.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'Mongol Trail Team',
    },
    description: post.excerpt[lang] || post.excerpt.en,
    url: `${baseUrl}/${lang}/blog/${params.id}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/${lang}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title[lang] || post.title.en,
        item: `${baseUrl}/${lang}/blog/${params.id}`,
      },
    ],
  };

  // 4. Render Client UI
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostClient post={post as any} />
    </>
  );
}