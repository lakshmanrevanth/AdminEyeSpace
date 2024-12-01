import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Appointment } from "../types/appointment";
import { supabase } from "C:/Users/laksh/Dev/web-dev/projects/client_projects/Admin_EyeSpace_Optics/project/src/lib/supabase.ts";

interface AppointmentRowProps {
  appointment: Appointment;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: (appointmentId: string) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({
  appointment,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  ); // Store the ID of the appointment to delete

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string | undefined) => {
    return status?.toLowerCase() === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return "Invalid Date";
    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  // Show the confirmation modal when clicking the delete button
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToDelete(appointment.id); // Store the appointment ID to delete
    setShowModal(true); // Show the modal
  };

  // Handle the actual deletion when confirmed
  const confirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      const { data, error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentToDelete);

      if (error) {
        throw error;
      }
      onDelete(appointmentToDelete); // Notify parent component to remove from UI
      setShowModal(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error deleting appointment.");
      setShowModal(false); // Close the modal even if there's an error
    }
  };

  const cancelDelete = () => {
    setShowModal(false); // Close the modal without deleting
  };

  return (
    <>
      <tr
        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={handleRowClick}
      >
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium">
              {`${appointment.first_name ?? "Unknown"} ${
                appointment.last_name ?? ""
              }`.trim()}
            </span>
            <span className="text-sm text-gray-500">
              {appointment.email || "No Email"}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium">
              {appointment.service_name || "Unknown Service"}
            </span>
            <span className="text-sm text-gray-500">
              {appointment.service_duration
                ? `${appointment.service_duration} min`
                : "Unknown Duration"}
              {appointment.service_price
                ? ` • $${appointment.service_price}`
                : ""}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          {formatDateTime(appointment.appointment_datetime)}
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status
              ? appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)
              : "No Status"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(
              appointment.payment_status
            )}`}
          >
            {appointment.payment_status
              ? appointment.payment_status.charAt(0).toUpperCase() +
                appointment.payment_status.slice(1)
              : "No Payment Info"}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Edit Appointment"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Delete Appointment"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </td>
      </tr>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this appointment?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentRow;
