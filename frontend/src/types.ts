/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';

export interface Vehicle {
  regNo: string; // unique
  name: string;
  type: 'Van' | 'Truck' | 'Mini' | 'Sedan';
  capacity: string; // Display capacity (e.g. "500 kg", "5 Ton")
  capacityKg: number; // For strict rule verification (e.g. 500, 5000)
  odometer: number; // in km
  acqCost: number; // in INR
  status: VehicleStatus;
}

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  category: 'LMV' | 'HMV';
  expiry: string; // MM/YYYY or YYYY-MM-DD
  contact: string;
  tripCompl: number; // Percentage (e.g. 96)
  safety: number; // Percentage (e.g. 99)
  status: DriverStatus;
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string; // TR001 etc.
  source: string;
  destination: string;
  vehicleReg: string; // Linked vehicle
  driverId: string; // Linked driver
  cargoWeight: number; // in kg
  plannedDistance: number; // in km
  status: TripStatus;
  eta: string; // e.g. "45 min", "1h 10m", or "—"
  date: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleReg: string;
  serviceType: string;
  cost: number;
  date: string;
  status: 'Active' | 'Completed';
}

export interface FuelLog {
  id: string;
  vehicleReg: string;
  date: string;
  liters: number;
  cost: number;
}

export interface ExpenseLog {
  id: string;
  tripId: string;
  vehicleReg: string;
  toll: number;
  other: number;
  maintLinked: number; // Linked maintenance cost if any
  total: number;
}

export interface AppSettings {
  depotName: string;
  currency: string;
  distanceUnit: string;
}

// RBAC permissions matrix structure
export interface RolePermission {
  role: UserRole;
  fleet: 'Full' | 'View' | 'None';
  driver: 'Full' | 'View' | 'None';
  trip: 'Full' | 'View' | 'None';
  fuelExpense: 'Full' | 'View' | 'None';
  analytics: 'Full' | 'View' | 'None';
}
