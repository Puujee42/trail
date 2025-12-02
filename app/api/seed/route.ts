import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// Prevents caching so you can run this multiple times
export const dynamic = "force-dynamic"; 

/* ────────────────────── 1. TRIPS DATA (BILINGUAL) ────────────────────── */
const tripsData = [
  // 1. Glacier Express (Switzerland)
  {
    type: "standard", 
    region: "europe",
    // 🌍 Text fields are now objects with mn/en
    title: {
      mn: "Швейцарийн Glacier Express",
      en: "Swiss Glacier Express"
    },
    category: "nature",
    location: {
      mn: "Швейцарь (Альпийн нуруу)",
      en: "Switzerland (The Alps)"
    },
    duration: {
      mn: "1 Өдөр",
      en: "1 Day"
    },
    rating: 5.0,
    price: 950000, 
    image: "/glacier.png", 
    description: {
      mn: "Дэлхийн хамгийн удаан 'түргэн галт тэрэг'-ээр 8 цагийн турш Альпийн уулсын зүрхээр аялцгаая! 291 гүүр, 91 хонгилоор дайран, панорам цонхоор цастай уулсын үзэсгэлэнг мэдэрнэ.",
      en: "Travel through the heart of the Alps for 8 hours on the world's slowest 'express train'! Experience the beauty of snowy mountains through panoramic windows while passing over 291 bridges and through 91 tunnels."
    },
    tags: ["train", "nature", "alps"], // Can keep generic or translate if needed
    featured: false,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Цюрих хотод буух", en: "Arrival in Zurich" }, 
        desc: { mn: "Онгоцны буудлаас тосч, Цюрих хотын төвтэй танилцана.", en: "Pick up from the airport and tour Zurich city center." } 
      },
      { 
        day: 2, 
        title: { mn: "Галт тэрэгний аялал", en: "Train Journey" }, 
        desc: { mn: "Glacier Express галт тэргэнд сууж, 291 гүүр, 91 хонгилоор дайран өнгөрнө.", en: "Board the Glacier Express and pass through 291 bridges and 91 tunnels." } 
      }
    ]
  },

  // 2. Europe Top 6 Countries
  {
    type: "standard",
    region: "europe",
    title: {
      mn: "Европын Топ 6 Улс (7 Хот)",
      en: "Europe Top 6 Countries (7 Cities)"
    },
    category: "city",
    location: {
      mn: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
      en: "Germany - Switzerland - Italy - France - Belgium - Netherlands"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights"
    },
    rating: 4.8,
    reviews: 10,
    price: 8900000,
    oldPrice: 9500000,
    image: "/europe.png", 
    description: {
      mn: "2025.12.22-2025.12.29. Франкфурт, Женев, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах гайхалтай боломж. Зул сарын баярыг Европт!",
      en: "2025.12.22-2025.12.29. An amazing opportunity to travel through Frankfurt, Geneva, Milan, Paris, Chamonix, Brussels, and Amsterdam. Spend Christmas in Europe!"
    },
    tags: ["christmas", "europe", "new_year"],
    saleMonth: 11, 
    featured: true,
    seatsLeft: 5,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River." } 
      }
    ]
  },

  // 3. Paris Disneyland
  {
    type: "family",
    region: "europe",
    title: {
      mn: "Paris Disneyland & Asterix",
      en: "Paris Disneyland & Asterix"
    },
    category: "theme_park",
    location: {
      mn: "Парис, Франц",
      en: "Paris, France"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights"
    },
    rating: 5.0,
    price: 8800000,
    image: "/glacier.png", 
    description: {
      mn: "2026.01.07-нд эхлэх аялал. Парисын гайхамшиг, Диснейландын ид шид, Астериксийн инээд баяслыг нэг аялалд багтаалаа.",
      en: "Trip starting 2026.01.07. We combined the wonders of Paris, the magic of Disneyland, and the fun of Asterix in one trip."
    },
    perks: ["Disneyland Ticket", "Asterix Park", "Paris City Tour"],
    ageGroup: { mn: "Бүх нас", en: "All Ages" },
    tags: ["kids", "park", "paris"],
    saleMonth: 0, 
    featured: true,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River." } 
      }
    ]
  },

  // 4. Europe Grand Tour
  {
    type: "standard",
    region: "europe",
    title: {
      mn: "Европын Топ 6 Улс (12 Өдөр)",
      en: "Europe Top 6 Countries (12 Days)"
    },
    category: "city",
    location: {
      mn: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
      en: "Germany - Switzerland - Italy - France - Belgium - Netherlands"
    },
    duration: {
      mn: "12 Өдөр / 11 Шөнө",
      en: "12 Days / 11 Nights"
    },
    rating: 4.9,
    price: 12900000,
    image: "/europe.png", 
    description: {
      mn: "Франкфурт, Мюнхен, Женев, Венец, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах тойрон аялал.",
      en: "A grand tour traveling through Frankfurt, Munich, Geneva, Venice, Milan, Paris, Chamonix, Brussels, and Amsterdam."
    },
    tags: ["grand_tour", "europe", "winter"],
    saleMonth: 11, 
    featured: false,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River." } 
      }
    ]
  },

  // 5. Mongolia Trip
  {
    type: "standard",
    region: "mongolia",
    title: {
      mn: "Говийн Гайхамшиг - 7 Өдөр",
      en: "Wonders of the Gobi - 7 Days"
    },
    category: "nature",
    location: {
      mn: "Өмнөговь, Монгол",
      en: "South Gobi, Mongolia"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights"
    },
    rating: 4.9,
    price: 1500000,
    image: "/europe.png", 
    description: {
      mn: "Монголын говийн үзэсгэлэнт газрууд болох Ёлын ам, Хонгорын элс, Баянзагаар аялах мартагдашгүй аялал.",
      en: "An unforgettable trip to the beautiful places of the Mongolian Gobi: Yol Valley, Khongor Sand Dunes, and Bayanzag."
    },
    tags: ["gobi", "nature", "mongolia"],
    featured: true,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Улаанбаатар - Даланзадгад", en: "Ulaanbaatar - Dalanzadgad" }, 
        desc: { mn: "Өмнөговь аймгийн төв рүү ниснэ.", en: "Fly to the center of South Gobi province." } 
      },
      { 
        day: 2, 
        title: { mn: "Ёлын ам", en: "Yol Valley" }, 
        desc: { mn: "Мөнх цаст мөсөн хавцлаар алхана.", en: "Hike through the perennial ice canyon." } 
      },
      { 
        day: 3, 
        title: { mn: "Хонгорын элс", en: "Khongor Sand Dunes" }, 
        desc: { mn: "Элсэн манхан дээр нар жаргахыг харна.", en: "Watch the sunset on the sand dunes." } 
      }
    ]
  }
];

