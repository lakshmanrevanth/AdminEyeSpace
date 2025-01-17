export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          service_name: string;
          service_duration: number;
          service_price: number;
          appointment_datetime: string;
          message: string | null;
          
        };
        Insert: Omit<
          Database["public"]["Tables"]["appointments"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Omit<
            Database["public"]["Tables"]["appointments"]["Row"],
            "id" | "created_at" | "updated_at"
          >
        >;
      };
    };
  };
}
