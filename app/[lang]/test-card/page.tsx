import { Locale } from "@/i18n-config";
import TourCard from "@/app/components/trips/TourCard";

export default async function TestCardPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Tour Card Demo</h1>
          <p className="text-slate-500">Минималист, Clean дизайнтай аяллын картын жишээ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {/* Example 1: Featured Tour */}
          <TourCard
            badge="Featured"
            image="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800"
            title="Алтай Таван Богд аялал"
            location="Баян-Өлгий аймаг"
            duration="7 хоног"
            difficulty="Хүнд"
            distance="450 км"
            price="₮1,200,000"
            link="#"
            lang={lang}
          />

          {/* Example 2: New Tour */}
          <TourCard
            badge="New"
            image="https://images.unsplash.com/photo-1527584052956-b311276b3a5d?auto=format&fit=crop&q=80&w=800"
            title="Хөвсгөл нуурын морин аялал"
            location="Хөвсгөл аймаг"
            duration="5 хоног"
            difficulty="Дунд"
            distance="120 км"
            price="₮850,000"
            link="#"
            lang={lang}
          />

          {/* Example 3: No Badge */}
          <TourCard
            image="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800"
            title="Говийн адал явдал"
            location="Өмнөговь аймаг"
            duration="4 хоног"
            difficulty="Хялбар"
            distance="300 км"
            price="₮950,000"
            link="#"
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
