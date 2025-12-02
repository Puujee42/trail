import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// Prevents caching so you can run this multiple times to reset DB
export const dynamic = "force-dynamic"; 

/* ────────────────────── 1. TRIPS DATA (TRILINGUAL PRICES) ────────────────────── */
const tripsData = [
  // 1. Glacier Express (Switzerland)
  {
    type: "standard", 
    region: "europe",
    title: {
      mn: "Швейцарийн Glacier Express",
      en: "Swiss Glacier Express",
      ko: "스위스 빙하 특급"
    },
    category: "nature",
    location: {
      mn: "Швейцарь (Альпийн нуруу)",
      en: "Switzerland (The Alps)",
      ko: "스위스 (알프스)"
    },
    duration: {
      mn: "1 Өдөр",
      en: "1 Day",
      ko: "1일"
    },
    rating: 5.0,
    price: { 
      mn: 950000, 
      en: 280, 
      ko: 380000 
    }, 
    image: "/glacier.png", 
    description: {
      mn: "Дэлхийн хамгийн удаан 'түргэн галт тэрэг'-ээр 8 цагийн турш Альпийн уулсын зүрхээр аялцгаая! 291 гүүр, 91 хонгилоор дайран, панорам цонхоор цастай уулсын үзэсгэлэнг мэдэрнэ.",
      en: "Travel through the heart of the Alps for 8 hours on the world's slowest 'express train'! Experience the beauty of snowy mountains through panoramic windows while passing over 291 bridges and through 91 tunnels.",
      ko: "세계에서 가장 느린 '특급 열차'를 타고 알프스의 심장부를 8시간 동안 여행해보세요! 291개의 다리와 91개의 터널을 지나며 파노라마 창문을 통해 눈 덮인 산의 아름다움을 느껴보세요."
    },
    tags: ["train", "nature", "alps"],
    featured: false,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Цюрих хотод буух", en: "Arrival in Zurich", ko: "취리히 도착" }, 
        desc: { mn: "Онгоцны буудлаас тосч, Цюрих хотын төвтэй танилцана.", en: "Pick up from the airport and tour Zurich city center.", ko: "공항에서 픽업하여 취리히 시내 중심가를 관광합니다." } 
      },
      { 
        day: 2, 
        title: { mn: "Галт тэрэгний аялал", en: "Train Journey", ko: "기차 여행" }, 
        desc: { mn: "Glacier Express галт тэргэнд сууж, 291 гүүр, 91 хонгилоор дайран өнгөрнө.", en: "Board the Glacier Express and pass through 291 bridges and 91 tunnels.", ko: "빙하 특급 열차를 타고 291개의 다리와 91개의 터널을 통과합니다." } 
      }
    ]
  },

  // 2. Europe Top 6 Countries
  {
    type: "standard",
    region: "europe",
    title: {
      mn: "Европын Топ 6 Улс (7 Хот)",
      en: "Europe Top 6 Countries (7 Cities)",
      ko: "유럽 6개국 투어 (7개 도시)"
    },
    category: "city",
    location: {
      mn: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
      en: "Germany - Switzerland - Italy - France - Belgium - Netherlands",
      ko: "독일 - 스위스 - 이탈리아 - 프랑스 - 벨기에 - 네덜란드"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights",
      ko: "7일 / 6박"
    },
    rating: 4.8,
    reviews: 10,
    price: { mn: 8900000, en: 2600, ko: 3500000 },
    oldPrice: { mn: 9500000, en: 2800, ko: 3800000 },
    image: "/europe.png", 
    description: {
      mn: "2025.12.22-2025.12.29. Франкфурт, Женев, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах гайхалтай боломж. Зул сарын баярыг Европт!",
      en: "2025.12.22-2025.12.29. An amazing opportunity to travel through Frankfurt, Geneva, Milan, Paris, Chamonix, Brussels, and Amsterdam. Spend Christmas in Europe!",
      ko: "2025.12.22-2025.12.29. 프랑크푸르트, 제네바, 밀라노, 파리, 샤모니, 브뤼셀, 암스테르담을 여행하는 놀라운 기회. 유럽에서 크리스마스를 보내세요!"
    },
    tags: ["christmas", "europe", "new_year"],
    saleMonth: 11, 
    featured: true,
    seatsLeft: 5,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt", ko: "프랑크푸르트" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River.", ko: "독일에 도착하여 마인 강변을 산책합니다." } 
      }
    ]
  },

  // 3. Paris Disneyland
  {
    type: "family",
    region: "europe",
    title: {
      mn: "Paris Disneyland & Asterix",
      en: "Paris Disneyland & Asterix",
      ko: "파리 디즈니랜드 & 아스테릭스"
    },
    category: "theme_park",
    location: {
      mn: "Парис, Франц",
      en: "Paris, France",
      ko: "프랑스 파리"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights",
      ko: "7일 / 6박"
    },
    rating: 5.0,
    price: { mn: 8800000, en: 2550, ko: 3450000 },
    image: "/glacier.png", 
    description: {
      mn: "2026.01.07-нд эхлэх аялал. Парисын гайхамшиг, Диснейландын ид шид, Астериксийн инээд баяслыг нэг аялалд багтаалаа.",
      en: "Trip starting 2026.01.07. We combined the wonders of Paris, the magic of Disneyland, and the fun of Asterix in one trip.",
      ko: "2026.01.07 출발. 파리의 경이로움, 디즈니랜드의 마법, 아스테릭스의 재미를 한 번에 담았습니다."
    },
    perks: ["Disneyland Ticket", "Asterix Park", "Paris City Tour"],
    ageGroup: { mn: "Бүх нас", en: "All Ages", ko: "전연령" },
    tags: ["kids", "park", "paris"],
    saleMonth: 0, 
    featured: true,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt", ko: "프랑크푸르트" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River.", ko: "독일에 도착하여 마인 강변을 산책합니다." } 
      }
    ]
  },

  // 4. Europe Grand Tour
  {
    type: "standard",
    region: "europe",
    title: {
      mn: "Европын Топ 6 Улс (12 Өдөр)",
      en: "Europe Top 6 Countries (12 Days)",
      ko: "유럽 6개국 그랜드 투어 (12일)"
    },
    category: "city",
    location: {
      mn: "Герман - Швейцарь - Итали - Франц - Бельги - Нидерланд",
      en: "Germany - Switzerland - Italy - France - Belgium - Netherlands",
      ko: "독일 - 스위스 - 이탈리아 - 프랑스 - 벨기에 - 네덜란드"
    },
    duration: {
      mn: "12 Өдөр / 11 Шөнө",
      en: "12 Days / 11 Nights",
      ko: "12일 / 11박"
    },
    rating: 4.9,
    price: { mn: 12900000, en: 3800, ko: 5100000 },
    image: "/europe.png", 
    description: {
      mn: "Франкфурт, Мюнхен, Женев, Венец, Милан, Парис, Шамони, Брюссель, Амстердам хотуудаар аялах тойрон аялал.",
      en: "A grand tour traveling through Frankfurt, Munich, Geneva, Venice, Milan, Paris, Chamonix, Brussels, and Amsterdam.",
      ko: "프랑크푸르트, 뮌헨, 제네바, 베니스, 밀라노, 파리, 샤모니, 브뤼셀, 암스테르담을 여행하는 그랜드 투어."
    },
    tags: ["grand_tour", "europe", "winter"],
    saleMonth: 11, 
    featured: false,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Франкфурт", en: "Frankfurt", ko: "프랑크푸르트" }, 
        desc: { mn: "Германд газардаж, Майн голын эргээр зугаална.", en: "Land in Germany and stroll along the Main River.", ko: "독일에 도착하여 마인 강변을 산책합니다." } 
      }
    ]
  },

  // 5. Mongolia Trip
  {
    type: "standard",
    region: "mongolia",
    title: {
      mn: "Говийн Гайхамшиг - 7 Өдөр",
      en: "Wonders of the Gobi - 7 Days",
      ko: "고비 사막의 경이로움 - 7일"
    },
    category: "nature",
    location: {
      mn: "Өмнөговь, Монгол",
      en: "South Gobi, Mongolia",
      ko: "몽골 남고비"
    },
    duration: {
      mn: "7 Өдөр / 6 Шөнө",
      en: "7 Days / 6 Nights",
      ko: "7일 / 6박"
    },
    rating: 4.9,
    price: { mn: 1500000, en: 450, ko: 600000 },
    image: "/europe.png", 
    description: {
      mn: "Монголын говийн үзэсгэлэнт газрууд болох Ёлын ам, Хонгорын элс, Баянзагаар аялах мартагдашгүй аялал.",
      en: "An unforgettable trip to the beautiful places of the Mongolian Gobi: Yol Valley, Khongor Sand Dunes, and Bayanzag.",
      ko: "욜 밸리, 홍고르 엘스, 바얀작 등 몽골 고비의 아름다운 명소를 여행하는 잊지 못할 여행."
    },
    tags: ["gobi", "nature", "mongolia"],
    featured: true,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Улаанбаатар - Даланзадгад", en: "Ulaanbaatar - Dalanzadgad", ko: "울란바토르 - 달란자가드" }, 
        desc: { mn: "Өмнөговь аймгийн төв рүү ниснэ.", en: "Fly to the center of South Gobi province.", ko: "남고비 지방 중심지로 비행합니다." } 
      },
      { 
        day: 2, 
        title: { mn: "Ёлын ам", en: "Yol Valley", ko: "욜 밸리" }, 
        desc: { mn: "Мөнх цаст мөсөн хавцлаар алхана.", en: "Hike through the perennial ice canyon.", ko: "만년설이 있는 얼음 협곡을 하이킹합니다." } 
      },
      { 
        day: 3, 
        title: { mn: "Хонгорын элс", en: "Khongor Sand Dunes", ko: "홍고르 엘스" }, 
        desc: { mn: "Элсэн манхан дээр нар жаргахыг харна.", en: "Watch the sunset on the sand dunes.", ko: "모래 언덕 위에서 일몰을 감상합니다." } 
      }
    ]
  }
];

