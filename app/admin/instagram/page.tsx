"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { InstagramPost, InstagramPostFormData } from "@/types/instagram";
import {
  getInstagramPosts,
  addInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
} from "@/lib/firebase/instagram";
import { uploadImage, deleteImage } from "@/lib/firebase/storage";
import { compressImageToMax250KB } from "@/lib/image-compressor";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  AlertTriangle,
  Upload,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<InstagramPostFormData>({
    image: "",
    postUrl: "",
    caption: "",
    likes: "142",
    displayOrder: 1,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInstagramPosts();
      setPosts(data);
    } catch (err) {
      showToast("Error loading Instagram posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setFormData({
      image: "",
      postUrl: "",
      caption: "",
      likes: "142",
      displayOrder: posts.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (post: InstagramPost) => {
    setEditingPost(post);
    setFormData({
      image: post.image,
      postUrl: post.postUrl || "",
      caption: post.caption || "",
      likes: post.likes || "142",
      displayOrder: post.displayOrder || 1,
    });
    setModalOpen(true);
  };

  // Image Upload Handler with Automatic Compression <= 250 KB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedFile = await compressImageToMax250KB(file, 250 * 1024);
      const url = await uploadImage(compressedFile, "instagram");
      setFormData((prev) => ({ ...prev, image: url }));
      showToast("Post photo uploaded (Compressed ≤ 250 KB)", "success");
    } catch (error) {
      showToast("Failed to upload post image", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image) {
      try {
        await deleteImage(formData.image);
      } catch (err) {
        console.warn("Could not delete image from storage:", err);
      }
    }
    setFormData((prev) => ({ ...prev, image: "" }));
    showToast("Photo removed", "success");
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image && !formData.postUrl) {
      showToast("Post image or Instagram link is required", "error");
      return;
    }

    try {
      if (editingPost) {
        await updateInstagramPost(editingPost.id, formData);
        showToast("Instagram post updated successfully", "success");
      } else {
        await addInstagramPost(formData);
        showToast("Instagram post added successfully", "success");
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      showToast("Error saving Instagram post", "error");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteInstagramPost(id);
      showToast("Instagram post deleted successfully", "success");
      setDeleteConfirmId(null);
      loadData();
    } catch (error) {
      showToast("Failed to delete post", "error");
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
          <h1 className="font-serif text-3xl font-bold text-espresso-900 flex items-center gap-2">
            <Instagram className="w-7 h-7 text-champagne-600" />
            <span>Instagram Feed Management</span>
          </h1>
          <p className="text-xs text-taupe-600 font-light">
            Add Instagram post links, captions, and photos for the homepage gallery. Clicking a post opens the exact Instagram link.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold px-5 py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow"
        >
          <Plus className="w-4 h-4 text-champagne-400" />
          <span>Add New Instagram Post</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            Loading Instagram feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-taupe-600 font-light italic">
            No Instagram posts found. Click &quot;Add New Instagram Post&quot; to feature your first post on the homepage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-espresso-900 uppercase tracking-wider font-semibold border-b border-cream-300">
                <tr>
                  <th className="py-4 px-6">Preview Photo</th>
                  <th className="py-4 px-6">Caption</th>
                  <th className="py-4 px-6">Instagram Post Link</th>
                  <th className="py-4 px-6">Likes</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {posts.map((post) => {
                  const thumbnail = post.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200";
                  return (
                    <tr key={post.id} className="hover:bg-cream-50/80 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-200 border border-cream-300 shadow-sm">
                          <Image src={thumbnail} alt={post.caption || "Instagram preview"} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6 max-w-xs font-serif text-espresso-900">
                        <p className="line-clamp-2 text-xs leading-relaxed">
                          {post.caption || "No caption provided"}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-taupe-700">
                        {post.postUrl ? (
                          <a
                            href={post.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-champagne-600 hover:text-champagne-700 font-medium hover:underline text-xs"
                          >
                            <span className="max-w-[200px] truncate">{post.postUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-taupe-500 italic">Default Profile Link</span>
                        )}
                      </td>
                      <td className="py-3 px-6 font-semibold text-espresso-900">
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                          <Heart className="w-3 h-3 text-rose-600 fill-current" />
                          <span>{post.likes || "142"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="p-2 text-espresso-900 hover:text-champagne-600 hover:bg-cream-200 rounded-lg transition"
                          title="Edit Post"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Post"
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
              Remove Instagram Post?
            </h3>
            <p className="text-xs text-taupe-600 font-light">
              Are you sure you want to remove this post from the homepage gallery?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 bg-cream-100 hover:bg-cream-200 text-espresso-900 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(deleteConfirmId)}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Instagram Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-lg w-full my-auto max-h-[88vh] overflow-y-auto shadow-2xl border border-cream-300 space-y-6 scrollbar-thin">
            
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h2 className="font-serif text-2xl font-bold text-espresso-900">
                {editingPost ? "Edit Instagram Post" : "Add New Instagram Post"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-taupe-500 hover:text-espresso-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Instagram Post Link / URL
                </label>
                <input
                  type="url"
                  value={formData.postUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, postUrl: e.target.value }))}
                  placeholder="https://www.instagram.com/p/C..."
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                />
                <p className="text-[10px] text-taupe-500 mt-1 font-light">
                  Clicking the card on the homepage will open this direct Instagram post URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                  Post Caption
                </label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))}
                  placeholder="e.g. Velvet Rose Blossom • Bringing romantic warmth into your living space."
                  className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Likes Count
                  </label>
                  <input
                    type="text"
                    value={formData.likes}
                    onChange={(e) => setFormData((p) => ({ ...p, likes: e.target.value }))}
                    placeholder="e.g. 142"
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
                  />
                </div>
              </div>

              {/* Photo Upload with Display & Delete Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
                    Post Image
                  </label>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Auto-Compress: ≤ 250 KB
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold px-5 py-2.5 rounded-full shadow transition w-fit">
                    <Upload className="w-4 h-4 text-champagne-400" />
                    <span>{uploadingImage ? "Compressing & Uploading..." : "Upload Post Image"}</span>
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
                    <div className="relative w-36 aspect-square rounded-2xl overflow-hidden border border-cream-300 bg-white group shadow-sm">
                      <Image src={formData.image} alt="Post cover preview" fill className="object-cover" />
                      
                      {/* Always visible top-right delete button */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md z-10 transition transform hover:scale-110"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="absolute inset-0 bg-espresso-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-1.5 text-[10px] font-semibold uppercase px-3"
                          title="Delete Post Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Photo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-taupe-500 font-light italic">
                      No photo uploaded yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Card Live Preview Box */}
              {formData.caption && (
                <div className="pt-2 border-t border-cream-200">
                  <span className="block text-[11px] font-semibold text-espresso-900 uppercase tracking-wider mb-2">
                    Homepage Card Live Preview:
                  </span>
                  <div className="relative aspect-square w-48 rounded-2xl overflow-hidden border border-cream-300 shadow-md bg-espresso-950">
                    {formData.image ? (
                      <Image src={formData.image} alt="Card preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-cream-200 flex items-center justify-center text-taupe-500 text-xs italic">
                        Upload Photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-espresso-950/70 backdrop-blur-[2px] flex flex-col justify-between p-3 text-white">
                      <Instagram className="w-4 h-4 text-champagne-400 self-end" />
                      <p className="text-[11px] font-light line-clamp-3 leading-snug">
                        {formData.caption}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-cream-200/90 font-medium">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-300 fill-current" />
                          {formData.likes || "142"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 fill-current" />
                          Comment
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                  Save Post
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
