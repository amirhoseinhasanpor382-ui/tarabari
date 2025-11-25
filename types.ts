
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'WORKSHOP' | 'SYSTEM_ADMIN';
  personnelCode: string;
  phone: string;
  registrationDate: Date;
  lastLogin: Date | null;
}

export interface Manager {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  email: string;
  phone: string;
}

export interface Request {
  id:string;
  username: string;
  title: string;
  description: string;
  type: 'مرخصی' | 'کارت سوخت' | 'ترفیع';
  recipient: 'مدیریت' | 'مدیر 1' | 'مدیر 2';
  status: 'PENDING' | 'COMPLETED' | 'APPROVED' | 'FINALIZED';
}

export interface Log {
  id: string;
  timestamp: Date;
  username: string;
  action: string;
}

export interface Vehicle {
  id: string;
  code: string;
  type: string;
  plateNumber: string;
  driverId: string | null;
  status: 'در مسیر' | 'در دسترس' | 'در دست تعمیر';
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: Date;
  serviceType: string;
  cost: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date | null;
  status: 'در حال انجام' | 'تکمیل شده' | 'برنامه ریزی شده';
  cargoType: string;
  distance: number; // Round trip distance in KM
  // New fields for queueing
  warehouseArrivalDate?: Date;
  warehouseLocation?: 'انبار مرکزی' | 'پاندا' | 'شهر لبنیات';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  target: 'همه کاربران' | 'همه مدیران' | 'کاربران خاص';
  targetUsernames?: string[];
  createdAt: Date;
  sender: string;
}

export const ServiceOrderStatuses = [
  'پذیرش شده',
  'در حال بررسی',
  'منتظر قطعه',
  'در حال تعمیر',
  'آماده تحویل',
  'تحویل داده شده',
] as const;

export type ServiceOrderStatus = typeof ServiceOrderStatuses[number];

export interface ServiceOrder {
  id: string;
  vehicleId: string;
  admissionDate: Date;
  issueDescription: string;
  status: ServiceOrderStatus;
  notes?: string;
}