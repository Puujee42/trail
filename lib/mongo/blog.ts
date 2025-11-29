import clientPromise from "./index";
import { ObjectId } from "mongodb";

const DB_NAME = "travel_db";
const COLLECTION = "posts";

export interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  content?: string; // Added for the actual full page content
  category: string; // "guide", "tips", "food", "stories"
  author: string;
  authorImg: string;
  date: string;     // Or Date object if you want to sort dynamically
  readTime: string;
  image: string;
  featured: boolean;
}

// Helper to convert MongoDB _id to string
function mapPost(doc: any): BlogPost {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Data Access Methods
// ─────────────────────────────────────────────────────────────

// ➤ GET ALL POSTS (With optional category filter)
export async function getPosts(category?: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const query = (category && category !== 'all') ? { category } : {};
  
  const posts = await collection
    .find(query)
    .sort({ date: -1 }) // Newest first (works if date is ISO string "2025.11.20")
    .toArray();

  return posts.map(mapPost);
}

// ➤ GET FEATURED POST (For the Hero section)
export async function getFeaturedPost() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const post = await collection.findOne({ featured: true });
  return post ? mapPost(post) : null;
}

// ➤ GET SINGLE POST
export async function getPostById(id: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  try {
    const post = await collection.findOne({ _id: new ObjectId(id) });
    return post ? mapPost(post) : null;
  } catch {
    return null;
  }
}