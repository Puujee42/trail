import { getPosts, getFeaturedPost } from "@/lib/mongo/blog";
import Link from "next/link";
import Image from "next/image";

// Static categories
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "guide", label: "Аяллын хөтөч" },
  { id: "tips", label: "Зөвлөгөө" },
  { id: "food", label: "Хоол & Соёл" },
  { id: "stories", label: "Аялагчийн түүх" },
];

// FIX: Change the type definition and await searchParams
export default async function BlogPage(props: { 
  searchParams: Promise<{ cat?: string }> 
}) {
  
  // 1. AWAIT the searchParams before using them
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams.cat || "all";
  
  // 2. Fetch data
  const posts = await getPosts(categoryFilter);
  const featuredPost = await getFeaturedPost();

  return (
    <div className="container mx-auto py-20 px-4">
      
      {/* Hero Section */}
      {featuredPost && categoryFilter === 'all' && (
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-8">Онцлох нийтлэл</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 rounded-3xl p-6">
             <div className="relative h-64 md:h-auto">
               <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover rounded-2xl"/>
             </div>
             <div className="flex flex-col justify-center">
                <span className="text-blue-500 font-bold mb-2">{featuredPost.category}</span>
                <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-slate-600 mb-6">{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost._id}`} className="text-blue-600 font-bold hover:underline">
                  Дэлгэрэнгүй унших →
                </Link>
             </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-10 border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={cat.id === "all" ? "/blog" : `/blog?cat=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              categoryFilter === cat.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
               <Image 
                 src={post.image} 
                 alt={post.title} 
                 fill 
                 className="object-cover group-hover:scale-105 transition-transform duration-500"
               />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                 <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{post.category}</span>
                 <span className="text-slate-300">•</span>
                 <span className="text-xs text-slate-400">{post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <img src={post.authorImg} alt={post.author} className="w-8 h-8 rounded-full bg-slate-100" />
                <div className="text-xs">
                  <div className="font-bold text-slate-700">{post.author}</div>
                  <div className="text-slate-400">{post.date}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}