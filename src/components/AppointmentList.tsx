import React, { useState, useEffect } from "react";
import { Appointment } from "../types/appointment";
import AppointmentRow from "./AppointmentRow";
import AppointmentModal from "./AppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";
import { supabase } from "C:/Users/laksh/Dev/web-dev/projects/client_projects/Admin_EyeSpace_Optics/project/src/lib/supabase.ts"; // Import Supabase client

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("appointments").select("*");

        if (error) throw error;

        // Transform snake_case to camelCase
        const transformedData = data || [];
        console.log("Transformed Data:", transformedData); // Debugging
        setAppointments(transformedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const fullName =
      `${appointment.first_name} ${appointment.last_name}`.toLowerCase();
    const searchMatch =
      fullName.includes(searchQuery.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchQuery.toLowerCase());

    const dateMatch =
      !startDate ||
      !endDate ||
      (appointment.appointment_datetime >= startDate &&
        appointment.appointment_datetime <= endDate);

    const statusMatch =
      statusFilter === "all" || appointment.status === statusFilter;

    return searchMatch && dateMatch && statusMatch;
  });

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* UI and Components */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Appointment Management</h1>
        {/* Filters and Table */}
        {/* Same as your existing code */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onSelect={() => setSelectedAppointment(appointment)}
                  onEdit={() => handleEdit(appointment)}
                  onDelete={() => handleDelete(appointment.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default AppointmentList;
