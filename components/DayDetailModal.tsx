import React from 'react';
import { X, MapPin, User, Car } from 'lucide-react';
import { Vehicle, Booking } from '../types';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  vehicles: Vehicle[];
  bookings: Booking[];
  onAddBooking: (date: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  vehicles,
  bookings,
  onAddBooking
}) => {
  if (!isOpen) return null;

  const dateObj = new Date(date + 'T00:00:00'); // Ensure local time parsing
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Group status by vehicle
  const vehicleStatus = vehicles.map(v => {
    const booking = bookings.find(b => b.vehicleId === v.id);
    return {
      vehicle: v,
      booking: booking || null,
      isAvailable: !booking
    };
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold capitalize">{formattedDate}</h2>
            <p className="text-slate-400 text-sm">Status da Frota ({bookings.length} ocupados / {vehicles.length - bookings.length} livres)</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => onAddBooking(date)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + Novo Agendamento
              </button>
            <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded transition">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicleStatus.map(({ vehicle, booking, isAvailable }) => (
              <div 
                key={vehicle.id} 
                className={`border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 ${
                  isAvailable 
                    ? 'bg-white border-slate-200 hover:border-green-400 hover:shadow-md' 
                    : 'bg-slate-100 border-slate-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800">{vehicle.name}</h3>
                      <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{vehicle.plate}</span>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} title={isAvailable ? 'Disponível' : 'Ocupado'} />
                  </div>

                  {booking ? (
                    <div className="space-y-2 text-sm mt-4">
                       <div className="bg-blue-50 p-2 rounded border border-blue-100">
                          <div className="flex items-start gap-2 text-blue-900 mb-1">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            <span className="font-semibold">{booking.destination}</span>
                          </div>
                          <p className="text-xs text-blue-700 ml-6">Uso Compartilhado Disponível</p>
                       </div>
                       
                       <div className="flex items-center gap-2 text-slate-600">
                         <User size={14} />
                         <span>{booking.userName}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <span>Motivo: {booking.purpose || 'N/A'}</span>
                       </div>
                    </div>
                  ) : (
                    <div className="mt-6 flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded text-slate-400">
                      <Car size={24} className="mb-1 opacity-50"/>
                      <span className="text-sm">Disponível</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
