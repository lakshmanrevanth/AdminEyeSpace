import React, { useState } from "react";
import {
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
      const date = new Date(dateTime);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDetailsModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const AppointmentDetailsModal = () => (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setShowDetailsModal(false)}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          Appointment Details
        </h2>

        <div className="space-y-4">
          {/* Client Information */}
          <div className="flex items-center">
            <User className="mr-3 text-gray-500" />
            <div>
              <p className="font-semibold">
                {`${appointment.first_name ?? "Unknown"} ${
                  appointment.last_name ?? ""
                }`.trim()}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.email || "No Email"}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.phone || "No Phone"}
              </p>
            </div>
          </div>

          {/* Appointment Date and Time */}
          <div className="flex items-center">
            <Calendar className="mr-3 text-gray-500" />
            <div>
              <p className="font-semibold">Date & Time</p>
              <p className="text-sm text-gray-600">
                {formatDateTime(appointment.appointment_datetime)}
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div className="flex items-center">
            <div>
              <p className="font-semibold">Service</p>
              <p className="text-sm text-gray-600">
                {appointment.service_name || "Unknown Service"}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {appointment.service_duration || "Not specified"}
                {appointment.service_price
                  ? ` • Price: ${appointment.service_price} Rs`
                  : ""}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <Clock className="mr-3 text-gray-500" />
            <div>
              <p className="font-semibold">Status</p>
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
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center">
            <CreditCard className="mr-3 text-gray-500" />
            <div>
              <p className="font-semibold">Payment</p>
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
            </div>
          </div>

          {/* Additional Notes */}
          {appointment.message && (
            <div className="flex items-start">
              <FileText className="mr-3 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">Notes</p>
                <p className="text-sm text-gray-600">{appointment.message}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <tr
        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={handleRowClick}
      >
        {/* Existing row content remains the same */}
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
                ? `${appointment.service_duration} `
                : "Unknown Duration"}
              {appointment.service_price
                ? ` • ${appointment.service_price} Rs`
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
          </div>
        </td>
      </tr>

      {/* Detailed Appointment Modal */}
      {showDetailsModal && <AppointmentDetailsModal />}
    </>
  );
};

export default AppointmentRow;
