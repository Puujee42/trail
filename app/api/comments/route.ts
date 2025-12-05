import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// Force dynamic to ensure we always get the latest approved reviews
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   1. GET: Fetch Approved Comments (Public)
   ───────────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang");

    const query: any = { status: "approved" };

    if (lang) {
      query.language = lang;
    }

    const comments = await db
      .collection("comments")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ success: true, comments });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ─────────────────────────────────────────────────────────────
   2. POST: Submit a New Review (Public)
   ───────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, trip, text, location, rating, language } = body;

    if (!name || !text || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    const newComment = {
      name,
      trip: trip || "General",
      text,
      location: location || "Unknown",
      rating: Number(rating),
      language: language || "mn",
      status: "pending", 
      createdAt: new Date(),
      dateStr: new Date().toISOString().split('T')[0]
    };

    await db.collection("comments").insertOne(newComment);

    return NextResponse.json({ 
      success: true, 
      message: "Review submitted! It will appear after approval." 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ─────────────────────────────────────────────────────────────
   3. PUT: SEED DATABASE (Run this once to push initial data)
   ───────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");

    // 1. Define the Initial Data (MN, EN, KO)
    const seedData = [
      // Mongolian Reviews
      {
        name: "Б. Бат-Эрдэнэ",
        trip: "Хөвсгөл Аялал",
        text: "Үнэхээр гайхалтай зохион байгуулалттай аялал байлаа. Хөтөч маань маш мэдлэгтэй, хоол нь амттай. Дараа жил дахин явна аа!",
        location: "Хатгал, Монгол",
        rating: 5,
        language: "mn",
        status: "approved",
        dateStr: "2025-11-20",
        createdAt: new Date()
      },
      {
        name: "С. Анужин",
        trip: "Парис Тур",
        text: "Мөрөөдлийн аяллаа Mongolia Trails Agency-тэй хамт биелүүллээ. Эйфелийн цамхаг дээр оройн хоол идэх мөч хамгийн гоё нь байсан.",
        location: "Парис, Франц",
        rating: 5,
        language: "mn",
        status: "approved",
        dateStr: "2025-11-15",
        createdAt: new Date()
      },
      // English Reviews
      {
        name: "B. Bat-Erdene",
        trip: "Khuvsgul Trip",
        text: "It was a wonderfully organized trip. Our guide was very knowledgeable, and the food was delicious. Definitely going again next year!",
        location: "Khatgal, Mongolia",
        rating: 5,
        language: "en",
        status: "approved",
        dateStr: "2025-11-20",
        createdAt: new Date()
      },
      {
        name: "S. Anujin",
        trip: "Paris Tour",
        text: "I fulfilled my dream trip with Mongolia Trails Agency. Dinner on the Eiffel Tower was the best moment.",
        location: "Paris, France",
        rating: 5,
        language: "en",
        status: "approved",
        dateStr: "2025-11-15",
        createdAt: new Date()
      },
      // Korean Reviews
      {
        name: "B. 바트-에르데네",
        trip: "후브스굴 여행",
        text: "정말 잘 조직된 여행이었습니다. 가이드가 매우 지식이 풍부했고 음식도 맛있었어요. 내년에 꼭 다시 갈 거예요!",
        location: "카트갈, 몽골",
        rating: 5,
        language: "ko",
        status: "approved",
        dateStr: "2025-11-20",
        createdAt: new Date()
      },
      {
        name: "S. 아누진",
        trip: "파리 투어",
        text: "Mongolia Trails Agency와 함께 꿈의 여행을 실현했습니다. 에펠탑에서의 저녁 식사가 가장 멋진 순간이었어요.",
        location: "파리, 프랑스",
        rating: 5,
        language: "ko",
        status: "approved",
        dateStr: "2025-11-15",
        createdAt: new Date()
      }
    ];

    // 2. Clear existing comments (Optional: remove this line if you want to keep adding)
    await db.collection("comments").deleteMany({});

    // 3. Insert new data
    const result = await db.collection("comments").insertMany(seedData);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully!", 
      count: result.insertedCount 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}