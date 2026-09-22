"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Category, CategoryFormData } from "@/types/category";
import { Product } from "@/types/product";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firebase/categories";
import { getProducts } from "@/lib/firebase/products";
import { uploadImage, deleteImage } from "@/lib/firebase/storage";
import { compressImageToMax250KB } from "@/lib/image-compressor";
import { slugify } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  AlertTriangle,
  Upload,
  Check,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      showToast("Error loading categories data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getProductCountForCategory = (catId: string, catName: string) => {
    return products.filter(
      (p) => p.categoryId === catId || p.categoryName.toLowerCase() === catName.toLowerCase()
    ).length;
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
    });
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : slugify(val),
    }));
  };

  // Image Upload Handler with Automatic Compression to <= 250 KB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedFile = await compressImageToMax250KB(file, 250 * 1024);
      const url = await uploadImage(compressedFile, "categories");
      setFormData((prev) => ({ ...prev, image: url }));
      showToast("Category image uploaded (Compressed ≤ 250 KB)", "success");
    } catch (error) {
      showToast("Failed to upload category image", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Delete Category Cover Image Option
  const handleRemoveImage = async () => {
    if (formData.image) {
      try {
        await deleteImage(formData.image);
      } catch (err) {
        console.warn("Could not delete image from storage:", err);
      }
    }
    setFormData((prev) => ({ ...prev, image: "" }));
    showToast("Category photo removed", "success");
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showToast("Category updated successfully", "success");
      } else {
        await addCategory(formData);
        showToast("Category created successfully", "success");
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      showToast("Error saving category", "error");
    }
  };

  const handleInitiateDelete = (cat: Category) => {
    const count = getProductCountForCategory(cat.id, cat.name);
    if (count > 0) {
      setDeleteWarning(
        `Warning: There are ${count} product(s) assigned to "${cat.name}". Deleting this category will leave these products uncategorized.`
      );
    } else {
      setDeleteWarning(null);
    }
    setDeleteConfirmId(cat.id);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      showToast("Category deleted successfully", "success");
      setDeleteConfirmId(null);
      setDeleteWarning(null);
      loadData();
    } catch (error) {
      showToast("Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-100"
              : "bg-rose-900 text-rose-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cream-300">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso-900">
            Categories Management
          </h1>
          <p className="text-xs text-taupe-600 font-light">
            Add and manage scent collection categories. Photos are compressed to ≤ 250 KB with photo delete options.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold px-5 py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow"
        >
          <Plus className="w-4 h-4 text-champagne-400" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            No categories found. Click &quot;Add New Category&quot; to create your first scent collection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-espresso-900 uppercase tracking-wider font-semibold border-b border-cream-300">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Associated Products</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {categories.map((cat) => {
                  const productCount = getProductCountForCategory(cat.id, cat.name);
                  const thumbnail = cat.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200";
                  return (
                    <tr key={cat.id} className="hover:bg-cream-50/80 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-200 border border-cream-300">
                          <Image src={thumbnail} alt={cat.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-serif font-semibold text-espresso-900 text-sm">
                        {cat.name}
                        {cat.description && (
                          <span className="block text-[11px] font-sans font-normal text-taupe-600 line-clamp-1 font-light">
                            {cat.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-taupe-600 font-mono text-[11px]">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-6 font-semibold text-espresso-900">
                        <span className="bg-cream-200 text-espresso-900 px-3 py-1 rounded-full border border-cream-300">
                          {productCount} Products
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 text-espresso-900 hover:text-champagne-600 hover:bg-cream-200 rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateDelete(cat)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl border border-cream-300 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-espresso-900">
              Delete Scent Category?
            </h3>

            {deleteWarning ? (
              <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed font-medium">
                {deleteWarning}
              </p>
            ) : (
              <p className="text-xs text-taupe-600 font-light">
                Are you sure you want to delete this category?
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteWarning(null);
                }}
                className="w-1/2 py-2.5 bg-cream-100 hover:bg-cream-200 text-espresso-900 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirmId)}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-lg w-full my-auto max-h-[88vh] overflow-y-auto shadow-2xl border border-cream-300 space-y-6 scrollbar-thin">
            
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h2 className="font-serif text-2xl font-bold text-espresso-900">
                {editingCategory ? "Edit Scent Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-taupe-500 hover:text-espresso-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Floral Collection"
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: slugify(e.target.value) }))}
                  placeholder="floral-collection"
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short explanation of fragrance notes in this collection..."
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                ></textarea>
              </div>

              {/* Category Cover Image with Display & Delete Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
                    Category Cover Image
                  </label>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Auto-Compress: ≤ 250 KB
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold px-5 py-2.5 rounded-full shadow transition w-fit">
                    <Upload className="w-4 h-4 text-champagne-400" />
                    <span>{uploadingImage ? "Compressing & Uploading..." : "Upload Category Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Preview Display with Delete Option */}
                  {formData.image ? (
                    <div className="relative w-32 aspect-square rounded-2xl overflow-hidden border border-cream-300 bg-white group shadow-sm">
                      <Image src={formData.image} alt="Category cover preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-espresso-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition transform hover:scale-110 flex items-center gap-1 text-[10px] font-semibold uppercase px-3"
                          title="Delete Category Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-taupe-500 font-light italic">
                      No cover image uploaded yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cream-100 text-espresso-900 hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-espresso-900 text-cream-100 hover:bg-espresso-800 shadow"
                >
                  Save Category
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
