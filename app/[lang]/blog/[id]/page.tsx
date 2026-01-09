import { getPostById } from "@/lib/mongo/blog";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) return {};

  return {
    title: `${post.title} | Mongol Trail Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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

  // JSON-LD for Blog SEO
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    datePublished: post.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'Mongol Trail Team',
    },
    description: post.excerpt,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.mongoltrail.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.mongoltrail.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.mongoltrail.com/blog/${params.id}`,
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