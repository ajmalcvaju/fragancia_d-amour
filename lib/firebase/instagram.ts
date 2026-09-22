import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { InstagramPost, InstagramPostFormData } from "@/types/instagram";

const INSTAGRAM_COLLECTION = "instagram_posts";
const INSTAGRAM_STORAGE_KEY = "fragancia_local_instagram_posts";

export const INITIAL_INSTAGRAM_POSTS: InstagramPost[] = [];

let localPosts: InstagramPost[] = [...INITIAL_INSTAGRAM_POSTS];

function getLocalPostsStore(): InstagramPost[] {
  if (typeof window === "undefined") return [...localPosts];
  try {
    const stored = localStorage.getItem(INSTAGRAM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local instagram storage:", err);
  }
  return [...localPosts];
}

function saveLocalPostsStore(posts: InstagramPost[]) {
  localPosts = posts;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INSTAGRAM_STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.warn("Could not save local instagram storage:", err);
    }
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore operation timeout"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const localList = getLocalPostsStore();

  if (!isFirebaseConfigured || !db) {
    return [...localList].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  }

  try {
    const colRef = collection(db, INSTAGRAM_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(colRef), 10000);

    if (!querySnapshot.empty) {
      const remotePosts: InstagramPost[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remotePosts.push({
          id: docSnap.id,
          image: data.image || "",
          postUrl: data.postUrl || "",
          caption: data.caption || "",
          likes: data.likes || "142",
          displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 1,
          createdAt:
            typeof data.createdAt?.toDate === "function"
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
          updatedAt:
            typeof data.updatedAt?.toDate === "function"
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt || new Date().toISOString(),
        });
      });

      // Combine remote posts with any unsynced local posts (e.g. temporary IDs starting with ig-)
      const remoteIds = new Set(remotePosts.map((p) => p.id));
      const pendingLocalPosts = localList.filter((lp) => lp.id.startsWith("ig-") && !remoteIds.has(lp.id));

      const mergedPosts = [...remotePosts, ...pendingLocalPosts].sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      );

      saveLocalPostsStore(mergedPosts);
      return mergedPosts;
    }
  } catch (error) {
    console.warn("Firestore reading instagram posts fallback to local storage:", error);
  }

  return [...localList].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
}

export async function addInstagramPost(data: InstagramPostFormData): Promise<string> {
  const currentList = getLocalPostsStore();
  const tempId = `ig-${Date.now()}`;
  const newPost: InstagramPost = {
    id: tempId,
    image: data.image || "",
    postUrl: data.postUrl || "",
    caption: data.caption || "",
    likes: data.likes || "142",
    displayOrder: Number(data.displayOrder) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [newPost, ...currentList];
  saveLocalPostsStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return tempId;
  }

  try {
    const docRef = await withTimeout(
      addDoc(collection(db, INSTAGRAM_COLLECTION), {
        image: data.image || "",
        postUrl: data.postUrl || "",
        caption: data.caption || "",
        likes: data.likes || "142",
        displayOrder: Number(data.displayOrder) || 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      10000
    );

    const syncedList = updatedList.map((p) => (p.id === tempId ? { ...p, id: docRef.id } : p));
    saveLocalPostsStore(syncedList);
    return docRef.id;
  } catch (err: any) {
    console.error("Firestore add instagram post error:", err);
    return tempId;
  }
}

export async function updateInstagramPost(id: string, data: Partial<InstagramPostFormData>): Promise<void> {
  const currentList = getLocalPostsStore();
  const updatedList = currentList.map((p) =>
    p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
  );
  saveLocalPostsStore(updatedList);

  if (!isFirebaseConfigured || !db || id.startsWith("ig-")) {
    return;
  }

  const updateData: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };
  if (data.image !== undefined) updateData.image = data.image;
  if (data.postUrl !== undefined) updateData.postUrl = data.postUrl;
  if (data.caption !== undefined) updateData.caption = data.caption;
  if (data.likes !== undefined) updateData.likes = data.likes;
  if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);

  try {
    const docRef = doc(db, INSTAGRAM_COLLECTION, id);
    await withTimeout(updateDoc(docRef, updateData), 10000);
  } catch (err: any) {
    console.error("Firestore update instagram post error:", err);
  }
}

export async function deleteInstagramPost(id: string): Promise<void> {
  const currentList = getLocalPostsStore();
  const updatedList = currentList.filter((p) => p.id !== id);
  saveLocalPostsStore(updatedList);

  if (!isFirebaseConfigured || !db || id.startsWith("ig-")) {
    return;
  }

  try {
    const docRef = doc(db, INSTAGRAM_COLLECTION, id);
    await withTimeout(deleteDoc(docRef), 10000);
  } catch (err: any) {
    console.error("Firestore delete instagram post error:", err);
  }
}
