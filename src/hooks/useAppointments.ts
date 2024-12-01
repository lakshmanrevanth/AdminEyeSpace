import { useState, useEffect, useCallback } from 'react';
import { AppointmentService } from '../services/appointmentService';
import { Database } from '../types/supabase';

type Appointment = Database['public']['Tables']['appointments']['Row'];

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAppointments = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await AppointmentService.searchAppointments(query);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to search appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const data = await AppointmentService.getAppointmentsByDateRange(startDate, endDate);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to filter appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    searchAppointments,
    filterByDateRange,
  };
};