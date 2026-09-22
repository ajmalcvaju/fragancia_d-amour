export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type CategoryFormData = Omit<Category, "id" | "createdAt" | "updatedAt">;
