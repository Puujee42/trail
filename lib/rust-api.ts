import { Trip } from "@/lib/mongo/trips";

const RUST_SERVICE_URL = "http://127.0.0.1:8080";

export async function fetchTripsFromRust(params?: { type?: string; region?: string; limit?: number; id?: string }): Promise<Trip[] | null> {
  try {
    const url = new URL(`${RUST_SERVICE_URL}/trips`);
    if (params) {
      if (params.type) url.searchParams.append("type", params.type);
      if (params.region) url.searchParams.append("region", params.region);
      if (params.limit) url.searchParams.append("limit", params.limit.toString());
      if (params.id) url.searchParams.append("id", params.id);
    }

    const res = await fetch(url.toString(), { 
        cache: 'no-store',
        next: { revalidate: 0 } // Always fresh for demo
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // Map _id (from mongo ObjectId object/string) to string if needed
    // But in Rust models we serialized ObjectId as string/object. 
    // Usually Mongo crate serializes ObjectId as {"$oid": "..."} extended JSON or just string depending on features.
    // In our model we used `serde` with `oid`. If it returns object, we need to map.
    // However, let's assume standard JSON response for now.
    return data.map((item: any) => ({
        ...item,
        _id: item._id?.$oid || item.id || item._id // Handle potential variations in BSON serialization
    }));

  } catch (error) {
    console.warn("Rust service unreachable, skipping...");
    return null;
  }
}
