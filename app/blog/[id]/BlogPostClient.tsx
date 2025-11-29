"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  FaArrowLeft, FaCalendarAlt, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn 
} from "react-icons/fa";
import { BlogPost } from "@/lib/mongo/blog";

const BlogPostClient = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-white min-h-screen pb-20 pt-24">
      
      {/* ────────────────── HEADER SECTION ────────────────── */}
      <div className="container mx-auto px-4 max-w-4xl mb-10">
        
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold text-sm">
          <FaArrowLeft /> Нийтлэл рүү буцах
        </Link>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <FaClock /> {post.readTime} унших
          </span>
          <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <FaCalendarAlt /> {post.date}
          </span>
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8"
        >
          {post.title}
        </motion.h1>

        {/* Author */}
        <div className="flex items-center gap-4 border-y border-slate-100 py-6">
          <img 
            src={post.authorImg} 
            alt={post.author} 
            className="w-12 h-12 rounded-full bg-slate-100"
          />
          <div>
            <div className="font-bold text-slate-800">{post.author}</div>
            <div className="text-slate-500 text-sm">Аялал, нийтлэлч</div>
          </div>
          
          {/* Social Share (Mock) */}
          <div className="ml-auto flex gap-3">
             <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"><FaFacebookF/></button>
             <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-sky-400 hover:text-white flex items-center justify-center transition-all"><FaTwitter/></button>
          </div>
        </div>
      </div>

      {/* ────────────────── FEATURED IMAGE ────────────────── */}
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-xl"
        >
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* ────────────────── CONTENT BODY ────────────────── */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
            {/* Excerpt as Lead Paragraph */}
            <p className="lead font-medium text-xl text-slate-600 mb-8 border-l-4 border-blue-500 pl-4 italic">
              {post.excerpt}
            </p>

            {/* 
              If your DB 'content' field is raw HTML string, use this.
              If it's plain text, just put {post.content} 
            */}
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              // Fallback dummy content if DB is empty
              <div className="text-slate-600 space-y-6">
                <p>
                  Аялал жуулчлал бол зөвхөн шинэ газар үзэх тухай биш, харин өөрийгөө шинээр нээх боломж юм. 
                  Энэхүү нийтлэлээр бид танд {post.location || "дэлхийн"} хамгийн сонирхолтой газруудын нэг болох 
                  энэхүү байршлын талаар дэлгэрэнгүй хүргэж байна.
                </p>
                <h3>Яагаад энд очих хэрэгтэй вэ?</h3>
                <p>
                  Байгалийн үзэсгэлэн, түүх соёлын үнэт өвүүд болон нутгийн иргэдийн найрсаг зочломтгой зан 
                  таныг угтах болно. Мөн гэрэл зурагчдын хувьд жинхэнэ диваажин гэж хэлж болно.
                </p>
                <ul>
                  <li>Өвөрмөц хоолны соёл</li>
                  <li>Түүхэн дурсгалт газрууд</li>
                  <li>Адал явдалт үйл ажиллагаанууд</li>
                </ul>
                <p>
                  Бидний бэлтгэсэн энэхүү зөвлөгөө танд аяллаа төлөвлөхөд тусална гэдэгт итгэлтэй байна. 
                  Дараагийн аялал тань адал явдлаар дүүрэн байх болтугай!
                </p>
              </div>
            )}
        </div>
        
        {/* Footer CTA */}
        <div className="mt-16 bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
           <h3 className="text-2xl font-bold text-slate-800 mb-2">Танд энэ нийтлэл таалагдсан уу?</h3>
           <p className="text-slate-500 mb-6">Манай мэдээллийн товхимолд бүртгүүлж, шинэ аяллын мэдээг цаг алдалгүй аваарай.</p>
           <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input type="email" placeholder="И-мэйл хаяг" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">Бүртгүүлэх</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BlogPostClient;