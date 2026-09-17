import { Expense } from '../types';

export const mockExpenses: Expense[] = [
  { id: 'exp-1', date: '2026-06-12', category: 'purchase', description: 'LG Split AC', amount: 42990, linkedEntity: { type: 'appliance', id: 'app-1', name: 'LG Split AC' } },
  { id: 'exp-2', date: '2026-08-10', category: 'service', description: 'AC General Service', amount: 1200, linkedEntity: { type: 'appliance', id: 'app-1', name: 'LG Split AC' } },
  { id: 'exp-3', date: '2026-07-05', category: 'repair', description: 'WM Inlet Valve Repair', amount: 2500, linkedEntity: { type: 'appliance', id: 'app-2', name: 'Samsung Washing Machine' } },
  { id: 'exp-4', date: '2026-03-10', category: 'repair', description: 'Fridge Thermostat Repair', amount: 3200, linkedEntity: { type: 'appliance', id: 'app-3', name: 'Whirlpool Refrigerator' } },
  { id: 'exp-5', date: '2026-06-15', category: 'maintenance', description: 'Kent RO Filter Change', amount: 3800, linkedEntity: { type: 'appliance', id: 'app-5', name: 'Kent RO Water Purifier' } },
  { id: 'exp-6', date: '2026-06-20', category: 'service', description: 'Car Service — Oil + Filters', amount: 6500, linkedEntity: { type: 'vehicle', id: 'veh-1', name: 'Hyundai Creta' } },
  { id: 'exp-7', date: '2026-08-05', category: 'utility', description: 'Electricity Bill — July', amount: 3850 },
  { id: 'exp-8', date: '2026-07-10', category: 'utility', description: 'Electricity Bill — June', amount: 2900 },
  { id: 'exp-9', date: '2026-08-01', category: 'utility', description: 'Internet — August', amount: 999 },
  { id: 'exp-10', date: '2026-07-15', category: 'utility', description: 'Water Bill — Q2', amount: 1200 },
  { id: 'exp-11', date: '2026-04-01', category: 'insurance', description: 'Home Insurance Premium', amount: 12500 },
  { id: 'exp-12', date: '2026-07-15', category: 'tax', description: 'Property Tax 2026-27 H1', amount: 8500 },
];
