import { createClient } from "@supabase/supabase-js";
import { Appointment } from "../types/appointment";

const supabaseUrl: string = "https://ncchhsrqaiffgnzqbekl.supabase.co";
const supabaseAnonKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jY2hoc3JxYWlmZmduenFiZWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4Njg1MzcsImV4cCI6MjA0ODQ0NDUzN30.mpD2Nwu5F5nf0d6cBoQ68D9tmBu-9nek7jfgdWd4qv0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const updateAppointment = async (updatedAppointment: Appointment) => {
  const { data, error } = await supabase
    .from("appointment") // Replace with your table name
    .update(updatedAppointment)
    .eq("id", updatedAppointment.id); // Ensure the record is matched by ID

  if (error) {
    console.error("Error updating appointment:", error.message);
    return false;
  }

  console.log("Updated appointment:", data);
  return true;
};

export { createClient };
