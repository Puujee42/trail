"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaClock, 
  FaUser, 
  FaArrowRight, 
  FaTag,
  FaPenNib,
  FaChevronRight
} from "react-icons/fa";
import Link from "next/link";

/* ────────────────────── Mock Data: Blog Posts ────────────────────── */
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "guide", label: "Аяллын хөтөч" },
  { id: "tips", label: "Зөвлөгөө" },
  { id: "food", label: "Хоол & Соёл" },
  { id: "stories", label: "Аялагчийн түүх" },
];

const blogPosts = [
  {
    id: 1,
    title: "2025 онд заавал очих 10 газар",
    excerpt: "Дэлхий даяарх аялал жуулчлалын чиг хандлага, шинээр нээгдэж буй үзэсгэлэнт газрууд болон хямд зардлаар аялах боломжууд.",
    category: "guide",
    author: "Б. Анударь",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: "5 мин",
    image: "/paris.jpg", // Replace with real image
    featured: true
  },
  {
    id: 2,
    title: "Чемоданаа хэрхэн зөв баглах вэ?",
    excerpt: "Ачаагаа хөнгөн байлгахын зэрэгцээ хэрэгтэй бүхнээ багтаах шалгарсан аргууд. Minimalist аялагчийн зөвлөгөө.",
    category: "tips",
    author: "Г. Тэмүүлэн",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: "3 мин",
    image: "/packing.jpg", 
    featured: false
  },
  {
    id: 3,
    title: "Японы гудамжны хоолны соёл",
    excerpt: "Токиогийн гудамжаар аялж, Рамен, Такояки, Якитори зэрэг амтат хоолнуудын түүхтэй танилцсан тэмдэглэл.",
    category: "food",
    author: "М. Сарнай",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    date: "2025.11.15",
    readTime: "6 мин",
    image: "/japan.jpg",
    featured: false
  },
  {
    id: 4,
    title: "Ганцаараа аялахад юу анхаарах вэ?",
    excerpt: "Аюулгүй байдал, шинэ найзуудтай болох, өөрийгөө нээх аяллын тухай сэтгэл зүйн болон практик зөвлөгөө.",
    category: "tips",
    author: "Д. Бат",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bat",
    date: "2025.11.10",
    readTime: "8 мин",
    image: "/solo.jpg",
    featured: false
  },
  {
    id: 5,
    title: "Бали арал дээрх дижитал нүүдэлчид",
    excerpt: "Балид хэрхэн ажиллаж, амьдрах вэ? Виза, интернет, coworking space-үүдийн тухай дэлгэрэнгүй мэдээлэл.",
    category: "stories",
    author: "Э. Золбоо",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zolo",
    date: "2025.11.05",
    readTime: "10 мин",
    image: "/bali-nomad.jpg",
    featured: false
  },
  {
    id: 6,
    title: "Европоор галт тэргээр аялсан нь",
    excerpt: "Eurail Pass ашиглан 5 улсаар аялсан миний түүх. Зардал хэмнэх аргууд болон хамгийн гоё маршрут.",
    category: "stories",
    author: "Т. Болд",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bold",
    date: "2025.10.28",
    readTime: "7 мин",
    image: "/eurotrip.jpg",
    featured: false
  }
];

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeTab === "all" || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden font-sans text-slate-800">
      
      {/* ────────────────── SKY BLUE ATMOSPHERE ────────────────── */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ────────────────── MAGAZINE HEADER ────────────────── */}
        <div className="flex flex-col items-center text-center mb-16">
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-2 text-sky-600 font-bold uppercase tracking-widest text-xs mb-4"
           >
             <FaPenNib /> TripExplorer Journal
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-5xl md:text-7xl font-black text-slate-900 mb-6 font-serif tracking-tight"
           >
             Аялагчийн <span className="italic text-sky-500">Тэмдэглэл</span>
           </motion.h1>
           <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
             Шинэ газрууд, соёл, хоол, адал явдлын тухай сонирхолтой түүхүүд болон зөвлөгөөнүүд.
           </p>
        </div>

        {/* ────────────────── FEATURED POST (Hero) ────────────────── */}
        {activeTab === "all" && featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20 group"
          >
            <Link href={`/blog/${featuredPost.id}`}>
              <div className="grid md:grid-cols-2 gap-0 bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-sky-100/50 hover:shadow-2xl transition-all duration-500 border border-slate-100">
                {/* Image Side */}
                <div className="relative h-[400px] md:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-white/90 backdrop-blur-md text-sky-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        Онцлох нийтлэл
                      </span>
                    </div>
                </div>
                
                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-6 right-8 text-slate-100 text-8xl font-serif leading-none select-none -z-0">”</div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4 font-medium">
                          <span className="flex items-center gap-1"><FaClock /> {featuredPost.readTime} унших</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>{featuredPost.date}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 font-serif leading-tight group-hover:text-sky-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-slate-500 text-lg mb-8 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={featuredPost.authorImg} alt="Author" className="w-10 h-10 rounded-full border border-slate-200" />
                            <div>
                                <p className="text-sm font-bold text-slate-800">{featuredPost.author}</p>
                                <p className="text-xs text-slate-400">Нийтлэгч</p>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ────────────────── FILTER BAR ────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-30 bg-slate-50/80 backdrop-blur-lg py-4 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-2xl">
           {/* Categories */}
           <div className="flex gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                    activeTab === cat.id 
                      ? "text-white border-sky-500 bg-sky-500 shadow-md shadow-sky-200" 
                      : "text-slate-500 border-slate-200 bg-white hover:border-slate-400 hover:text-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
           </div>

           {/* Search */}
           <div className="relative group w-full md:w-64">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Хайх..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
              />
           </div>
        </div>

        {/* ────────────────── POSTS GRID ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence>
             {(activeTab === 'all' ? otherPosts : filteredPosts).map((post) => (
                <BlogCard key={post.id} post={post} />
             ))}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

/* ────────────────────── BLOG CARD COMPONENT ────────────────────── */
const BlogCard = ({ post }: { post: any }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100 overflow-hidden flex flex-col h-full transition-all duration-300">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wide">
                  {categories.find(c => c.id === post.category)?.label}
                </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
                <span className="flex items-center gap-1"><FaClock /> {post.readTime}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{post.date}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                {post.title}
            </h3>

            <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <img src={post.authorImg} alt="Author" className="w-8 h-8 rounded-full border border-slate-100" />
                  <span className="text-xs font-bold text-slate-700">{post.author}</span>
                </div>
                <span className="text-sky-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  Унших <FaChevronRight className="text-xs" />
                </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogPage;