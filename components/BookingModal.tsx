import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, MapPin, User, Info, Users } from 'lucide-react';
import { Vehicle, Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: Omit<Booking, 'id'>) => void;
  selectedDate?: string;
  vehicles: Vehicle[];
  existingBookings: Booking[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  vehicles,
  existingBookings
}) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    userId: '', // Ideally from auth context, manual for demo
    userName: '',
    destination: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    purpose: '',
    passengers: 1
  });

  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    // Filter vehicles available on the selected date
    const takenVehicleIds = existingBookings
      .filter(b => b.date === formData.date)
      .map(b => b.vehicleId);
    
    setAvailableVehicles(vehicles.filter(v => !takenVehicleIds.includes(v.id)));
  }, [formData.date, existingBookings, vehicles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
    // Reset form mostly
    setFormData(prev => ({ ...prev, destination: '', purpose: '', vehicleId: '' }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon size={20} />
            Novo Agendamento
          </h2>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Veículo</label>
              <select
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                ))}
              </select>
              {availableVehicles.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Nenhum veículo disponível nesta data.</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <User size={14} /> Solicitante
            </label>
            <input
              type="text"
              required
              placeholder="Seu nome completo"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value, userId: e.target.value.toLowerCase().replace(/\s/g, '')})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin size={14} /> Destino
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Prefeitura, Aeroporto..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
             <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Users size={14} /> Pessoas
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.passengers}
                onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Info size={14} /> Propósito (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Reunião externa, transporte de material"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.vehicleId || availableVehicles.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
