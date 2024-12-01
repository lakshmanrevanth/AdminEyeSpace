export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_name: string;
  service_duration: number;
  service_price: number;
  appointment_datetime: string;
  message: string;
  status: "completed" | "pending" | "confirmed";
  payment_status: "paid" | "unpaid";
}
