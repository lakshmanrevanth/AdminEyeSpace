import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Star } from "lucide-react";

export default function CustomerReviews() {
  interface Review {
    id: string;
    name: string;
    rating: number;
    review_description: string;
    created_at: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, name, rating, review_description, created_at")
        .order("created_at", { ascending: false });
      if (!error) setReviews(data);
      setLoading(false);
    }
    fetchReviews();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <ul>
          {reviews.map(
            ({ id, name, rating, review_description, created_at }) => (
              <li key={id} className="border-b py-4">
                <div className="flex justify-between">
                  <span className="font-semibold">{name}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex text-yellow-500 mt-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-gray-700 mt-2">{review_description}</p>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}
