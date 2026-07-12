/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Driver, Trip, MaintenanceRecord, FuelLog, ExpenseLog, AppSettings, RolePermission } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  { regNo: 'GJ01AB4521', name: 'VAN-05', type: 'Van', capacity: '500 kg', capacityKg: 500, odometer: 74000, acqCost: 620000, status: 'Available' },
  { regNo: 'GJ01AB9981', name: 'TRUCK-12', type: 'Truck', capacity: '5 Ton', capacityKg: 5000, odometer: 182000, acqCost: 2450000, status: 'On Trip' },
  { regNo: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacity: '300 kg', capacityKg: 300, odometer: 66000, acqCost: 410000, status: 'In Shop' },
  { regNo: 'GJ01AB0081', name: 'VAN-09', type: 'Van', capacity: '750 kg', capacityKg: 750, odometer: 241900, acqCost: 590000, status: 'Retired' },
  { regNo: 'GJ01AB0808', name: 'MINI-08', type: 'Mini', capacity: '300 kg', capacityKg: 300, odometer: 15400, acqCost: 380000, status: 'On Trip' },
  { regNo: 'GJ01AB1111', name: 'TRUCK-11', type: 'Truck', capacity: '8 Ton', capacityKg: 8000, odometer: 120500, acqCost: 3200000, status: 'Available' },
  { regNo: 'GJ01AB0404', name: 'TRUCK-04', type: 'Truck', capacity: '5 Ton', capacityKg: 5000, odometer: 95000, acqCost: 2100000, status: 'Available' },
  { regNo: 'GJ01AB0006', name: 'TRUCK-06', type: 'Truck', capacity: '6 Ton', capacityKg: 6000, odometer: 108000, acqCost: 2500000, status: 'Available' }
];

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'D01', name: 'Alex', licenseNo: 'DL-88213', category: 'LMV', expiry: '12/2028', contact: '9876599120', tripCompl: 96, safety: 99, status: 'Available' },
  { id: 'D02', name: 'John', licenseNo: 'DL-44120', category: 'HMV', expiry: '03/2025', contact: '9822044310', tripCompl: 81, safety: 45, status: 'Suspended' },
  { id: 'D03', name: 'Priya', licenseNo: 'DL-77031', category: 'LMV', expiry: '08/2029', contact: '9911077551', tripCompl: 99, safety: 98, status: 'On Trip' },
  { id: 'D04', name: 'Suresh', licenseNo: 'DL-90045', category: 'HMV', expiry: '01/2027', contact: '9744090123', tripCompl: 88, safety: 90, status: 'Off Duty' },
  { id: 'D05', name: 'Rajesh', licenseNo: 'DL-55234', category: 'HMV', expiry: '11/2028', contact: '9845012345', tripCompl: 92, safety: 94, status: 'Available' },
  { id: 'D06', name: 'Amit', licenseNo: 'DL-11022', category: 'LMV', expiry: '05/2030', contact: '9012345678', tripCompl: 95, safety: 97, status: 'Available' }
];

export const INITIAL_TRIPS: Trip[] = [
  { id: 'TR001', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', vehicleReg: 'GJ01AB4521', driverId: 'D01', cargoWeight: 450, plannedDistance: 45, status: 'Dispatched', eta: '45 min', date: '2026-07-11' },
  { id: 'TR002', source: 'Vadodara Logistics Park', destination: 'Surat Terminal', vehicleReg: 'GJ01AB9981', driverId: 'D03', cargoWeight: 4200, plannedDistance: 150, status: 'Completed', eta: '—', date: '2026-07-10' },
  { id: 'TR003', source: 'Rajkot Depot', destination: 'Morbi Ceramics Hub', vehicleReg: 'GJ01AB0808', driverId: 'D03', cargoWeight: 250, plannedDistance: 68, status: 'Dispatched', eta: '1h 10m', date: '2026-07-11' },
  { id: 'TR004', source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', vehicleReg: 'GJ01AB0404', driverId: 'D04', cargoWeight: 700, plannedDistance: 38, status: 'Draft', eta: 'Awaiting vehicle', date: '2026-07-11' },
  { id: 'TR006', source: 'Mansa', destination: 'Kalol Depot', vehicleReg: 'GJ01AB0006', driverId: 'D05', cargoWeight: 1500, plannedDistance: 25, status: 'Cancelled', eta: 'Vehicle went to shop', date: '2026-07-11' }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  { id: 'M01', vehicleReg: 'GJ01AB4521', serviceType: 'Oil Change', cost: 2500, date: '2026-07-07', status: 'Active' },
  { id: 'M02', vehicleReg: 'GJ01AB1111', serviceType: 'Engine Repair', cost: 18000, date: '2026-07-06', status: 'Completed' },
  { id: 'M03', vehicleReg: 'GJ01AB1120', serviceType: 'Tyre Replace', cost: 6200, date: '2026-07-08', status: 'Active' }
];

export const INITIAL_FUEL_LOGS: FuelLog[] = [
  { id: 'F01', vehicleReg: 'GJ01AB4521', date: '2026-07-05', liters: 42, cost: 3150 },
  { id: 'F02', vehicleReg: 'GJ01AB1111', date: '2026-07-06', liters: 110, cost: 8400 },
  { id: 'F03', vehicleReg: 'GJ01AB0808', date: '2026-07-06', liters: 28, cost: 2050 }
];

export const INITIAL_EXPENSES: ExpenseLog[] = [
  { id: 'E01', tripId: 'TR001', vehicleReg: 'GJ01AB4521', toll: 120, other: 0, maintLinked: 0, total: 120 },
  { id: 'E02', tripId: 'TR002', vehicleReg: 'GJ01AB9981', toll: 340, other: 2010, maintLinked: 18000, total: 20350 }
];

export const INITIAL_SETTINGS: AppSettings = {
  depotName: 'Gandhinagar Depot GJ14',
  currency: 'INR (Rs)',
  distanceUnit: 'Kilometers'
};

export const ROLE_PERMISSIONS: RolePermission[] = [
  { role: 'Fleet Manager', fleet: 'Full', driver: 'Full', trip: 'None', fuelExpense: 'None', analytics: 'View' },
  { role: 'Dispatcher', fleet: 'View', driver: 'None', trip: 'Full', fuelExpense: 'None', analytics: 'None' },
  { role: 'Safety Officer', fleet: 'None', driver: 'Full', trip: 'View', fuelExpense: 'None', analytics: 'None' },
  { role: 'Financial Analyst', fleet: 'View', driver: 'None', trip: 'None', fuelExpense: 'Full', analytics: 'Full' }
];

// Helper to initialize and retrieve state from localStorage
export const getLocalStorageData = <T>(key: string, initialValue: T): T => {
  if (typeof window === 'undefined') return initialValue;
  try {
    const item = window.localStorage.getItem(`transitops_${key}`);
    if (item) {
      return JSON.parse(item);
    }
    window.localStorage.setItem(`transitops_${key}`, JSON.stringify(initialValue));
    return initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
};

export const setLocalStorageData = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(`transitops_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};
