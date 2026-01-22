"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext"; // Check path based on your folder structure

/* ────────────────────── Types ────────────────────── */
interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
}

interface BlogPost {
  _id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  category: string;
  image: string;
  author: string;
  authorImg: string;
  date: string;
  readTime: LocalizedString;
}

/* ────────────────────── Static Content ────────────────────── */
const categories = [
  { id: "all", label: { mn: "Бүгд", en: "All", ko: "전체"} },
  { id: "guide", label: { mn: "Аяллын хөтөч", en: "Travel Guide", ko: "여행 가이드" } },
  { id: "tips", label: { mn: "Зөвлөгөө", en: "Tips", ko: "팁" } },
  { id: "food", label: { mn: "Хоол & Соёл", en: "Food & Culture", ko: "음식 및 문화" } },
  { id: "stories", label: { mn: "Аялагчийн түүх", en: "Travel Stories", ko: "여행 이야기" } },
];

interface BlogListProps {
  posts: BlogPost[];
  featuredPost: BlogPost | null;
  initialCategory: string;
}

/* ────────────────────── Main Component ────────────────────── */
export default function BlogList({ posts, featuredPost, initialCategory }: BlogListProps) {
  const { language } = useLanguage();

  const t = {
    mn: {
      featuredTitle: "Онцлох нийтлэл",
      readMore: "Дэлгэрэнгүй унших →",
      noPosts: "Нийтлэл олдсонгүй."
    },
    en: {
      featuredTitle: "Featured Article",
      readMore: "Read More →",
      noPosts: "No posts found."
    },
    ko: {
      featuredTitle: "특성 있는 기사",
      readMore: "더 읽기 →",
      noPosts: "기사가 없습니다."
    }
  };

  const text = t[language];

  return (
    <div className="container mx-auto py-20 px-4">
      
      {/* ─── Hero Section (Featured Post) ─── */}
      {featuredPost && initialCategory === 'all' && (
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-8">{text.featuredTitle}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 rounded-3xl p-6">
             {/* Made Image Clickable */}
             <Link href={`/blog/${featuredPost._id}`} className="relative h-64 md:h-96 w-full block">
               <Image 
                 src={featuredPost.image} 
                 alt={featuredPost.title[language]} 
                 fill 
                 className="object-cover rounded-2xl hover:opacity-95 transition-opacity"
               />
             </Link>
             <div className="flex flex-col justify-center">
                <span className="text-blue-500 font-bold mb-2 uppercase tracking-wider text-sm">
                  {featuredPost.category}
                </span>
                <Link href={`/blog/${featuredPost._id}`}>
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 hover:text-blue-600 transition-colors">
                    {featuredPost.title[language]}
                  </h2>
                </Link>
                <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                  {featuredPost.excerpt[language]}
                </p>
                <Link href={`/blog/${featuredPost._id}`} className="text-blue-600 font-bold hover:underline text-lg">
                  {text.readMore}
                </Link>
             </div>
          </div>
        </div>
      )}

      {/* ─── Filter Tabs ─── */}
      <div className="flex flex-wrap gap-4 mb-10 border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={cat.id === "all" ? "/blog" : `/blog?cat=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              initialCategory === cat.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat.label[language]}
          </Link>
        ))}
      </div>

      {/* ─── Post Grid ─── */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            // 👇 FIX: Changed <div> to <Link> so the whole card is clickable
            <Link 
              href={`/blog/${post._id}`} 
              key={post._id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col h-full block"
            >
              <div className="relative h-48 overflow-hidden">
                 <Image 
                   src={post.image} 
                   alt={post.title[language]} 
                   fill 
                   className="object-cover group-hover:scale-105 transition-transform duration-500"
                 />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                     {post.category}
                   </span>
                   <span className="text-slate-300">•</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title[language]}
                </h3>
                
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                  {post.excerpt[language]}
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-auto">
                  <img src={post.authorImg} alt={post.author} className="w-8 h-8 rounded-full bg-slate-100" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-700">{post.author}</div>
                    <div className="text-slate-400">{post.date}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          {text.noPosts}
        </div>
      )}
    </div>
  );
}