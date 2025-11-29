import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// Prevents caching so you can run this multiple times
export const dynamic = "force-dynamic"; 

/* ────────────────────── 1. TRIPS DATA ────────────────────── */
const tripsData = [
  // 1. Glacier Express (Switzerland)
  {
    type: "standard", // Matches our schema (standard | family | solo | honeymoon)
    title: "Швейцарийн Glacier Express",
    category: "nature",
    location: "Швейцарь (Альпийн нуруу)",
    duration: "1 Өдөр",
    rating: 5.0,
    price: 950000, 
    image: "/glacier.png", 
    description: "Дэлхийн хамгийн удаан 'түргэн галт тэрэг'-ээр 8 цагийн турш Альпийн уулсын зүрхээр аялцгаая! 291 гүүр, 91 хонгилоор дайран, панорам цонхоор цастай уулсын үзэсгэлэнг мэдэрнэ.",
    tags: ["Галт тэрэг", "Байгаль", "Альп"],
    featured: false,
      itinerary: [
      { day: 1, title: "Цюрих хотод буух", desc: "Онгоцны буудлаас тосч, Цюрих хотын төвтэй танилцана." },
      { day: 2, title: "Галт тэрэгний аялал", desc: "Glacier Express галт тэргэнд сууж, 291 гүүр, 91 хонгилоор дайран өнгөрнө." },
      { day: 3, title: "Санкт Мориц", desc: "Дэлхийн өвлийн спортын төв болсон тансаг зэрэглэлийн хотод амарна." },
      { day: 4, title: "Буцах нислэг", desc: "Дурсамж дүүрэн аяллаа өндөрлүүлж эх орондоо буцна." }
    ]
  },

  // 2. Europe Top 6 Countries (7 Days)
  {
    type: "standard",
    title: "Европын Топ 6 Улс (7 Хот)",
    category: "city",
    location: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
    duration: "7 Өдөр / 6 Шөнө",
    rating: 4.8,
    reviews: 10,
    price: 8900000,
    oldPrice: 9500000, // Added old price to show sale
    image: "/europe.png", 
    description: "2025.12.22-2025.12.29. Франкфурт, Женев, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах гайхалтай боломж. Зул сарын баярыг Европт!",
    tags: ["Зул сар", "Европ аялал", "Шинэ жил"],
    saleMonth: 11, // December (0-indexed)
    featured: true,
    seatsLeft: 5,
    itinerary: [
      { day: 1, title: "Франкфурт", desc: "Германд газардаж, Майн голын эргээр зугаална." },
      { day: 2, title: "Цюрих & Женев", desc: "Швейцарийн үзэсгэлэнт нуурын хотуудаар аялана." },
      { day: 3, title: "Милан", desc: "Италийн загварын хот болон Дуомо сүмийг үзнэ." },
      { day: 4, title: "Парис руу хөдлөх", desc: "Хурдны галт тэргээр Парис руу явна." },
      { day: 5, title: "Парис хотын аялал", desc: "Эйфелийн цамхаг, Луврын музей." },
      { day: 6, title: "Диснейлэнд", desc: "Чөлөөт өдөр эсвэл Диснейлэнд орох." },
      { day: 7, title: "Буцах", desc: "Парисаас Улаанбаатар руу ниснэ." }
    ]
       
  },

  // 3. Paris Disneyland (Family)
  {
    type: "family",
    title: "Paris Disneyland & Asterix",
    category: "theme_park",
    location: "Парис, Франц",
    duration: "7 Өдөр / 6 Шөнө",
    rating: 5.0,
    price: 8800000,
    image: "/glacier.png", // Using requested image
    description: "2026.01.07-нд эхлэх аялал. Парисын гайхамшиг, Диснейландын ид шид, Астериксийн инээд баяслыг нэг аялалд багтаалаа. Хүүхэд, залуус, гэр бүл — хүн бүрт зориулагдсан мөрөөдлийн аялал!",
    perks: ["Disneyland тасалбар", "Asterix парк", "Парис хот"],
    ageGroup: "Бүх нас",
    tags: ["Хүүхдийн аялал", "Парк", "Парис"],
    saleMonth: 0, // January
    featured: true,
    itinerary: [
      { day: 1, title: "Франкфурт", desc: "Германд газардаж, Майн голын эргээр зугаална." },
      { day: 2, title: "Цюрих & Женев", desc: "Швейцарийн үзэсгэлэнт нуурын хотуудаар аялана." },
      { day: 3, title: "Милан", desc: "Италийн загварын хот болон Дуомо сүмийг үзнэ." },
      { day: 4, title: "Парис руу хөдлөх", desc: "Хурдны галт тэргээр Парис руу явна." },
      { day: 5, title: "Парис хотын аялал", desc: "Эйфелийн цамхаг, Луврын музей." },
      { day: 6, title: "Диснейлэнд", desc: "Чөлөөт өдөр эсвэл Диснейлэнд орох." },
      { day: 7, title: "Буцах", desc: "Парисаас Улаанбаатар руу ниснэ." }
    ]
       
  },

  // 4. Europe Grand Tour (12 Days)
  {
    type: "standard",
    title: "Европын Топ 6 Улс (12 Өдөр)",
    category: "city",
    location: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
    duration: "12 Өдөр / 11 Шөнө",
    rating: 4.9,
    price: 12900000,
    image: "/europe.png", 
    description: "2025.12.01-2025.12.12. Франкфурт, Мюнхен, Женев, Венец, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах тойрон аялал.",
    tags: ["Тойрон аялал", "Европ", "Өвөл"],
    saleMonth: 11, // December
    featured: false,
    itinerary: [
      { day: 1, title: "Франкфурт", desc: "Германд газардаж, Майн голын эргээр зугаална." },
      { day: 2, title: "Цюрих & Женев", desc: "Швейцарийн үзэсгэлэнт нуурын хотуудаар аялана." },
      { day: 3, title: "Милан", desc: "Италийн загварын хот болон Дуомо сүмийг үзнэ." },
      { day: 4, title: "Парис руу хөдлөх", desc: "Хурдны галт тэргээр Парис руу явна." },
      { day: 5, title: "Парис хотын аялал", desc: "Эйфелийн цамхаг, Луврын музей." },
      { day: 6, title: "Диснейлэнд", desc: "Чөлөөт өдөр эсвэл Диснейлэнд орох." },
      { day: 7, title: "Буцах", desc: "Парисаас Улаанбаатар руу ниснэ." }
    ]
       
  }
];

