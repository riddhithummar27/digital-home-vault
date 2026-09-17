import { Reminder } from '../types';

export const mockReminders: Reminder[] = [
  { id: 'rem-1', title: 'AC Service Due', description: 'LG Split AC — next service recommended', dueDate: '2026-09-10', type: 'service_due', linkedEntity: { type: 'appliance', id: 'app-1', name: 'LG Split AC' }, urgency: 'medium', icon: '❄️', isCompleted: false },
  { id: 'rem-2', title: 'Home Insurance Renewal', description: 'HDFC Ergo home insurance policy expires', dueDate: '2027-03-31', type: 'insurance_renewal', linkedEntity: { type: 'property', id: 'prop-1', name: 'My Home' }, urgency: 'low', icon: '🏠', isCompleted: false },
  { id: 'rem-3', title: 'Property Tax Due', description: 'Municipal property tax for 2026-27 H2', dueDate: '2026-10-15', type: 'tax_due', linkedEntity: { type: 'property', id: 'prop-1', name: 'My Home' }, urgency: 'medium', icon: '🏛️', isCompleted: false },
  { id: 'rem-4', title: 'Honda Activa Insurance', description: 'ICICI Lombard scooter insurance expires', dueDate: '2026-11-30', type: 'insurance_renewal', linkedEntity: { type: 'vehicle', id: 'veh-2', name: 'Honda Activa' }, urgency: 'medium', icon: '🏍️', isCompleted: false },
  { id: 'rem-5', title: 'Water Purifier Filter', description: 'Kent RO filter replacement due (6 months)', dueDate: '2026-12-15', type: 'service_due', linkedEntity: { type: 'appliance', id: 'app-5', name: 'Kent RO Water Purifier' }, urgency: 'low', icon: '💧', isCompleted: false },
  { id: 'rem-6', title: 'Electricity Bill Payment', description: 'Adani Electricity — August 2026 bill', dueDate: '2026-08-20', type: 'bill_payment', urgency: 'high', icon: '⚡', isCompleted: false },
  { id: 'rem-7', title: 'PUC Renewal — Activa', description: 'Honda Activa PUC certificate expires', dueDate: '2026-12-01', type: 'puc_expiry', linkedEntity: { type: 'vehicle', id: 'veh-2', name: 'Honda Activa' }, urgency: 'low', icon: '📋', isCompleted: false },
];
