// ===== HOME & PROPERTY =====
export interface Home {
  id: string;
  name: string;
  address: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'flat' | 'bungalow';
  ownerName: string;
  purchaseDate?: string;
  purchasePrice?: number;
  area?: string;
  documents: Document[];
}

// ===== FAMILY =====
export interface FamilyMember {
  id: string;
  name: string;
  role: 'owner' | 'spouse' | 'child' | 'parent' | 'other';
  avatar?: string;
  phone?: string;
  email?: string;
  documents: string[];
}

// ===== APPLIANCE =====
export interface Appliance {
  id: string;
  name: string;
  category: ApplianceCategory;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  seller?: string;
  warrantyPeriod: string;
  warrantyExpiry: string;
  warrantyStatus: WarrantyStatus;
  icon: string;
  documents: string[];
  serviceHistory: ServiceRecord[];
  notes?: string;
}

export type ApplianceCategory = 'cooling' | 'laundry' | 'kitchen' | 'entertainment' | 'bathroom' | 'cleaning' | 'other';
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'unknown';

// ===== VEHICLE =====
export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'bike' | 'scooter' | 'other';
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  fuelType?: string;
  insuranceExpiry?: string;
  insuranceProvider?: string;
  pucExpiry?: string;
  icon: string;
  documents: string[];
  serviceHistory: ServiceRecord[];
}

// ===== DOCUMENT =====
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: string;
  uploadDate: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'jpeg';
  fileSize?: string;
  linkedEntity?: { type: 'appliance' | 'vehicle' | 'property' | 'family'; id: string; name: string };
  extractedData?: Record<string, string>;
  keyDates?: { label: string; date: string }[];
  tags?: string[];
  confidenceScore?: number;
}

export type DocumentType = 'invoice' | 'warranty' | 'insurance' | 'bill' | 'receipt' | 'service_record' | 'tax' | 'identity' | 'manual' | 'property_doc' | 'registration' | 'certificate' | 'other';

// ===== SERVICE RECORD =====
export interface ServiceRecord {
  id: string;
  date: string;
  type: 'general_service' | 'repair' | 'installation' | 'inspection' | 'gas_check' | 'cleaning' | 'parts_replacement';
  description: string;
  provider: string;
  cost: number;
  documentId?: string;
  partsReplaced?: string[];
  notes?: string;
}

// ===== EXPENSE =====
export interface Expense {
  id: string;
  date: string;
  category: 'maintenance' | 'repair' | 'utility' | 'insurance' | 'purchase' | 'tax' | 'service' | 'other';
  description: string;
  amount: number;
  linkedEntity?: { type: string; id: string; name: string };
  documentId?: string;
}

// ===== REMINDER =====
export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: 'warranty_expiry' | 'insurance_renewal' | 'service_due' | 'bill_payment' | 'tax_due' | 'document_expiry' | 'puc_expiry' | 'custom';
  linkedEntity?: { type: string; id: string; name: string };
  urgency: 'high' | 'medium' | 'low';
  icon: string;
  isCompleted: boolean;
}

// ===== UTILITY =====
export interface Utility {
  id: string;
  type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'cable' | 'other';
  provider: string;
  accountNumber?: string;
  icon: string;
  lastBill?: { amount: number; date: string; status: 'paid' | 'pending' | 'overdue' };
  monthlyAverage?: number;
  documents: string[];
}

// ===== CHAT =====
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: { label: string; entityType: string; entityId: string }[];
}

// ===== THEME =====
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  accentGold: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  cardShadow: string;
  tabBar: string;
  tabBarBorder: string;
  statusBar: 'light-content' | 'dark-content';
}

// ===== AI EXTRACTION =====
export interface AIExtractionResult {
  documentType: DocumentType;
  confidence: number;
  extractedFields: { key: string; value: string; confidence: number }[];
  linkedEntity?: { type: string; name: string; isNew: boolean };
  keyDates: { label: string; date: string }[];
}

export type SupportedLanguage = 'en' | 'hi' | 'gu' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'pa';
