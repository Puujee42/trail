import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer"; // 1. Import Nodemailer

export async function POST(req: Request) {
  try {
    // 1. Security: Get the logged-in user's ID
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the incoming data
    const body = await req.json();
    // Added 'language' to the destructuring so we know which language to email in
    const { tripId, date, travelers, guestName, guestEmail, guestPhone, language } = body;

    if (!tripId || !date || !travelers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 3. Fetch the Trip details
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // 4. Calculate Price Server-Side
    const basePrice = trip.price.mn || 0; 
    const totalPrice = basePrice * Number(travelers);

    // 5. Construct the Booking Object
    const newBooking = {
      userId,
      tripId,
      tripTitle: trip.title, 
      tripImage: trip.image,
      date,
      travelers: Number(travelers),
      totalPrice,
      currency: "MNT",
      guestDetails: {
        name: guestName,
        email: guestEmail,
        phone: guestPhone
      },
      status: "pending",
      createdAt: new Date(),
    };

    // 6. Insert into MongoDB
    const result = await db.collection("bookings").insertOne(newBooking);

    // ─────────────────────────────────────────────────────────────
    // 7. SEND EMAIL LOGIC (New Addition)
    // ─────────────────────────────────────────────────────────────
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your SMTP provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Helper to get the trip title string in the correct language
      // Assuming trip.title is { mn: "...", en: "...", ko: "..." }
      const tripNameStr = trip.title[language] || trip.title['mn'] || "Trip";

      // Email Content Helpers
      const getSubject = (lang: string) => {
        if (lang === 'ko') return `예약 확인: ${tripNameStr}`;
        if (lang === 'en') return `Booking Confirmation: ${tripNameStr}`;
        return `Захиалга баталгаажлаа: ${tripNameStr}`;
      };

      const getBody = (lang: string) => {
        if (lang === 'ko') return `안녕하세요 ${guestName}님,\n\n${tripNameStr} 여행 예약이 접수되었습니다.\n날짜: ${date}\n인원: ${travelers}명\n\n곧 담당자가 연락드리겠습니다.`;
        if (lang === 'en') return `Hello ${guestName},\n\nYour appointment for ${tripNameStr} is set.\nDate: ${date}\nGuests: ${travelers}\n\nOur agent will contact you shortly.`;
        return `Сайн байна уу ${guestName},\n\nТаны ${tripNameStr} аяллын цаг баталгаажлаа.\nОгноо: ${date}\nХүний тоо: ${travelers}\n\nМанай менежер тантай удахгүй холбогдох болно.`;
      };

      // Send to Guest
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: guestEmail, 
        subject: getSubject(language),
        text: getBody(language),
      });

      // Send to Admin (You)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: `NEW BOOKING: ${tripNameStr}`,
        text: `New booking received!\n\nUser: ${guestName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}\nTrip: ${tripNameStr}\nDate: ${date}\nTravelers: ${travelers}\nTotal Price: ${totalPrice} MNT`,
      });

    } catch (emailError) {
      // We log the error but do NOT stop the request. 
      // The booking is already saved in DB, which is the most important part.
      console.error("Email failed to send:", emailError);
    }
    // ─────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true, bookingId: result.insertedId });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}