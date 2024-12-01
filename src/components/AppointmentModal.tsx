import React from 'react';
import { X, Clock, DollarSign, Mail, Phone, MessageSquare } from 'lucide-react';
import { Appointment } from '../types/appointment';

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-4">Client Information</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{' '}
                    {`${appointment.firstName} ${appointment.lastName}`}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" />
                    {appointment.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    {appointment.phone}
                  </p>
                </div>
              </div>

              <div className="flex-1 mt-6 md:mt-0">
                <h3 className="font-semibold text-lg mb-4">Service Details</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Service:</span> {appointment.serviceName}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    {`${appointment.serviceDuration} minutes`}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4" />
                    {`$${appointment.servicePrice}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  {appointment.message || 'No additional message'}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment</span>
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm ${
                    appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;