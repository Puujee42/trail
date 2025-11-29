import clientPromise from "./index";

// 1. Paste your raw arrays here (I combined them for you below)
const rawData = [
  // Standard Packages
  { type: "standard", title: "Хөвсгөл Далайн Аялал", category: "nature", location: "Хөвсгөл, Монгол", duration: "4 Өдөр", rating: 4.9, reviews: 120, price: 450000, oldPrice: 550000, image: "/lake.jpg", tags: ["Best Seller", "Хямдрал"], featured: true },
  { type: "standard", title: "Парис & Европын Тур", category: "city", location: "Парис, Франц", duration: "7 Өдөр", rating: 5.0, reviews: 85, price: 4500000, image: "/paris.jpg", tags: ["Тансаг"], featured: false },
  // ... Add the rest of 'packages' here ...

  // Family Packages
  { type: "family", title: "Токио Диснейленд Аялал", category: "theme_park", location: "Токио, Япон", duration: "5 Өдөр", rating: 4.9, price: 3800000, image: "/tokyo.jpg", ageGroup: "3+ нас", perks: ["Дисней тасалбар", "Өглөөний цай"], featured: true },
  { type: "family", title: "Анталья - All Inclusive", category: "resort", location: "Анталья, Турк", duration: "8 Өдөр", rating: 4.8, price: 4200000, image: "/turkey.jpg", ageGroup: "Бүх нас", perks: ["Хүүхэд үнэгүй", "Усан парк"], featured: false },
  // ... Add the rest of 'familyTrips' here ...

  // Honeymoon Packages
  { type: "honeymoon", title: "Мальдив - Усан Вилла", category: "island", location: "Мале, Мальдив", duration: "6 Өдөр", rating: 5.0, price: 8500000, image: "/maldives.jpg", romanceFactor: "10/10", perks: ["Хувийн усан сан", "Лаатай оройн зоог"], tags: ["Adults Only"] },
  { type: "honeymoon", title: "Санторини - Нар Жаргах Мөч", category: "island", location: "Санторини, Грек", duration: "7 Өдөр", rating: 4.9, price: 6200000, image: "/santorini.jpg", romanceFactor: "9.8/10", perks: ["Дарсны амталгаа", "Фото зураг авалт"], tags: ["Best View"] },
  // ... Add the rest of 'honeymoonTrips' here ...

  // Solo Packages
  { type: "solo", title: "Тайланд - Backpacking Tour", category: "party", location: "Бангкок & Ко-Панган", duration: "10 Өдөр", rating: 4.8, price: 2800000, image: "/thailand-solo.jpg", vibe: "High Energy", tags: ["Hostel Life", "Full Moon Party"], socialScore: 95 },
  { type: "solo", title: "Вьетнам - Мото Аялал", category: "adventure", location: "Ха-Жанг, Вьетнам", duration: "7 Өдөр", rating: 4.9, price: 3100000, image: "/vietnam.jpg", vibe: "Adrenaline", tags: ["Мотоцикл", "Уулс"], socialScore: 80 },
  // ... Add the rest of 'soloTrips' here ...
];

export async function seedDatabase() {
  const client = await clientPromise;
  const db = client.db("travel_db");
  const collection = db.collection("trips");

  // Clear existing data (optional, be careful!)
  await collection.deleteMany({});

  // Insert new data
  const result = await collection.insertMany(rawData);
  
  return { success: true, count: result.insertedCount };
}