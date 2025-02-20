import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function EmailSubscriptions() {
  interface EmailEntry {
    id: number;
    email: string;
  }

  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from("emailsubscriptions")
      .select("*");
    if (error) {
      console.error("Error fetching emails:", error);
    } else {
      setEmails(data);
    }
  };

  const addEmail = async () => {
    if (!email) return;

    const { data, error } = await supabase
      .from("emailsubscriptions")
      .insert([{ email }]);

    if (error) {
      setError("Failed to add email. It may already exist.");
    } else {
      if (data) {
        setEmails([...emails, ...data]);
      }
      setEmail("");
      setError(null);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Email Subscriptions</h2>
      <div className="mb-4">
        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={addEmail}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Subscribe
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <h3 className="text-xl font-semibold">Subscribed Emails</h3>
      <ul className="mt-2">
        {emails.map((entry) => (
          <li key={entry.id} className="border-b py-2">
            {entry.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
