import React, { useState, useEffect, useRef } from "react";
import { supabase } from "C:/Users/laksh/Dev/web-dev/projects/client_projects/Admin_EyeSpace_Optics/project/src/lib/supabase.ts"; // Import Supabase client

const categories = [
  { id: "1", name: "All about lenses" },
  { id: "2", name: "Eye conditions & symptoms" },
  { id: "3", name: "Eyesight by age" },
  { id: "4", name: "Your life and your eyes" },
];

export default function BlogInsertionForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false); // Connection state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .limit(1);
        if (data) {
          setIsSupabaseConnected(true);
          console.log("Supabase connected successfully.");
        } else if (error) {
          console.error("Supabase connection error:", error.message);
          setIsSupabaseConnected(false);
        }
      } catch (err) {
        console.error("Supabase connectivity test failed:", err);
        setIsSupabaseConnected(false);
      }
    };
    checkConnection();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `blog-images/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("blog-images") // Ensure "blog-images" bucket exists in Supabase
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      setError("Failed to upload image. Please try again.");
      return null;
    }

    return `${
      supabase.storage.from("blog-images").getPublicUrl(filePath).data.publicUrl
    }`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !category || !description || !image) {
      setError("Please fill in all fields and upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload Image
      const imageUrl = await uploadImage(image);
      if (!imageUrl) return;

      // Step 2: Insert Blog Data
      const { error } = await supabase
        .from("blogs")
        .insert([{ title, category, description, image_url: imageUrl }]);

      if (error) {
        console.error("Error inserting blog:", error.message);
        setError("Failed to submit blog post. Please try again.");
        return;
      }

      setSuccess("Blog post created successfully!");
      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create New Blog Post
      </h1>
      {!isSupabaseConnected && (
        <div
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Supabase is not connected.</span>
        </div>
      )}

      {isSupabaseConnected && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blog Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto"
                  />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>{image ? "Change image" : "Upload an image"}</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your blog title"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Write a brief description of the blog post"
            ></textarea>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {success}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            disabled={isSubmitting || !isSupabaseConnected}
          >
            {isSubmitting ? "Submitting..." : "Create Blog Post"}
          </button>
        </form>
      )}
    </div>
  );
}
