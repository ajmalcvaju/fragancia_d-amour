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
import { Category, CategoryFormData } from "@/types/category";
import { INITIAL_CATEGORIES } from "@/lib/data/mock-data";

const CATEGORIES_COLLECTION = "categories";
const CATEGORIES_STORAGE_KEY = "fragancia_local_categories";

let localCategories: Category[] = [...INITIAL_CATEGORIES];

function getLocalCategoriesStore(): Category[] {
  if (typeof window === "undefined") return [...localCategories];
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local categories storage:", err);
  }
  return [...localCategories];
}

function saveLocalCategoriesStore(categories: Category[]) {
  localCategories = categories;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (err) {
      console.warn("Could not save to local categories storage:", err);
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

export async function getCategories(): Promise<Category[]> {
  const localList = getLocalCategoriesStore();

  if (!isFirebaseConfigured || !db) {
    return localList;
  }

  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(colRef), 10000);

    if (!querySnapshot.empty) {
      const remoteCategories: Category[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteCategories.push({
          id: docSnap.id,
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          image: data.image || "",
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

      const remoteIds = new Set(remoteCategories.map((c) => c.id));
      const remoteSlugs = new Set(remoteCategories.map((c) => (c.slug || "").toLowerCase()));

      const missingLocal = localList.filter(
        (lc) => !remoteIds.has(lc.id) && !remoteSlugs.has((lc.slug || "").toLowerCase())
      );

      const merged = [...remoteCategories, ...missingLocal];
      saveLocalCategoriesStore(merged);
      return merged;
    }
  } catch (error) {
    console.warn("Firestore error reading categories, falling back to local dataset:", error);
  }

  return localList;
}

export async function getCategoryBySlug(slugOrId: string): Promise<Category | null> {
  const categories = await getCategories();
  if (!slugOrId) return null;
  const target = slugOrId.toLowerCase().trim();
  const targetSlug = target.replace(/[^a-z0-9]+/g, "-");

  return (
    categories.find((c) => {
      const cId = c.id.toLowerCase().trim();
      const cSlug = (c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).toLowerCase().trim();
      const cName = c.name.toLowerCase().trim();
      return (
        cSlug === targetSlug ||
        cId === target ||
        cSlug === target ||
        cName === target ||
        cSlug.includes(targetSlug) ||
        targetSlug.includes(cSlug)
      );
    }) || null
  );
}

export async function addCategory(data: CategoryFormData): Promise<string> {
  const currentList = getLocalCategoriesStore();
  const tempId = `cat-${Date.now()}`;
  const newCat: Category = {
    id: tempId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...currentList, newCat];
  saveLocalCategoriesStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return tempId;
  }

  try {
    const docRef = await withTimeout(
      addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      2500
    );

    const syncedList = updatedList.map((c) => (c.id === tempId ? { ...c, id: docRef.id } : c));
    saveLocalCategoriesStore(syncedList);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore addCategory error/timeout, saved locally:", err);
    return tempId;
  }
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<void> {
  const currentList = getLocalCategoriesStore();
  const updatedList = currentList.map((c) =>
    c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
  );
  saveLocalCategoriesStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await withTimeout(
      updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }),
      2500
    );
  } catch (err) {
    console.warn("Firestore updateCategory error/timeout, updated locally:", err);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const currentList = getLocalCategoriesStore();
  const updatedList = currentList.filter((c) => c.id !== id);
  saveLocalCategoriesStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (err) {
    console.warn("Firestore deleteCategory error/timeout, deleted locally:", err);
  }
}
