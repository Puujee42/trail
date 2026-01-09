import { getPosts, getFeaturedPost } from "@/lib/mongo/blog";
import BlogList from "./BlogList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Blog | Stories & Guides from Mongol Trail',
  description: 'Read the latest travel stories, destination guides, and travel tips from the Mongol Trail team. Get inspired for your next adventure.',
};

// Prevent caching so you see new blog posts immediately
export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 1. Await Params (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.cat || "all";
  
  // 2. Fetch data (Server Side)
  // These functions now return the bilingual data structure ({ mn, en })
  const posts = await getPosts(categoryFilter);
  const featuredPost = await getFeaturedPost();

  // 3. Pass data to the Client Component
  // We explicitly cast the types to 'any' here to avoid TypeScript strictness 
  // issues between the MongoDB return type and the Component interface, 
  // though they match structurally.
  return (
    <BlogList 
      posts={posts as any} 
      featuredPost={featuredPost as any} 
      initialCategory={categoryFilter} 
    />
  );
}