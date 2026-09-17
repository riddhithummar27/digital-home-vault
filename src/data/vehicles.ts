import { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-1', name: 'Hyundai Creta', type: 'car', brand: 'Hyundai', model: 'Creta SX(O)', year: 2024,
    registrationNumber: 'MH-02-AB-1234', color: 'Titan Grey', fuelType: 'Diesel',
    insuranceExpiry: '2027-05-19', insuranceProvider: 'Bajaj Allianz', pucExpiry: '2027-02-15',
    icon: '🚗', documents: ['doc-11'], serviceHistory: [
      { id: 'vs-1', date: '2025-06-10', type: 'general_service', description: 'First free service', provider: 'Hyundai Service Center', cost: 0 },
      { id: 'vs-2', date: '2025-12-15', type: 'general_service', description: 'Second free service', provider: 'Hyundai Service Center', cost: 0 },
      { id: 'vs-3', date: '2026-06-20', type: 'general_service', description: 'Paid service — oil + filters', provider: 'Hyundai Service Center', cost: 6500 },
    ],
  },
  {
    id: 'veh-2', name: 'Honda Activa', type: 'scooter', brand: 'Honda', model: 'Activa 6G', year: 2023,
    registrationNumber: 'MH-02-CD-5678', color: 'Pearl White', fuelType: 'Petrol',
    insuranceExpiry: '2026-11-30', insuranceProvider: 'ICICI Lombard', pucExpiry: '2026-12-01',
    icon: '🏍️', documents: [], serviceHistory: [
      { id: 'vs-4', date: '2026-04-10', type: 'general_service', description: 'Oil change + brake adjustment', provider: 'Honda Service', cost: 1200 },
    ],
  },
];
