import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export class AppointmentService {
  static async getAppointments(): Promise<AppointmentRow[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_datetime', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  static async getAppointmentById(id: string): Promise<AppointmentRow | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  static async createAppointment(appointment: AppointmentInsert): Promise<AppointmentRow> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointment(id: string, updates: AppointmentUpdate): Promise<AppointmentRow> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  static async deleteAppointment(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  static async searchAppointments(query: string): Promise<AppointmentRow[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('appointment_datetime', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching appointments:', error);
      throw error;
    }
  }

  static async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<AppointmentRow[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_datetime', startDate)
        .lte('appointment_datetime', endDate)
        .order('appointment_datetime', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  }
}