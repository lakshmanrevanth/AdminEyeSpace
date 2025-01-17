import { useState } from "react";
import { supabase } from "../lib/supabase";

interface BlogPost {
  title: string;
  category: string;
  description: string;
  headings: string[];
  subheadings: string[];
  images: string[];
}

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadBlogPost = async (blogPost: BlogPost) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from("blog_posts").insert([
        {
          title: blogPost.title,
          category: blogPost.category,
          description: blogPost.description,
          headings: JSON.stringify(blogPost.headings),
          subheadings: JSON.stringify(blogPost.subheadings),
          images: JSON.stringify(blogPost.images),
        },
      ]);

      if (error) throw error;

      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      return null;
    }
  };

  return { uploadBlogPost, isLoading, error };
};
