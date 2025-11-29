import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

/* ────────────────────── 1. PREPARE DATA ────────────────────── */

// We combine all trip types into one 'trips' collection but distinguish them with the 'type' field.
const tripsData = [
  // --- Standard Trips ---
  { type: "standard", title: "Хөвсгөл Далайн Аялал", category: "nature", location: "Хөвсгөл, Монгол", duration: "4 Өдөр", rating: 4.9, reviews: 120, price: 450000, oldPrice: 550000, image: "/lake.jpg", tags: ["Best Seller", "Хямдрал"], featured: true },
  { type: "standard", title: "Парис & Европын Тур", category: "city", location: "Парис, Франц", duration: "7 Өдөр", rating: 5.0, reviews: 85, price: 4500000, image: "/paris.jpg", tags: ["Тансаг"], featured: false },
  { type: "standard", title: "Бали Арлын Амралт", category: "beach", location: "Бали, Индонез", duration: "10 Өдөр", rating: 4.8, reviews: 200, price: 3200000, image: "/bali.jpg", tags: ["Гэр бүл"], featured: false },
  { type: "standard", title: "Япон Улсын Сакура Аялал", category: "culture", location: "Киото, Япон", duration: "6 Өдөр", rating: 4.9, reviews: 150, price: 3800000, image: "/japan.jpg", tags: ["Эрэлттэй"], featured: true },
  { type: "standard", title: "Дубайн Тансаг Аялал", category: "city", location: "Дубай, АНЭУ", duration: "5 Өдөр", rating: 4.7, reviews: 90, price: 2900000, image: "/dubai.jpg", tags: ["Шопинг"], featured: false },
  { type: "standard", title: "Говийн Гайхамшиг", category: "nature", location: "Өмнөговь, Монгол", duration: "3 Өдөр", rating: 5.0, reviews: 45, price: 350000, image: "/gobi.jpg", tags: ["Адал явдал"], featured: false },

  // --- Family Trips ---
  { type: "family", title: "Токио Диснейленд Аялал", category: "theme_park", location: "Токио, Япон", duration: "5 Өдөр", rating: 4.9, price: 3800000, image: "/tokyo.jpg", ageGroup: "3+ нас", perks: ["Дисней тасалбар", "Өглөөний цай"], featured: true },
  { type: "family", title: "Анталья - All Inclusive", category: "resort", location: "Анталья, Турк", duration: "8 Өдөр", rating: 4.8, price: 4200000, image: "/turkey.jpg", ageGroup: "Бүх нас", perks: ["Хүүхэд үнэгүй", "Усан парк"], featured: false },
  { type: "family", title: "Тэрэлж - Гэр бүлийн амралт", category: "nature", location: "Тэрэлж, Монгол", duration: "3 Өдөр", rating: 4.7, price: 450000, image: "/terelj.jpg", ageGroup: "Бүх нас", perks: ["Морин аялал", "Түүдэг гал"], featured: false },
  { type: "family", title: "Чежү Арал - Визагүй", category: "nature", location: "Чежү, Солонгос", duration: "5 Өдөр", rating: 4.8, price: 2500000, image: "/jeju.jpg", ageGroup: "5+ нас", perks: ["Усан онгоц", "Музей"], featured: false },
  { type: "family", title: "Пүкет - Заантай аялал", category: "resort", location: "Пүкет, Тайланд", duration: "7 Өдөр", rating: 4.9, price: 3100000, image: "/phuket.jpg", ageGroup: "Бүх нас", perks: ["Заан унах", "Арал тойрох"], featured: true },
  { type: "family", title: "Сингапур - Universal Studios", category: "theme_park", location: "Сингапур", duration: "6 Өдөр", rating: 5.0, price: 4500000, image: "/singapore.jpg", ageGroup: "4+ нас", perks: ["Sentosa арал", "Зоо парк"], featured: false },

  // --- Honeymoon Trips ---
  { type: "honeymoon", title: "Мальдив - Усан Вилла", category: "island", location: "Мале, Мальдив", duration: "6 Өдөр", rating: 5.0, price: 8500000, image: "/maldives.jpg", romanceFactor: "10/10", perks: ["Хувийн усан сан", "Лаатай оройн зоог"], tags: ["Adults Only"] },
  { type: "honeymoon", title: "Санторини - Нар Жаргах Мөч", category: "island", location: "Санторини, Грек", duration: "7 Өдөр", rating: 4.9, price: 6200000, image: "/santorini.jpg", romanceFactor: "9.8/10", perks: ["Дарсны амталгаа", "Фото зураг авалт"], tags: ["Best View"] },
  { type: "honeymoon", title: "Парис - Хайрын Хот", category: "city", location: "Парис, Франц", duration: "5 Өдөр", rating: 4.8, price: 4800000, image: "/paris-honey.jpg", romanceFactor: "9.5/10", perks: ["Сена мөрний аялал", "Эйфелийн цамхаг"], tags: ["Classic"] },
  { type: "honeymoon", title: "Бора Бора - Диваажин", category: "luxury", location: "Бора Бора, Францын Полинез", duration: "8 Өдөр", rating: 5.0, price: 12500000, image: "/bora.jpg", romanceFactor: "10/10", perks: ["All Inclusive", "Спа Багц"], tags: ["VIP Luxury"] },
  { type: "honeymoon", title: "Венец - Завьтай Аялал", category: "city", location: "Венец, Итали", duration: "5 Өдөр", rating: 4.7, price: 5100000, image: "/venice.jpg", romanceFactor: "9.2/10", perks: ["Гондола завь", "Дуурь үзэх"], tags: ["History"] },
  { type: "honeymoon", title: "Бали - Убуд ширэнгэн ой", category: "island", location: "Бали, Индонез", duration: "10 Өдөр", rating: 4.9, price: 3900000, image: "/bali-honey.jpg", romanceFactor: "9.6/10", perks: ["Хос массаж", "Цэцгэн банн"], tags: ["Relax"] },

  // --- Solo Trips ---
  { type: "solo", title: "Тайланд - Backpacking Tour", category: "party", location: "Бангкок & Ко-Панган", duration: "10 Өдөр", rating: 4.8, price: 2800000, image: "/thailand-solo.jpg", vibe: "High Energy", tags: ["Hostel Life", "Full Moon Party"], socialScore: 95 },
  { type: "solo", title: "Вьетнам - Мото Аялал", category: "adventure", location: "Ха-Жанг, Вьетнам", duration: "7 Өдөр", rating: 4.9, price: 3100000, image: "/vietnam.jpg", vibe: "Adrenaline", tags: ["Мотоцикл", "Уулс"], socialScore: 80 },
  { type: "solo", title: "Бали - Coworking & Surf", category: "nomad", location: "Чангу, Бали", duration: "14 Өдөр", rating: 4.7, price: 4500000, image: "/bali-nomad.jpg", vibe: "Chill & Work", tags: ["High WiFi", "Сёрфинг"], socialScore: 70 },
  { type: "solo", title: "Европ - Галт тэрэгний аялал", category: "party", location: "Берлин - Прага - Будапешт", duration: "9 Өдөр", rating: 4.9, price: 5800000, image: "/eurotrip.jpg", vibe: "History & Bar", tags: ["Eurail Pass", "Pub Crawl"], socialScore: 90 },
  { type: "solo", title: "Монгол - Алтай Таван Богд", category: "adventure", location: "Баян-Өлгий, Монгол", duration: "6 Өдөр", rating: 5.0, price: 850000, image: "/altai.jpg", vibe: "Extreme", tags: ["Ууланд алхах", "Кемпинг"], socialScore: 85 },
  { type: "solo", title: "Япон - Ганцаарчилсан Аялал", category: "nomad", location: "Токио & Осака", duration: "7 Өдөр", rating: 4.8, price: 3900000, image: "/japan-solo.jpg", vibe: "Explore", tags: ["Капсул зочид буудал", "Рамен"], socialScore: 60 }
];

