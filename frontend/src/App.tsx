/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import FleetRegistryView from './components/FleetRegistryView';
import DriversView from './components/DriversView';
import TripDispatcher from './components/TripDispatcher';
import MaintenanceView from './components/MaintenanceView';
import FuelExpenseView from './components/FuelExpenseView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

import { 
  UserRole, 
  Vehicle, 
  Driver, 
  Trip, 
  MaintenanceRecord, 
  FuelLog, 
  ExpenseLog, 
  AppSettings,
  TripStatus
} from './types';

import { 
  INITIAL_VEHICLES, 
  INITIAL_DRIVERS, 
  INITIAL_TRIPS, 
  INITIAL_MAINTENANCE, 
  INITIAL_FUEL_LOGS, 
  INITIAL_EXPENSES, 
  INITIAL_SETTINGS, 
  ROLE_PERMISSIONS,
  getLocalStorageData, 
  setLocalStorageData 
} from './initialData';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return getLocalStorageData<boolean>('is_logged_in', false);
  });
  
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return getLocalStorageData<UserRole>('user_role', 'Fleet Manager');
  });

  // Odoo Core Fleet State
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    return getLocalStorageData<Vehicle[]>('vehicles', INITIAL_VEHICLES);
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return getLocalStorageData<Driver[]>('drivers', INITIAL_DRIVERS);
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    return getLocalStorageData<Trip[]>('trips', INITIAL_TRIPS);
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    return getLocalStorageData<MaintenanceRecord[]>('maintenance', INITIAL_MAINTENANCE);
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    return getLocalStorageData<FuelLog[]>('fuel_logs', INITIAL_FUEL_LOGS);
  });

  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>(() => {
    return getLocalStorageData<ExpenseLog[]>('expenses', INITIAL_EXPENSES);
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    return getLocalStorageData<AppSettings>('settings', INITIAL_SETTINGS);
  });

  // UI layouts State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist Auth States
  useEffect(() => {
    setLocalStorageData('is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    setLocalStorageData('user_role', userRole);
    
    // Auto-switch navigation tab to an allowed page if current is restricted by the newly selected role
    const perm = ROLE_PERMISSIONS.find(p => p.role === userRole);
    if (perm) {
      if (activeTab === 'maintenance' && perm.fleet !== 'Full') setActiveTab('dashboard');
      if (activeTab === 'settings' && perm.fleet !== 'Full') setActiveTab('dashboard');
      if (activeTab === 'expenses' && perm.fuelExpense !== 'Full') setActiveTab('dashboard');
      if (activeTab === 'analytics' && perm.analytics === 'None') setActiveTab('dashboard');
      if (activeTab === 'trips' && perm.trip === 'None') setActiveTab('dashboard');
      if (activeTab === 'drivers' && perm.driver === 'None') setActiveTab('dashboard');
    }
  }, [userRole]);

  // Sync state helpers
  const handleAddVehicle = (newVehicle: Vehicle): boolean => {
    const exists = vehicles.some(v => v.regNo === newVehicle.regNo);
    if (exists) return false;

    const updated = [newVehicle, ...vehicles];
    setVehicles(updated);
    setLocalStorageData('vehicles', updated);
    return true;
  };

  const handleAddDriver = (newDriver: Driver): boolean => {
    const updated = [newDriver, ...drivers];
    setDrivers(updated);
    setLocalStorageData('drivers', updated);
    return true;
  };

  const handleUpdateDriverStatus = (id: string, status: any) => {
    const updated = drivers.map(d => d.id === id ? { ...d, status } : d);
    setDrivers(updated);
    setLocalStorageData('drivers', updated);
  };

  const handleDispatchTrip = (newTrip: Trip) => {
    // 1. Add the trip to list
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    setLocalStorageData('trips', updatedTrips);

    // 2. Transition vehicle status to 'On Trip'
    const updatedVehicles = vehicles.map(v => 
      v.regNo === newTrip.vehicleReg ? { ...v, status: 'On Trip' as const } : v
    );
    setVehicles(updatedVehicles);
    setLocalStorageData('vehicles', updatedVehicles);

    // 3. Transition driver status to 'On Trip'
    const updatedDrivers = drivers.map(d => 
      d.id === newTrip.driverId ? { ...d, status: 'On Trip' as const } : d
    );
    setDrivers(updatedDrivers);
    setLocalStorageData('drivers', updatedDrivers);
  };

  const handleUpdateTripStatus = (tripId: string, status: TripStatus) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    // 1. Update Trip Status
    const updatedTrips = trips.map(t => t.id === tripId ? { ...t, status, eta: '—' } : t);
    setTrips(updatedTrips);
    setLocalStorageData('trips', updatedTrips);

    // 2. Transition Vehicle and Driver back to 'Available'
    const updatedVehicles = vehicles.map(v => {
      if (v.regNo === trip.vehicleReg) {
        // If trip is Completed, we also add the plannedDistance to the vehicle's odometer!
        const newOdo = status === 'Completed' ? v.odometer + trip.plannedDistance : v.odometer;
        return { ...v, status: 'Available' as const, odometer: newOdo };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    setLocalStorageData('vehicles', updatedVehicles);

    const updatedDrivers = drivers.map(d => 
      d.id === trip.driverId ? { ...d, status: 'Available' as const } : d
    );
    setDrivers(updatedDrivers);
    setLocalStorageData('drivers', updatedDrivers);

    // 3. If completed, auto-log Fuel Consumption and Toll/Misc Expenses for high-fidelity completeness!
    if (status === 'Completed') {
      const fuelLiters = Math.round(trip.plannedDistance / 6); // ~6km/liter average
      const calculatedFuelCost = fuelLiters * 75; // ₹75/liter approximate

      const newFuelLog: FuelLog = {
        id: 'F' + String(fuelLogs.length + 1).padStart(2, '0'),
        vehicleReg: trip.vehicleReg,
        date: '2026-07-11',
        liters: fuelLiters,
        cost: calculatedFuelCost
      };
      
      const newFuelLogs = [newFuelLog, ...fuelLogs];
      setFuelLogs(newFuelLogs);
      setLocalStorageData('fuel_logs', newFuelLogs);

      const tollCost = Math.round(trip.plannedDistance * 3); // ₹3 per km toll
      const otherCost = Math.round(trip.plannedDistance * 1.5); // miscellaneous
      
      const newExpense: ExpenseLog = {
        id: 'E' + String(expenseLogs.length + 1).padStart(2, '0'),
        tripId: trip.id,
        vehicleReg: trip.vehicleReg,
        toll: tollCost,
        other: otherCost,
        maintLinked: 0,
        total: tollCost + otherCost
      };

      const newExpenses = [newExpense, ...expenseLogs];
      setExpenseLogs(newExpenses);
      setLocalStorageData('expenses', newExpenses);
    }
  };

  const handleAddMaintenanceRecord = (newRecord: MaintenanceRecord) => {
    // 1. Add record
    const updated = [newRecord, ...maintenanceRecords];
    setMaintenanceRecords(updated);
    setLocalStorageData('maintenance', updated);

    // 2. State Transition: If ticket is Active, transition vehicle status to 'In Shop'
    if (newRecord.status === 'Active') {
      const updatedVehicles = vehicles.map(v => 
        v.regNo === newRecord.vehicleReg ? { ...v, status: 'In Shop' as const } : v
      );
      setVehicles(updatedVehicles);
      setLocalStorageData('vehicles', updatedVehicles);
    }
  };

  const handleCompleteMaintenance = (recordId: string) => {
    const record = maintenanceRecords.find(r => r.id === recordId);
    if (!record) return;

    // 1. Update record status
    const updatedRecords = maintenanceRecords.map(r => 
      r.id === recordId ? { ...r, status: 'Completed' as const } : r
    );
    setMaintenanceRecords(updatedRecords);
    setLocalStorageData('maintenance', updatedRecords);

    // 2. State Transition: Release vehicle back to 'Available'
    const updatedVehicles = vehicles.map(v => 
      v.regNo === record.vehicleReg ? { ...v, status: 'Available' as const } : v
    );
    setVehicles(updatedVehicles);
    setLocalStorageData('vehicles', updatedVehicles);
  };

  const handleAddFuelLog = (newLog: FuelLog) => {
    const updated = [newLog, ...fuelLogs];
    setFuelLogs(updated);
    setLocalStorageData('fuel_logs', updated);
  };

  const handleAddExpenseLog = (newExpense: ExpenseLog) => {
    const updated = [newExpense, ...expenseLogs];
    setExpenseLogs(updated);
    setLocalStorageData('expenses', updated);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setLocalStorageData('settings', newSettings);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  // Get active roles permissions check
  const activePermissions = ROLE_PERMISSIONS.find(p => p.role === userRole)!;

  // View router based on active Tab and Permissions
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            vehicles={vehicles}
            drivers={drivers}
            trips={trips}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'fleet':
        return (
          <FleetRegistryView 
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            canEdit={activePermissions.fleet === 'Full'}
          />
        );
      case 'drivers':
        return (
          <DriversView 
            drivers={drivers}
            onAddDriver={handleAddDriver}
            onUpdateDriverStatus={handleUpdateDriverStatus}
            canEdit={activePermissions.driver === 'Full'}
          />
        );
      case 'trips':
        return (
          <TripDispatcher 
            vehicles={vehicles}
            drivers={drivers}
            trips={trips}
            onDispatchTrip={handleDispatchTrip}
            onUpdateTripStatus={handleUpdateTripStatus}
            canEdit={activePermissions.trip === 'Full'}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceView 
            vehicles={vehicles}
            maintenanceRecords={maintenanceRecords}
            onAddMaintenanceRecord={handleAddMaintenanceRecord}
            onCompleteMaintenance={handleCompleteMaintenance}
            canEdit={activePermissions.fleet === 'Full'} // Fleet manager has full control of maintenance
          />
        );
      case 'expenses':
        return (
          <FuelExpenseView 
            vehicles={vehicles}
            trips={trips}
            fuelLogs={fuelLogs}
            expenseLogs={expenseLogs}
            maintenanceCost={maintenanceRecords.reduce((acc, r) => acc + r.cost, 0)} // dynamic maintenance sum
            onAddFuelLog={handleAddFuelLog}
            onAddExpenseLog={handleAddExpenseLog}
            canEdit={activePermissions.fuelExpense === 'Full'}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            vehicles={vehicles}
            fuelLogs={fuelLogs}
            maintenanceRecords={maintenanceRecords}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            settings={settings}
            permissions={ROLE_PERMISSIONS}
            onSaveSettings={handleSaveSettings}
            canEdit={activePermissions.fleet === 'Full'} // Locked to Fleet manager
          />
        );
      default:
        return <div className="text-sm p-4 text-center">Section under active deployment.</div>;
    }
  };

  // 1. If not logged in, render the login panel (RBAC Persona selection)
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  // 2. Render Full ERP Dashboard Layout
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" id="odoo-app-container">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header navigation bar */}
        <Header 
          userRole={userRole}
          setUserRole={setUserRole}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Body content with custom scrollbars */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8" id="transitops-main-viewport">
          {renderActiveView()}
        </main>
      </div>

    </div>
  );
}
