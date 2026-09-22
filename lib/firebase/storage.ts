import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, isFirebaseConfigured } from "./config";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firebase Storage request timeout"));
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

export async function uploadImage(file: File, path: string): Promise<string> {
  const getBase64Fallback = (): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  if (!isFirebaseConfigured || !storage) {
    return getBase64Fallback();
  }

  try {
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storageRef = ref(storage, `${path}/${filename}`);
    const snapshot = await withTimeout(uploadBytes(storageRef, file), 2000);
    const downloadUrl = await withTimeout(getDownloadURL(snapshot.ref), 2000);
    return downloadUrl;
  } catch (error) {
    console.warn("Firebase Storage upload fallback triggered:", error);
    return getBase64Fallback();
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!isFirebaseConfigured || imageUrl.startsWith("data:") || imageUrl.includes("unsplash")) {
    return;
  }

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn("Could not delete image from Firebase storage:", error);
  }
}
