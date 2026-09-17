import { Utility } from '../types';

export const mockUtilities: Utility[] = [
  { id: 'util-1', type: 'electricity', provider: 'Adani Electricity', accountNumber: 'AE-102938475', icon: '⚡', lastBill: { amount: 3850, date: '2026-08-05', status: 'pending' }, monthlyAverage: 3200, documents: ['doc-12'] },
  { id: 'util-2', type: 'water', provider: 'Municipal Water Supply', accountNumber: 'MWS-847261', icon: '💧', lastBill: { amount: 1200, date: '2026-07-15', status: 'paid' }, monthlyAverage: 400, documents: [] },
  { id: 'util-3', type: 'gas', provider: 'Mahanagar Gas', accountNumber: 'MGL-293847', icon: '🔥', lastBill: { amount: 850, date: '2026-07-20', status: 'paid' }, monthlyAverage: 800, documents: [] },
  { id: 'util-4', type: 'internet', provider: 'Jio Fiber', accountNumber: 'JF-192837465', icon: '📶', lastBill: { amount: 999, date: '2026-08-01', status: 'paid' }, monthlyAverage: 999, documents: [] },
];
