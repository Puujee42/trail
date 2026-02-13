import { getAllTrips, Trip } from "@/lib/mongo/trips";
import { currentUser } from "@clerk/nextjs/server";
import DestinationTourCard from "@/app/components/trips/DestinationTourCard";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export const dynamic = "force-dynamic";

export default async function WishlistPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const user = await currentUser();
  const wishlistIds: string[] = Array.isArray(user?.publicMetadata?.wishlist) ? (user!.publicMetadata!.wishlist as string[]) : [];

  const trips = await getAllTrips();
  const wishedTrips: Trip[] = trips.filter((t) => wishlistIds.includes(t._id));

  return (
    <>
      <Navbar dictionary={dictionary.nav} />
      <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-slate-900">Миний хүслийн жагсаалт</h1>
            <span className="text-sm text-slate-600">Нийт: {wishedTrips.length}</span>
          </div>
          {wishedTrips.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
              <p className="text-slate-600">Одоогоор хадгалсан аялал алга байна.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishedTrips.map((trip) => (
                <DestinationTourCard key={trip._id} trip={trip} lang={lang === 'de' ? 'en' : lang} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer dictionary={dictionary} navDictionary={dictionary.nav} />
    </>
  );
}
