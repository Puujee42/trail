
import { getSaleTrips } from "@/lib/mongo/trips";
import SaleList from "./SaleList";

export default async function SalePage() {
  // Fetch only trips that have discounts
  const saleTrips = await getSaleTrips();

  return <SaleList trips={saleTrips} />;
}