/* ────────────────────── 2. BLOG DATA (BILINGUAL) ────────────────────── */
const blogData = [
  {
    title: {
      mn: "Европын аялалд чемоданаа хэрхэн бэлдэх вэ?",
      en: "How to Pack for a Trip to Europe?"
    },
    excerpt: {
      mn: "Өвлийн Европ аялалд гарах гэж байна уу? Дулаан хувцаслах, зай хэмнэх болон зайлшгүй авч явах зүйлсийн жагсаалт.",
      en: "Heading to Europe in winter? A checklist for dressing warm, saving space, and essentials to pack."
    },
    content: {
        mn: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
        en: "<p>Full article content goes here...</p>"
    },
    category: "tips",
    author: "Б. Анударь",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: "5 min",
    image: "/europe.png", 
    featured: true,
  },
  {
    title: {
      mn: "Glacier Express: Дэлхийн хамгийн удаан хурдан галт тэрэг",
      en: "Glacier Express: The World's Slowest Express Train"
    },
    excerpt: {
      mn: "Швейцарийн Альпийн нуруугаар аялах 8 цагийн гайхамшигт аяллын тухай.",
      en: "About the magnificent 8-hour journey through the Swiss Alps."
    },
    content: {
        mn: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
        en: "<p>Full article content goes here...</p>"
    },
    category: "stories",
    author: "Temuulen",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: "6 min",
    image: "/glacier.png", 
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
    await tripsCollection.deleteMany({}); 
    const tripsResult = await tripsCollection.insertMany(tripsData); 

    // --- Seed Blogs ---
    const blogCollection = db.collection("posts");
    await blogCollection.deleteMany({}); 
    const blogResult = await blogCollection.insertMany(blogData); 

    return NextResponse.json({ 
      success: true, 
      message: "Database RESET and updated with BILINGUAL DATA!", 
      tripsCount: tripsResult.insertedCount,
      blogCount: blogResult.insertedCount
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}