import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo"; // Make sure this path is correct

// --- Security Helper ---
// Checks if the user is authenticated and has the 'admin' role.
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    // If check fails, throw an error that will be caught.
    throw new Error("Unauthorized");
  }
}

// --- GET: Fetch Global Settings ---
export async function GET() {
  try {
    // 1. Run security check
    await checkAdmin();
    
    // 2. Connect to Database
    const client = await clientPromise;
    const db = client.db("travel_db"); // Ensure DB name is correct

    // 3. Fetch the ONE settings document. We use a fixed ID for it.
    const settings = await db.collection("settings").findOne({ _id: "global_settings" as any });

    // 4. Define default settings in case the document doesn't exist yet
    const defaultSettings = {
      siteName: { mn: "Аялал Жуулчлал", en: "Travel Co", ko: "여행사" },
      supportEmail: "support@travel.com",
      maintenanceMode: false,
      allowRegistration: true,
      announcementBar: { mn: "", en: "", ko: "" },
    };

    // 5. Return existing settings, or the defaults if none are found
    return NextResponse.json({ 
      success: true, 
      data: settings || defaultSettings 
    });

  } catch (error: any) {
    // If checkAdmin() fails, this will catch it and return a 403 Forbidden status.
    return NextResponse.json(
        { success: false, error: error.message }, 
        { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

// --- POST: Save/Update Global Settings ---
export async function POST(req: Request) {
  try {
    // 1. Run security check
    await checkAdmin();
    
    // 2. Get the new settings data from the request body
    const newSettings = await req.json();

    // 3. Connect to Database
    const client = await clientPromise;
    const db = client.db("travel_db");

    // 4. Update the document with 'upsert: true'
    // This command will update the document if it exists, or create it if it doesn't.
    await db.collection("settings").updateOne(
      { _id: "global_settings" as any }, // The document to find
      { $set: newSettings },              // The new data to apply
      { upsert: true }                    // The magic option
    );

    // 5. Return a success response
    return NextResponse.json({ success: true, message: "Settings saved successfully." });

  } catch (error: any) {
    return NextResponse.json(
        { success: false, error: error.message }, 
        { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}