const blogData = [
  { title: "2025 онд заавал очих 10 газар", excerpt: "Дэлхий даяарх аялал жуулчлалын чиг хандлага...", category: "guide", author: "Б. Анударь", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu", date: "2025.11.20", readTime: "5 мин", image: "/paris.jpg", featured: true },
  { title: "Чемоданаа хэрхэн зөв баглах вэ?", excerpt: "Ачаагаа хөнгөн байлгахын зэрэгцээ...", category: "tips", author: "Г. Тэмүүлэн", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu", date: "2025.11.18", readTime: "3 мин", image: "/packing.jpg", featured: false },
  { title: "Японы гудамжны хоолны соёл", excerpt: "Токиогийн гудамжаар аялж, Рамен...", category: "food", author: "М. Сарнай", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", date: "2025.11.15", readTime: "6 мин", image: "/japan.jpg", featured: false },
  { title: "Ганцаараа аялахад юу анхаарах вэ?", excerpt: "Аюулгүй байдал, шинэ найзуудтай болох...", category: "tips", author: "Д. Бат", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bat", date: "2025.11.10", readTime: "8 мин", image: "/solo.jpg", featured: false },
  { title: "Бали арал дээрх дижитал нүүдэлчид", excerpt: "Балид хэрхэн ажиллаж, амьдрах вэ?...", category: "stories", author: "Э. Золбоо", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zolo", date: "2025.11.05", readTime: "10 мин", image: "/bali-nomad.jpg", featured: false },
  { title: "Европоор галт тэргээр аялсан нь", excerpt: "Eurail Pass ашиглан 5 улсаар аялсан миний түүх...", category: "stories", author: "Т. Болд", authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bold", date: "2025.10.28", readTime: "7 мин", image: "/eurotrip.jpg", featured: false }
];

/* ────────────────────── 2. EXECUTE SEEDING ────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");

    // 1. Seed Trips
    const tripsCollection = db.collection("trips");
    await tripsCollection.deleteMany({}); // CLEAR existing data to prevent duplicates
    const tripsResult = await tripsCollection.insertMany(tripsData);

    // 2. Seed Blog
    const blogCollection = db.collection("posts");
    await blogCollection.deleteMany({}); // CLEAR existing data
    const blogResult = await blogCollection.insertMany(blogData);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully!",
      tripsInserted: tripsResult.insertedCount,
      postsInserted: blogResult.insertedCount
    });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}