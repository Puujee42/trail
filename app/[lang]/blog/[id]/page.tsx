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
  const activeLang = (lang === 'de' ? 'en' : lang) as 'en' | 'mn' | 'ko';
  const post = await getPostById(id);

  if (!post) return {};

  const title = `${post.title[activeLang] || post.title.en} | Mongol Trail Blog`;
  const description = post.excerpt[activeLang] || post.excerpt.en;

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

import StructuredData from "@/app/components/seo/StructuredData";

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
  const activeLang = (lang === 'de' ? 'en' : lang) as 'en' | 'mn' | 'ko';
  const baseUrl = 'https://www.mongoltrail.com';

  // 4. Render Client UI
  return (
    <>
      <StructuredData
        type="BlogPosting"
        data={{
          headline: post.title[activeLang] || post.title.en,
          image: post.image,
          datePublished: post.date || new Date().toISOString(),
          author: {
            '@type': 'Person',
            name: post.author || 'Mongol Trail Team',
          },
          description: post.excerpt[activeLang] || post.excerpt.en,
          url: `${baseUrl}/${lang}/blog/${params.id}`,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
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
              name: post.title[activeLang] || post.title.en,
              item: `${baseUrl}/${lang}/blog/${params.id}`,
            },
          ],
        }}
      />
      <BlogPostClient post={post as any} />
    </>
  );
}