import React, { useState, useEffect } from 'react';
import { VEHICLES, MOCK_BOOKINGS_KEY } from './constants';
import { Booking, Vehicle } from './types';
import { BookingModal } from './components/BookingModal';
import { DayDetailModal } from './components/DayDetailModal';
import { AIChat } from './components/AIChat';
import { Calendar, ChevronLeft, ChevronRight, Car, List, LayoutGrid, Clock } from 'lucide-react';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);
  const [selectedBookingDate, setSelectedBookingDate] = useState<string | undefined>(undefined);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(MOCK_BOOKINGS_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookings", e);
      }
    } else {
        // Seed some initial data for the demo if empty
        const initialData: Booking[] = [
            { id: 'b1', vehicleId: 'v1', userId: 'user1', userName: 'Carlos Silva', destination: 'Secretaria de Saúde', date: new Date().toISOString().split('T')[0], purpose: 'Reunião', passengers: 2 },
            { id: 'b2', vehicleId: 'v6', userId: 'user2', userName: 'Ana Souza', destination: 'Aeroporto', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], purpose: 'Buscar visitante', passengers: 1 }
        ];
        setBookings(initialData);
        localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(initialData));
    }
  }, []);

  const handleCreateBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(updatedBookings));
    
    // Refresh day detail view if open
    // (React state update will handle re-render of modal since we pass bookings prop)
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + delta));
    setCurrentDate(new Date(newDate));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const todayStr = new Date().toISOString().split('T')[0];

    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-slate-50 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
        
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="bg-white min-h-[120px]" />
        ))}
        
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayBookings = bookings.filter(b => b.date === dateStr);
          const availabilityCount = VEHICLES.length - dayBookings.length;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;

          return (
            <div 
              key={day} 
              onClick={() => setSelectedDayDetail(dateStr)}
              className={`bg-white min-h-[120px] p-2 hover:bg-blue-50 cursor-pointer transition-colors relative group border-t border-slate-100 ${isToday ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                  {day}
                </span>
                {!isPast && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${availabilityCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {availabilityCount} Livres
                    </span>
                )}
              </div>

              <div className="space-y-1">
                {dayBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="text-xs bg-slate-100 border border-slate-200 p-1 rounded truncate text-slate-600 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="truncate">{b.destination}</span>
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-slate-400 pl-1">
                    + {dayBookings.length - 3} outros
                  </div>
                )}
              </div>
              
              {/* Hover action for quick book */}
              {!isPast && (
                  <button 
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBookingDate(dateStr);
                        setIsBookingModalOpen(true);
                    }}
                  >
                    <Clock size={14} />
                  </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FleetShare</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/20">
            <Calendar size={20} />
            <span className="font-medium">Calendário</span>
          </button>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Frota Total</span>
            <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full">{VEHICLES.length}</span>
          </div>
          <div className="space-y-1 px-2">
             {VEHICLES.slice(0, 5).map(v => (
                 <div key={v.id} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white transition">
                     <Car size={16} />
                     <span className="truncate">{v.name}</span>
                 </div>
             ))}
             <div className="px-3 py-1 text-xs text-slate-600 italic">...e mais {VEHICLES.length - 5}</div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Dica de uso</p>
                <p className="text-sm text-slate-200">Clique em um dia para ver detalhes de quem está indo para onde e pegar carona!</p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Agendamento de Veículos</h2>
                <p className="text-slate-500 text-sm">Gerencie o uso compartilhado da frota da repartição.</p>
            </div>
            <button 
                onClick={() => {
                    setSelectedBookingDate(undefined);
                    setIsBookingModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition flex items-center gap-2"
            >
                <Clock size={18} />
                Agendar Veículo
            </button>
        </header>

        {/* Calendar Toolbar */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-200 rounded-full transition">
                    <ChevronLeft size={24} className="text-slate-600"/>
                </button>
                <h3 className="text-xl font-semibold text-slate-800 capitalize w-48 text-center">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-200 rounded-full transition">
                    <ChevronRight size={24} className="text-slate-600"/>
                </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div>
                    <span>Agendado</span>
                </div>
            </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
            {renderCalendar()}
        </div>
      </main>

      {/* Modals & Overlays */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleCreateBooking}
        selectedDate={selectedBookingDate}
        vehicles={VEHICLES}
        existingBookings={bookings}
      />

      {selectedDayDetail && (
        <DayDetailModal 
            isOpen={!!selectedDayDetail}
            onClose={() => setSelectedDayDetail(null)}
            date={selectedDayDetail}
            vehicles={VEHICLES}
            bookings={bookings.filter(b => b.date === selectedDayDetail)}
            onAddBooking={(date) => {
                setSelectedDayDetail(null);
                setSelectedBookingDate(date);
                setIsBookingModalOpen(true);
            }}
        />
      )}

      {/* AI Assistant */}
      <AIChat bookings={bookings} vehicles={VEHICLES} />
    </div>
  );
}
