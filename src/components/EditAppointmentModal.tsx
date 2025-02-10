import React, { useState } from "react";
import { X } from "lucide-react";
import { Appointment } from "../types/appointment";
import { supabase } from "C:/Users/laksh/Dev/web-dev/projects/client_projects/Admin_EyeSpace_Optics/project/src/lib/supabase.ts";

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
}

const services = [
  {
    name: "Comprehensive Eye Examination",
    description: "Complete vision and eye health assessment",
    duration: "45 mins",
    price: 120,
  },
  {
    name: "Contact Lens Fitting",
    description: "Professional fitting and consultation for contact lenses",
    duration: "30 mins",
    price: 90,
  },
  {
    name: "Frame Styling Session",
    description: "Personal consultation for frame selection",
    duration: "30 mins",
    price: 60,
  },
  {
    name: "Follow-up Consultation",
    description: "Review and adjust your prescription or fitting",
    duration: "20 mins",
    price: 45,
  },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 21; hour++) {
    const startTime = new Date(0, 0, 0, hour, 0, 0);
    const endTime = new Date(0, 0, 0, hour + 1, 0, 0);
    const formattedStart = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formattedEnd = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    slots.push({
      start: `${hour.toString().padStart(2, "0")}:00`,
      label: `${formattedStart} - ${formattedEnd}`,
    });
  }
  return slots;
};

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  onClose,
  onSave,
}) => {
  const initialDateTime = new Date(appointment.appointment_datetime);
  const initialDate = initialDateTime.toISOString().split("T")[0];
  const initialTime =
    initialDateTime.getHours().toString().padStart(2, "0") + ":00";

  const [formData, setFormData] = useState<Appointment>({ ...appointment });
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialTime);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const appointment_datetime = `${selectedDate}T${selectedTimeSlot}:00`;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          ...formData,
          appointment_datetime,
        })
        .eq("id", appointment.id);

      if (error) throw error;

      setSuccessMessage("Appointment updated successfully!");
      onSave({ ...formData, appointment_datetime });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update the appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Appointment</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              <strong>Error: </strong> {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-500 text-sm">
              <strong>{successMessage}</strong>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <select
                  value={formData.service_name}
                  onChange={(e) => {
                    const selectedService = services.find(
                      (s) => s.name === e.target.value
                    );
                    if (selectedService) {
                      setFormData((prev) => ({
                        ...prev,
                        service_name: selectedService.name,
                        service_duration: parseInt(selectedService.duration),
                        service_price: selectedService.price,
                      }));
                    }
                  }}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {services.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.start} value={slot.start}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <input
                  type="text"
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 col-span-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
