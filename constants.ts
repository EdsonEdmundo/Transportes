import { Vehicle, VehicleType } from './types';

export const VEHICLES: Vehicle[] = [
  { id: 'v1', name: 'Ford Ka', plate: 'ABC-1234', type: VehicleType.SEDAN, imageUrl: 'https://picsum.photos/200/150?random=1' },
  { id: 'v2', name: 'Fiat Cronos', plate: 'DEF-5678', type: VehicleType.SEDAN, imageUrl: 'https://picsum.photos/200/150?random=2' },
  { id: 'v3', name: 'Chevrolet Onix', plate: 'GHI-9012', type: VehicleType.SEDAN, imageUrl: 'https://picsum.photos/200/150?random=3' },
  { id: 'v4', name: 'VW Virtus', plate: 'JKL-3456', type: VehicleType.SEDAN, imageUrl: 'https://picsum.photos/200/150?random=4' },
  { id: 'v5', name: 'Toyota Corolla', plate: 'MNO-7890', type: VehicleType.SEDAN, imageUrl: 'https://picsum.photos/200/150?random=5' },
  { id: 'v6', name: 'Jeep Renegade', plate: 'PQR-1122', type: VehicleType.SUV, imageUrl: 'https://picsum.photos/200/150?random=6' },
  { id: 'v7', name: 'Hyundai Creta', plate: 'STU-3344', type: VehicleType.SUV, imageUrl: 'https://picsum.photos/200/150?random=7' },
  { id: 'v8', name: 'VW T-Cross', plate: 'VWX-5566', type: VehicleType.SUV, imageUrl: 'https://picsum.photos/200/150?random=8' },
  { id: 'v9', name: 'Fiat Toro', plate: 'YZA-7788', type: VehicleType.PICKUP, imageUrl: 'https://picsum.photos/200/150?random=9' },
  { id: 'v10', name: 'Toyota Hilux', plate: 'BCD-9900', type: VehicleType.PICKUP, imageUrl: 'https://picsum.photos/200/150?random=10' },
  { id: 'v11', name: 'Mercedes Sprinter', plate: 'EFG-1111', type: VehicleType.VAN, imageUrl: 'https://picsum.photos/200/150?random=11' },
  { id: 'v12', name: 'Renault Master', plate: 'HIJ-2222', type: VehicleType.VAN, imageUrl: 'https://picsum.photos/200/150?random=12' },
];

export const MOCK_BOOKINGS_KEY = 'fleetshare_bookings';
