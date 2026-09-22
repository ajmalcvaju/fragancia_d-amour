export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  fragrance: string;
  size: string;
  availability: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;
