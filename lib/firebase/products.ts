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
import { Product, ProductFormData } from "@/types/product";
import { INITIAL_PRODUCTS } from "@/lib/data/mock-data";

const PRODUCTS_COLLECTION = "products";
const PRODUCTS_STORAGE_KEY = "fragancia_local_products";

let localProducts: Product[] = [...INITIAL_PRODUCTS];

function getLocalProductsStore(): Product[] {
  if (typeof window === "undefined") return [...localProducts];
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local products storage:", err);
  }
  return [...localProducts];
}

function saveLocalProductsStore(products: Product[]) {
  localProducts = products;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.warn("Could not save to local products storage:", err);
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

export async function getProducts(): Promise<Product[]> {
  const localList = getLocalProductsStore();

  if (!isFirebaseConfigured || !db) {
    return [...localList].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(colRef), 10000);

    if (!querySnapshot.empty) {
      const remoteProducts: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteProducts.push({
          id: docSnap.id,
          name: data.name || "",
          slug: data.slug || "",
          price: data.price || 0,
          compareAtPrice: data.compareAtPrice ?? null,
          categoryName: data.categoryName || "",
          categoryId: data.categoryId || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          fragrance: data.fragrance || "",
          size: data.size || "",
          availability: data.availability ?? true,
          featured: data.featured ?? false,
          images: data.images || [],
          displayOrder: data.displayOrder || 1,
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

      // Merge Firestore products with initial catalog items so no product page ever 404s
      const remoteIds = new Set(remoteProducts.map((p) => p.id));
      const remoteSlugs = new Set(remoteProducts.map((p) => (p.slug || "").toLowerCase()));

      const missingLocal = localList.filter(
        (lp) => !remoteIds.has(lp.id) && !remoteSlugs.has((lp.slug || "").toLowerCase())
      );

      const merged = [...remoteProducts, ...missingLocal].sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      );

      saveLocalProductsStore(merged);
      return merged;
    }
  } catch (error) {
    console.warn("Firestore error reading products, falling back to local dataset:", error);
  }

  return [...localList].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter((p) => p.featured && p.availability);
}

export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
  const allProducts = await getProducts();
  if (!slugOrId) return null;

  let target = "";
  try {
    target = decodeURIComponent(slugOrId).toLowerCase().trim();
  } catch (e) {
    target = slugOrId.toLowerCase().trim();
  }
  const targetSlug = target.replace(/[^a-z0-9]+/g, "-");

  return (
    allProducts.find((p) => {
      if (!p) return false;
      const pId = (p.id || "").toLowerCase().trim();
      const pSlug = (p.slug || "").toLowerCase().trim();
      const pName = (p.name || "").toLowerCase().trim();
      const pNameSlug = pName.replace(/[^a-z0-9]+/g, "-");

      return (
        pSlug === target ||
        pSlug === targetSlug ||
        pId === target ||
        pNameSlug === targetSlug ||
        pName === target ||
        (pSlug && pSlug.length > 2 && pSlug.includes(targetSlug)) ||
        (targetSlug && targetSlug.length > 2 && targetSlug.includes(pSlug))
      );
    }) || null
  );
}

export async function getProductsByCategory(categorySlugOrId: string): Promise<Product[]> {
  const allProducts = await getProducts();
  if (!categorySlugOrId) return allProducts;

  const target = categorySlugOrId.toLowerCase().trim();
  const targetSlug = target.replace(/[^a-z0-9]+/g, "-");

  return allProducts.filter((p) => {
    if (!p) return false;
    const catId = (p.categoryId || "").toLowerCase().trim();
    const catName = (p.categoryName || "").toLowerCase().trim();
    const catSlug = catName.replace(/[^a-z0-9]+/g, "-");

    return (
      catId === target ||
      catId === targetSlug ||
      catSlug === targetSlug ||
      catName === target ||
      catSlug.includes(targetSlug) ||
      targetSlug.includes(catSlug)
    );
  });
}

export async function addProduct(data: ProductFormData): Promise<string> {
  const currentList = getLocalProductsStore();
  const tempId = `prod-${Date.now()}`;
  const newProduct: Product = {
    id: tempId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...currentList, newProduct];
  saveLocalProductsStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return tempId;
  }

  try {
    const docRef = await withTimeout(
      addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      2500
    );

    const syncedList = updatedList.map((p) => (p.id === tempId ? { ...p, id: docRef.id } : p));
    saveLocalProductsStore(syncedList);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore addProduct error/timeout, saved locally:", err);
    return tempId;
  }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const currentList = getLocalProductsStore();
  const updatedList = currentList.map((p) =>
    p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
  );
  saveLocalProductsStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await withTimeout(
      updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }),
      2500
    );
  } catch (err) {
    console.warn("Firestore updateProduct error/timeout, updated locally:", err);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const currentList = getLocalProductsStore();
  const updatedList = currentList.filter((p) => p.id !== id);
  saveLocalProductsStore(updatedList);

  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (err) {
    console.warn("Firestore deleteProduct error/timeout, deleted locally:", err);
  }
}
