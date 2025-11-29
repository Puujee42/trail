import { getPostById } from "@/lib/mongo/blog";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
  params: Promise<{ id: string }>;
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

  // 4. Render Client UI
  return <BlogPostClient post={post} />;
}