/* ────────────────────── 2. BLOG DATA (TRILINGUAL) ────────────────────── */
const blogData = [
  {
    title: {
      mn: "2025 онд заавал очих 10 газар",
      en: "10 Must-Visit Places in 2025",
      ko: "2025년 꼭 가봐야 할 10곳"
    },
    excerpt: {
      mn: "Дэлхий даяарх аялал жуулчлалын чиг хандлага, шинээр нээгдэж буй үзэсгэлэнт газрууд.",
      en: "Global tourism trends, newly opening scenic spots, and budget travel opportunities.",
      ko: "세계 관광 트렌드, 새로 오픈하는 명소 및 저예산 여행 기회."
    },
    content: {
        mn: "<p>Энд дэлгэрэнгүй нийтлэл байх болно...</p>",
        en: "<p>Full article content goes here...</p>",
        ko: "<p>전체 기사 내용이 여기에 들어갑니다...</p>"
    },
    category: "guide",
    author: "B. Anudari",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: { mn: "5 мин", en: "5 min", ko: "5분" },
    image: "/europe.png", 
    featured: true,
  },
  {
    title: {
      mn: "Чемоданаа хэрхэн зөв баглах вэ?",
      en: "How to Pack Your Suitcase Correctly?",
      ko: "여행 가방을 올바르게 싸는 법"
    },
    excerpt: {
      mn: "Ачаагаа хөнгөн байлгахын зэрэгцээ хэрэгтэй бүхнээ багтаах шалгарсан аргууд.",
      en: "Proven methods to keep your luggage light while packing everything you need.",
      ko: "짐을 가볍게 유지하면서 필요한 모든 것을 챙기는 입증된 방법."
    },
    content: {
        mn: "<p>...</p>",
        en: "<p>...</p>",
        ko: "<p>...</p>"
    },
    category: "tips",
    author: "G. Temuulen",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: { mn: "3 мин", en: "3 min", ko: "3분" },
    image: "/packing.jpg", 
    featured: false
  },
  {
    title: {
      mn: "Японы гудамжны хоолны соёл",
      en: "Japanese Street Food Culture",
      ko: "일본 길거리 음식 문화"
    },
    excerpt: {
      mn: "Токиогийн гудамжаар аялж, Рамен, Такояки, Якитори зэрэг амтат хоолнуудын түүхтэй танилцсан тэмдэглэл.",
      en: "Notes on touring Tokyo streets and exploring the history of Ramen, Takoyaki, and Yakitori.",
      ko: "도쿄 거리를 여행하며 라멘, 타코야키, 야키토리의 역사를 탐방한 기록."
    },
    content: {
        mn: "<p>...</p>",
        en: "<p>...</p>",
        ko: "<p>...</p>"
    },
    category: "food",
    author: "M. Sarnai",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    date: "2025.11.15",
    readTime: { mn: "6 мин", en: "6 min", ko: "6분" },
    image: "/japan.jpg",
    featured: false
  },
  {
    title: {
      mn: "Ганцаараа аялахад юу анхаарах вэ?",
      en: "Tips for Solo Travelers",
      ko: "나홀로 여행자를 위한 팁"
    },
    excerpt: {
      mn: "Аюулгүй байдал, шинэ найзуудтай болох, өөрийгөө нээх аяллын тухай сэтгэл зүйн болон практик зөвлөгөө.",
      en: "Psychological and practical advice on safety, making new friends, and self-discovery trips.",
      ko: "안전, 새로운 친구 사귀기, 자아 발견 여행에 대한 심리적 및 실용적 조언."
    },
    content: {
        mn: "<p>...</p>",
        en: "<p>...</p>",
        ko: "<p>...</p>"
    },
    category: "tips",
    author: "D. Bat",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bat",
    date: "2025.11.10",
    readTime: { mn: "8 мин", en: "8 min", ko: "8분" },
    image: "/solo.jpg",
    featured: false
  },
  {
    title: {
      mn: "Бали арал дээрх дижитал нүүдэлчид",
      en: "Digital Nomads in Bali",
      ko: "발리의 디지털 노마드"
    },
    excerpt: {
      mn: "Балид хэрхэн ажиллаж, амьдрах вэ? Виза, интернет, coworking space-үүдийн тухай мэдээлэл.",
      en: "How to live and work in Bali? Details about visas, internet, and coworking spaces.",
      ko: "발리에서 일하고 사는 법? 비자, 인터넷, 코워킹 스페이스에 대한 자세한 정보."
    },
    content: {
        mn: "<p>...</p>",
        en: "<p>...</p>",
        ko: "<p>...</p>"
    },
    category: "stories",
    author: "E. Zolboo",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zolo",
    date: "2025.11.05",
    readTime: { mn: "10 мин", en: "10 min", ko: "10분" },
    image: "/bali-nomad.jpg",
    featured: false
  },
  {
    title: {
      mn: "Европоор галт тэргээр аялсан нь",
      en: "Traveling Europe by Train",
      ko: "기차로 떠나는 유럽 여행"
    },
    excerpt: {
      mn: "Eurail Pass ашиглан 5 улсаар аялсан миний түүх. Зардал хэмнэх аргууд болон хамгийн гоё маршрут.",
      en: "My story of traveling through 5 countries using a Eurail Pass. Cost-saving tips and best routes.",
      ko: "유레일 패스를 이용하여 5개국을 여행한 이야기. 비용 절감 팁과 최고의 루트."
    },
    content: {
        mn: "<p>...</p>",
        en: "<p>...</p>",
        ko: "<p>...</p>"
    },
    category: "stories",
    author: "T. Bold",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bold",
    date: "2025.10.28",
    readTime: { mn: "7 мин", en: "7 min", ko: "7분" },
    image: "/eurotrip.jpg",
    featured: false
  }
];

/* ────────────────────── 3. EXECUTE SEEDING ────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");
    
    // Seed Trips
    const tripsCollection = db.collection("trips");
    await tripsCollection.deleteMany({}); 
    const tripsResult = await tripsCollection.insertMany(tripsData); 

    // Seed Blogs
    const blogCollection = db.collection("posts");
    await blogCollection.deleteMany({}); 
    const blogResult = await blogCollection.insertMany(blogData); 

    return NextResponse.json({ 
      success: true, 
      message: "Database RESET and updated with TRILINGUAL (MN/EN/KO) DATA!", 
      tripsCount: tripsResult.insertedCount,
      blogCount: blogResult.insertedCount
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}