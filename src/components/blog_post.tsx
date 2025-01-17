import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import styles from "./blog_post.module.css"; // Import the CSS module

const BlogPostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [headings, setHeadings] = useState([{ id: 1, text: "Steps" }]);
  const [subheadings, setSubheadings] = useState([
    { id: 2, text: "Conclusion" },
  ]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddHeading = () => {
    setHeadings([...headings, { id: headings.length + 1, text: "" }]);
  };

  const handleAddSubheading = () => {
    setSubheadings([...subheadings, { id: subheadings.length + 1, text: "" }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const { data, error } = await supabase.storage
            .from("blog-images")
            .upload(`public/${image.name}`, image);

          if (error) {
            throw new Error("Error uploading image");
          }

          const { data: urlData } = supabase.storage
            .from("blog-images")
            .getPublicUrl(`public/${image.name}`);

          if (!urlData) {
            throw new Error("Error retrieving image URL");
          }

          return urlData.publicUrl;
        })
      );

      // Insert blog post data into the database
      const { data, error } = await supabase.from("blog_posts").insert([
        {
          title,
          category,
          description,
          headings,
          subheadings,
          images: imageUrls,
        },
      ]);

      if (error) {
        throw new Error("Error uploading blog post");
      } else {
        setSuccessMessage("Blog post submitted successfully!");
        setTitle("");
        setCategory("");
        setDescription("");
        setHeadings([{ id: 1, text: "Steps" }]);
        setSubheadings([{ id: 2, text: "Conclusion" }]);
        setImages([]);
      }
    } catch (error) {
      setErrorMessage("Failed to submit the blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Create a New Blog Post</h1>

        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
            required
          >
            <option value="">Select Category</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
            <option value="Option 4">Option 4</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Headings</label>
          {headings.map((heading, index) => (
            <input
              key={heading.id}
              type="text"
              value={heading.text}
              onChange={(e) => {
                const newHeadings = [...headings];
                newHeadings[index].text = e.target.value;
                setHeadings(newHeadings);
              }}
              className={styles.input}
            />
          ))}
          <button
            type="button"
            onClick={handleAddHeading}
            className={styles.addButton}
          >
            Add Heading
          </button>
        </div>

        <div className={styles.field}>
          <label>Subheadings</label>
          {subheadings.map((subheading, index) => (
            <input
              key={subheading.id}
              type="text"
              value={subheading.text}
              onChange={(e) => {
                const newSubheadings = [...subheadings];
                newSubheadings[index].text = e.target.value;
                setSubheadings(newSubheadings);
              }}
              className={styles.input}
            />
          ))}
          <button
            type="button"
            onClick={handleAddSubheading}
            className={styles.addButton}
          >
            Add Subheading
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor="images">Images</label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Blog Post"}
        </button>

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default BlogPostForm;
