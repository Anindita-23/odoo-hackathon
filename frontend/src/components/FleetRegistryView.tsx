/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Search, Car, AlertCircle, CheckCircle2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types';

interface FleetRegistryViewProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => boolean; // returns true if successful
  canEdit: boolean; // role permission check
}

export default function FleetRegistryView({ vehicles, onAddVehicle, canEdit }: FleetRegistryViewProps) {
  // Filters & State
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sorting State
  const [sortBy, setSortBy] = useState<keyof Vehicle>('regNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    regNo: '',
    name: '',
    type: 'Van',
    capacity: '',
    capacityKg: 500,
    odometer: 0,
    acqCost: 0,
    status: 'Available'
  });
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Sort
  const handleSort = (field: keyof Vehicle) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted vehicles
  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      const matchesSearch = 
        vehicle.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.capacity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      }
    });

  // Handle adding vehicle
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!newVehicle.regNo || !newVehicle.name || !newVehicle.capacity) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    // Reg No format validation
    const regRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/i;
    if (newVehicle.regNo.length < 5) {
      setValidationError('Registration Number must be valid (e.g. GJ01AB4521).');
      return;
    }

    // Parse weight for validation rules
    let calculatedKg = 500;
    const cleanCap = newVehicle.capacity.toLowerCase();
    if (cleanCap.includes('ton')) {
      calculatedKg = parseFloat(cleanCap) * 1000;
    } else {
      calculatedKg = parseFloat(cleanCap) || 500;
    }

    const vehicleToSubmit: Vehicle = {
      regNo: newVehicle.regNo.toUpperCase().replace(/\s/g, ''),
      name: newVehicle.name.toUpperCase(),
      type: newVehicle.type as any,
      capacity: newVehicle.capacity,
      capacityKg: calculatedKg,
      odometer: Number(newVehicle.odometer) || 0,
      acqCost: Number(newVehicle.acqCost) || 0,
      status: (newVehicle.status || 'Available') as VehicleStatus
    };

    const success = onAddVehicle(vehicleToSubmit);
    if (success) {
      setSuccessMessage('Vehicle added to Odoo Registry successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
        setNewVehicle({
          regNo: '',
          name: '',
          type: 'Van',
          capacity: '',
          capacityKg: 500,
          odometer: 0,
          acqCost: 0,
          status: 'Available'
        });
      }, 1500);
    } else {
      setValidationError('Registration Number must be unique. GJ Code conflict in database.');
    }
  };

  // Status badge style helper
  const getStatusBadgeStyle = (status: VehicleStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'On Trip':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Shop':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6" id="fleet-registry-view">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">Vehicle Registry</h1>
          <p className="text-xs text-[#6B7280]">Add, monitor, and configure active depot transport assets</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#714B67] hover:bg-[#5D3F56] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-all"
            id="add-vehicle-btn"
          >
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Constraints Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded p-3 text-xs flex items-start gap-2">
        <AlertCircle size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold">Odoo Dispatch Rule Block:</strong>
          <p>Registration No. must be strictly unique. Retired or In Shop (Maintenance) vehicles are automatically filtered and blocked from the Active Trip Dispatch pool.</p>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm" id="fleet-controls">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search registration or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#714B67] w-full"
              id="vehicle-search"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#714B67] bg-white"
            id="vehicle-type-filter"
          >
            <option value="All">All Types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Mini">Mini</option>
            <option value="Sedan">Sedan</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#714B67] bg-white"
            id="vehicle-status-filter"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-[#2E2E2E]">{filteredVehicles.length}</span> of {vehicles.length} vehicles
        </div>
      </div>

      {/* Main Table List View */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden" id="vehicle-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F7F9] border-b border-gray-200 text-[#6B7280] text-[10px] font-bold uppercase select-none">
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('regNo')}>
                  <div className="flex items-center gap-1">
                    <span>Reg. No (Unique)</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Name / Model</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">
                    <span>Type</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('odometer')}>
                  <div className="flex items-center gap-1">
                    <span>Odometer</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('acqCost')}>
                  <div className="flex items-center gap-1">
                    <span>Acq. Cost</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.regNo} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{vehicle.regNo}</td>
                    <td className="py-3 px-4 font-semibold">{vehicle.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                        {vehicle.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{vehicle.capacity}</td>
                    <td className="py-3 px-4 font-mono font-medium">{vehicle.odometer.toLocaleString()} km</td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-600">₹{vehicle.acqCost.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No vehicles found in Odoo Registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Dialog Modal for Adding Vehicles */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#714B67] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Car size={16} />
                Add New Transit Asset
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-2.5 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Registration Number */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Registration No <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="GJ01AB4521"
                    value={newVehicle.regNo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, regNo: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-reg"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5">Format: GJ##AA####</span>
                </div>

                {/* Name / Model */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Asset Model Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VAN-05"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-name"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5">e.g., TRUCK-12, VAN-09</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-type"
                  >
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Mini">Mini</option>
                    <option value="Sedan">Sedan</option>
                  </select>
                </div>

                {/* Capacity */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Display Capacity <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 kg, 5 Ton"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-capacity"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5">Used for dispatch threshold validation</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Initial Odometer */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Initial Odometer (km)
                  </label>
                  <input
                    type="number"
                    placeholder="74000"
                    value={newVehicle.odometer}
                    onChange={(e) => setNewVehicle({ ...newVehicle, odometer: Number(e.target.value) })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-odometer"
                  />
                </div>

                {/* Acquisition Cost */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Acquisition Cost (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="620000"
                    value={newVehicle.acqCost}
                    onChange={(e) => setNewVehicle({ ...newVehicle, acqCost: Number(e.target.value) })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-vehicle-cost"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">
                  Initial Registry Status
                </label>
                <select
                  value={newVehicle.status}
                  onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value as any })}
                  className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  id="new-vehicle-status"
                >
                  <option value="Available">Available</option>
                  <option value="In Shop">In Shop (Maintenance)</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 font-semibold text-gray-600 transition-all"
                  id="close-modal-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#714B67] hover:bg-[#5D3F56] font-semibold text-white transition-all shadow-sm"
                  id="submit-vehicle-btn"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
