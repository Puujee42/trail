import clientPromise from "./index";

const blogPosts = [
  {
    title: "2025 онд заавал очих 10 газар",
    excerpt: "Дэлхий даяарх аялал жуулчлалын чиг хандлага, шинээр нээгдэж буй үзэсгэлэнт газрууд болон хямд зардлаар аялах боломжууд.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>", // Placeholder content
    category: "guide",
    author: "Б. Анударь",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: "5 мин",
    image: "/paris.jpg",
    featured: true
  },
  {
    title: "Чемоданаа хэрхэн зөв баглах вэ?",
    excerpt: "Ачаагаа хөнгөн байлгахын зэрэгцээ хэрэгтэй бүхнээ багтаах шалгарсан аргууд. Minimalist аялагчийн зөвлөгөө.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "tips",
    author: "Г. Тэмүүлэн",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: "3 мин",
    image: "/packing.jpg", 
    featured: false
  },
  {
    title: "Японы гудамжны хоолны соёл",
    excerpt: "Токиогийн гудамжаар аялж, Рамен, Такояки, Якитори зэрэг амтат хоолнуудын түүхтэй танилцсан тэмдэглэл.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "food",
    author: "М. Сарнай",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    date: "2025.11.15",
    readTime: "6 мин",
    image: "/japan.jpg",
    featured: false
  },
  {
    title: "Ганцаараа аялахад юу анхаарах вэ?",
    excerpt: "Аюулгүй байдал, шинэ найзуудтай болох, өөрийгөө нээх аяллын тухай сэтгэл зүйн болон практик зөвлөгөө.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "tips",
    author: "Д. Бат",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bat",
    date: "2025.11.10",
    readTime: "8 мин",
    image: "/solo.jpg",
    featured: false
  },
  {
    title: "Бали арал дээрх дижитал нүүдэлчид",
    excerpt: "Балид хэрхэн ажиллаж, амьдрах вэ? Виза, интернет, coworking space-үүдийн тухай дэлгэрэнгүй мэдээлэл.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "stories",
    author: "Э. Золбоо",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zolo",
    date: "2025.11.05",
    readTime: "10 мин",
    image: "/bali-nomad.jpg",
    featured: false
  },
  {
    title: "Европоор галт тэргээр аялсан нь",
    excerpt: "Eurail Pass ашиглан 5 улсаар аялсан миний түүх. Зардал хэмнэх аргууд болон хамгийн гоё маршрут.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "stories",
    author: "Т. Болд",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bold",
    date: "2025.10.28",
    readTime: "7 мин",
    image: "/eurotrip.jpg",
    featured: false
  }
];

export async function seedBlog() {
  const client = await clientPromise;
  const db = client.db("travel_db");
  const collection = db.collection("posts");

  // Optional: Clean existing
  await collection.deleteMany({});

  const result = await collection.insertMany(blogPosts);
  return { success: true, count: result.insertedCount };
}