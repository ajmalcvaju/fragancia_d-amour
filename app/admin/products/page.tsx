"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, ProductFormData } from "@/types/product";
import { Category } from "@/types/category";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firebase/products";
import { getCategories } from "@/lib/firebase/categories";
import { uploadImage, deleteImage } from "@/lib/firebase/storage";
import { compressImageToMax250KB } from "@/lib/image-compressor";
import { slugify, formatPrice } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  Upload,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Toast Feedback State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    categoryId: "",
    categoryName: "",
    shortDescription: "",
    description: "",
    price: 799,
    compareAtPrice: null,
    images: [],
    fragrance: "",
    size: "200g / 100% Soy Wax",
    availability: true,
    featured: false,
    displayOrder: 1,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      showToast("Error loading products data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const defaultCat = categories.length > 0 ? categories[0] : null;
    setFormData({
      name: "",
      slug: "",
      categoryId: defaultCat ? defaultCat.id : "",
      categoryName: defaultCat ? defaultCat.name : "",
      shortDescription: "",
      description: "",
      price: 799,
      compareAtPrice: null,
      images: [],
      fragrance: "",
      size: "200g / 100% Soy Wax",
      availability: true,
      featured: false,
      displayOrder: products.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      images: product.images || [],
      fragrance: product.fragrance || "",
      size: product.size || "200g / 100% Soy Wax",
      availability: product.availability,
      featured: product.featured,
      displayOrder: product.displayOrder || 1,
    });
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingProduct ? prev.slug : slugify(val),
    }));
  };

  const handleCategoryChange = (catId: string) => {
    const catObj = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      categoryName: catObj ? catObj.name : "",
    }));
  };

  // Image Upload Handler with Automatic Compression to <= 250 KB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const compressedFile = await compressImageToMax250KB(file, 250 * 1024);
        return uploadImage(compressedFile, "products");
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      showToast("Images uploaded successfully (Compressed ≤ 250 KB)", "success");
    } catch (error) {
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be re-uploaded if desired
      e.target.value = "";
    }
  };

  // Delete Uploaded Image Option
  const handleRemoveImage = async (index: number) => {
    const imageUrl = formData.images[index];
    if (imageUrl) {
      try {
        await deleteImage(imageUrl);
      } catch (err) {
        console.warn("Could not delete file from storage:", err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    showToast("Photo removed", "success");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast("Product updated successfully", "success");
      } else {
        await addProduct(formData);
        showToast("Product created successfully", "success");
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      showToast("Error saving product", "error");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      showToast("Product deleted successfully", "success");
      setDeleteConfirmId(null);
      loadData();
    } catch (error) {
      showToast("Failed to delete product", "error");
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
            Products Management
          </h1>
          <p className="text-xs text-taupe-600 font-light">
            Add, edit, and manage product photos. Uploaded images are compressed to ≤ 250 KB with individual delete options.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold px-5 py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow"
        >
          <Plus className="w-4 h-4 text-champagne-400" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            No products found. Click &quot;Add New Product&quot; to create your first candle listing.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-espresso-900 uppercase tracking-wider font-semibold border-b border-cream-300">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {products.map((product) => {
                  const thumbnail = product.images[0] || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200";
                  return (
                    <tr key={product.id} className="hover:bg-cream-50/80 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-200 border border-cream-300">
                          <Image
                            src={thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-serif font-semibold text-espresso-900 text-sm">
                        {product.name}
                        {product.fragrance && (
                          <span className="block text-[11px] font-sans font-normal text-taupe-600 italic">
                            {product.fragrance}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-taupe-700">
                        {product.categoryName}
                      </td>
                      <td className="py-3 px-6 font-semibold text-espresso-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-3 px-6">
                        {product.availability ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                            Available
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-semibold">
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {product.featured ? (
                          <span className="bg-champagne-400/20 text-champagne-600 px-2.5 py-1 rounded-full font-semibold border border-champagne-500/30">
                            Featured
                          </span>
                        ) : (
                          <span className="text-taupe-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-espresso-900 hover:text-champagne-600 hover:bg-cream-200 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Product"
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
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl border border-cream-300 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-espresso-900">
              Delete Candle Listing?
            </h3>
            <p className="text-xs text-taupe-600 font-light">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 bg-cream-100 hover:bg-cream-200 text-espresso-900 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full my-auto max-h-[88vh] overflow-y-auto shadow-2xl border border-cream-300 space-y-6 scrollbar-thin">
            
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h2 className="font-serif text-2xl font-bold text-espresso-900">
                {editingProduct ? "Edit Candle Product" : "Add New Candle Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-taupe-500 hover:text-espresso-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Velvet Rose Blossom"
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
                    placeholder="velvet-rose-blossom"
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.compareAtPrice || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        compareAtPrice: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="e.g. 1099"
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Fragrance Notes
                  </label>
                  <input
                    type="text"
                    value={formData.fragrance}
                    onChange={(e) => setFormData((p) => ({ ...p, fragrance: e.target.value }))}
                    placeholder="e.g. Damask Rose & Soft Musk"
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Size / Net Weight
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData((p) => ({ ...p, size: e.target.value }))}
                    placeholder="e.g. 200g / 100% Soy Wax"
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="Brief 1-line fragrance highlight..."
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Full Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed fragrance notes, mood description, and burning experience..."
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                ></textarea>
              </div>

              {/* Product Images Manager with Display & Delete Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
                    Product Photos ({formData.images.length})
                  </label>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Auto-Compress: ≤ 250 KB
                  </span>
                </div>
                
                {/* Upload Button */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold px-5 py-2.5 rounded-full shadow transition">
                    <Upload className="w-4 h-4 text-champagne-400" />
                    <span>{uploadingImage ? "Compressing & Uploading..." : "Upload New Photo(s)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Image Cards Grid with Visible Delete Button */}
                {formData.images.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Uploaded Photos ({formData.images.length}) — Compressed ≤ 250 KB</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-cream-100/70 rounded-2xl border border-cream-300">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-cream-300 bg-white group shadow-sm">
                          <Image
                            src={imgUrl}
                            alt={`Uploaded photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {/* Always-visible Quick Delete Icon Button (Top Right) */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md z-10 transition transform hover:scale-110"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Desktop Hover Overlay with Explicit Text */}
                          <div className="absolute inset-0 bg-espresso-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-1.5 text-[10px] font-semibold uppercase px-3"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Photo</span>
                            </button>
                            <span className="text-[9px] text-cream-200">Photo #{idx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-taupe-500 font-light italic">
                    No photos uploaded yet. Uploaded images will appear here with instant preview and delete controls.
                  </p>
                )}
              </div>

              {/* Status Toggles & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-cream-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-espresso-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={(e) => setFormData((p) => ({ ...p, availability: e.target.checked }))}
                    className="w-4 h-4 rounded text-champagne-500 focus:ring-champagne-500"
                  />
                  <span>Available in Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-espresso-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 rounded text-champagne-500 focus:ring-champagne-500"
                  />
                  <span>Featured Product</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 bg-cream-100/70 border border-cream-300 rounded-lg text-xs text-espresso-900"
                  />
                </div>
              </div>

              {/* Save & Cancel */}
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
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