/* ────────────────────── 2. BLOG DATA ────────────────────── */
const blogData = [
  {
    title: "Европын аялалд чемоданаа хэрхэн бэлдэх вэ?",
    excerpt: "Өвлийн Европ аялалд гарах гэж байна уу? Дулаан хувцаслах, зай хэмнэх болон зайлшгүй авч явах зүйлсийн жагсаалт.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "tips",
    author: "Б. Анударь",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: "5 мин",
    image: "/europe.png", // Using Europe image
    featured: true,
  },
  {
    title: "Glacier Express: Дэлхийн хамгийн удаан хурдан галт тэрэг",
    excerpt: "Швейцарийн Альпийн нуруугаар аялах 8 цагийн гайхамшигт аяллын тухай. Цонхоор харах үзэмж таныг алмайруулах болно.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "stories",
    author: "Г. Тэмүүлэн",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: "6 мин",
    image: "/glacier.png", // Using Glacier image
    featured: false
  },
  {
    title: "Парис хотод хүүхэдтэйгээ аялахад анхаарах зүйлс",
    excerpt: "Диснейлэнд болон Астерикс паркаар аялахдаа хэрхэн дараалал багатай үед очих вэ? Гэр бүлийн аяллын зөвлөгөө.",
    content: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
    category: "guide",
    author: "М. Сарнай",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    date: "2025.11.15",
    readTime: "4 мин",
    image: "/europe.png", // Using Europe image as placeholder for Paris
    featured: false
  }
];

/* ────────────────────── 3. EXECUTE SEEDING ────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");
    
    // --- Seed Trips ---
    const tripsCollection = db.collection("trips");
    await tripsCollection.deleteMany({}); // Delete Old
    const tripsResult = await tripsCollection.insertMany(tripsData); // Insert New

    // --- Seed Blogs ---
    const blogCollection = db.collection("posts");
    await blogCollection.deleteMany({}); // Delete Old
    const blogResult = await blogCollection.insertMany(blogData); // Insert New

    return NextResponse.json({ 
      success: true, 
      message: "Database RESET and updated with REAL DATA!", 
      tripsCount: tripsResult.insertedCount,
      blogCount: blogResult.insertedCount
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}