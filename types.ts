export enum VehicleType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  PICKUP = 'Picape',
  VAN = 'Van'
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: VehicleType;
  imageUrl: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string; // Simplified for demo, just a string name
  userName: string;
  destination: string;
  date: string; // YYYY-MM-DD
  purpose: string;
  passengers: number;
}

export interface DayStatus {
  date: string;
  bookings: Booking[];
}
