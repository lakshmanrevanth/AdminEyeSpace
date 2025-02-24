"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaQuoteRight,
  FaCode,
  FaListUl,
  FaListOl,
  FaHeading,
  FaLink,
} from "react-icons/fa";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import * as z from "zod";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(3, "Category is required"),
  content: z.string().min(10, "Blog content cannot be empty"),
  images: z.any(),
});

const BlogEditor = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setValue("content", editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-none min-h-[400px] p-4",
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const uploadImage = useCallback(async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(`blog_${Date.now()}_${file.name}`, file);
      if (error) throw error;
      return supabase.storage.from("blog-images").getPublicUrl(data.path).data
        .publicUrl;
    } catch (error) {
      console.error("Image Upload Error:", error);
      setErrorMsg("Error uploading image. Please try again.");
      return null;
    }
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const uploadedImages = await Promise.all(
        Array.from(data.images as File[]).map(async (file: File) => {
          if (file instanceof File) return await uploadImage(file);
          return null;
        })
      );

      const blogData = {
        ...data,
        images: uploadedImages.filter((url): url is string => !!url),
        created_at: new Date(),
      };

      const { error } = await supabase.from("blogs").insert([blogData]);
      if (error) throw error;

      alert("✅ Blog posted successfully!");
      reset();
      editor?.commands.clearContent();
      setImagePreviews([]);
    } catch (error) {
      console.error("Submission Error:", error);
      setErrorMsg(
        "Error submitting blog. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleBold = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  }, [editor]);

  const toggleItalic = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleUnderline().run();
    }
  }, [editor]);

  const toggleStrikethrough = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleStrike().run();
    }
  }, [editor]);

  const toggleQuote = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
    }
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run();
    }
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
    }
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleOrderedList().run();
    }
  }, [editor]);

  const insertLink = useCallback(() => {
    if (editor) {
      const url = prompt("Enter URL");
      if (url) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
    }
  }, [editor]);

  const toggleHeading1 = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    }
  }, [editor]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-black">
        Create New Blog Post
      </h2>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border p-4 rounded-lg"
      >
        <div>
          <label className="block text-black text-sm font-semibold mb-2">
            Title
          </label>
          <input
            {...register("title")}
            placeholder="Enter blog title"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.title ? "border-red-500" : "focus:border-blue-500"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-black text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Write a short description..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none h-32 ${
              errors.description ? "border-red-500" : "focus:border-blue-500"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-black text-sm font-semibold mb-2">
            Category
          </label>
          <input
            {...register("category")}
            placeholder="e.g., Technology, Lifestyle"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.category ? "border-red-500" : "focus:border-blue-500"
            }`}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-black text-sm font-semibold mb-2">
            Content
          </label>
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b">
              <button
                type="button"
                onClick={toggleHeading1}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("heading", { level: 1 })
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Heading 1"
              >
                <FaHeading className="inline-block" />
              </button>

              <button
                type="button"
                onClick={toggleBold}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("bold")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Bold"
              >
                <FaBold />
              </button>

              <button
                type="button"
                onClick={toggleItalic}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("italic")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Italic"
              >
                <FaItalic />
              </button>

              <button
                type="button"
                onClick={toggleUnderline}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("underline")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Underline"
              >
                <FaUnderline />
              </button>

              <button
                type="button"
                onClick={toggleStrikethrough}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("strike")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Strikethrough"
              >
                <FaStrikethrough />
              </button>

              <button
                type="button"
                onClick={toggleQuote}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("blockquote")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Blockquote"
              >
                <FaQuoteRight />
              </button>
              <button
                type="button"
                onClick={toggleCodeBlock}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("codeBlock")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Code Block"
              >
                <FaCode />
              </button>

              <button
                type="button"
                onClick={toggleBulletList}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("bulletList")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Bullet List"
              >
                <FaListUl />
              </button>

              <button
                type="button"
                onClick={toggleOrderedList}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("orderedList")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Numbered List"
              >
                <FaListOl />
              </button>

              <button
                type="button"
                onClick={insertLink}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor?.isActive("link")
                    ? "bg-blue-500 text-white"
                    : "text-black"
                }`}
                title="Link"
              >
                <FaLink />
              </button>
            </div>
            <EditorContent
              editor={editor}
              className="bg-white p-4 min-h-[400px]"
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-black text-sm font-semibold mb-2">
            Featured Images
          </label>
          <input
            type="file"
            multiple
            {...register("images")}
            onChange={handleImageChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
          <div className="flex gap-4 mt-4 flex-wrap">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publishing..." : "Publish Blog Post"}
        </button>
      </form>
    </div>
  );
};

export default BlogEditor;
