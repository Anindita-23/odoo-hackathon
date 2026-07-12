/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Route, 
  Car, 
  Users, 
  Scale, 
  ArrowRight, 
  Plus, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MapPin,
  Compass
} from 'lucide-react';
import { Vehicle, Driver, Trip, TripStatus } from '../types';

interface TripDispatcherProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  onDispatchTrip: (trip: Trip) => void;
  onUpdateTripStatus: (tripId: string, status: TripStatus) => void;
  canEdit: boolean;
}

export default function TripDispatcher({ 
  vehicles, 
  drivers, 
  trips, 
  onDispatchTrip, 
  onUpdateTripStatus,
  canEdit 
}: TripDispatcherProps) {
  // Form State
  const [source, setSource] = useState('Gandhinagar Depot');
  const [destination, setDestination] = useState('');
  const [selectedVehicleReg, setSelectedVehicleReg] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [plannedDistance, setPlannedDistance] = useState<number>(0);

  // Verification & Rule States
  const [capacityError, setCapacityError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Populate first available vehicle/driver on load
  const isLicenseExpired = (expiryStr: string) => {
    if (!expiryStr) return false;
    try {
      const parts = expiryStr.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      return year < 2026 || (year === 2026 && month < 7);
    } catch { return false; }
  };

  // Filter available vehicles (Available only. Retired or In Shop are hidden)
  const availableVehicles = vehicles.filter(v => v.status === 'Available');

  // Filter available drivers (Available only. Suspended or Expired are blocked)
  const availableDrivers = drivers.filter(d => 
    d.status === 'Available' && !isLicenseExpired(d.expiry)
  );

  useEffect(() => {
    if (availableVehicles.length > 0 && !selectedVehicleReg) {
      setSelectedVehicleReg(availableVehicles[0].regNo);
    }
  }, [availableVehicles, selectedVehicleReg]);

  useEffect(() => {
    if (availableDrivers.length > 0 && !selectedDriverId) {
      setSelectedDriverId(availableDrivers[0].id);
    }
  }, [availableDrivers, selectedDriverId]);

  // Sync selected vehicle details for capacity check
  useEffect(() => {
    const vehicle = vehicles.find(v => v.regNo === selectedVehicleReg) || null;
    setSelectedVehicle(vehicle);
    
    if (vehicle && cargoWeight > 0) {
      if (cargoWeight > vehicle.capacityKg) {
        const excess = cargoWeight - vehicle.capacityKg;
        setCapacityError(`Vehicle Capacity: ${vehicle.capacity} (${vehicle.capacityKg} kg)\nCargo Weight: ${cargoWeight} kg\n❌ Capacity exceeded by ${excess} kg — dispatch blocked`);
      } else {
        setCapacityError('');
      }
    } else {
      setCapacityError('');
    }
  }, [selectedVehicleReg, cargoWeight, vehicles]);

  // Handle Dispatch submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !selectedVehicleReg || !selectedDriverId || cargoWeight <= 0 || plannedDistance <= 0) {
      alert('Please fill out all operational fields correctly.');
      return;
    }

    if (selectedVehicle && cargoWeight > selectedVehicle.capacityKg) {
      return; // blocked
    }

    const tripId = 'TR' + String(trips.length + 1).padStart(3, '0');
    const newTrip: Trip = {
      id: tripId,
      source,
      destination,
      vehicleReg: selectedVehicleReg,
      driverId: selectedDriverId,
      cargoWeight,
      plannedDistance,
      status: 'Dispatched',
      eta: `${Math.round(plannedDistance * 1.5)} min`, // dynamic realistic ETA calculation
      date: '2026-07-11'
    };

    onDispatchTrip(newTrip);
    
    // Clear form entries or set to defaults
    setDestination('');
    setCargoWeight(0);
    setPlannedDistance(0);
    setSelectedVehicleReg('');
    setSelectedDriverId('');
    setCapacityError('');
  };

  // Badge helper
  const getStatusBadgeStyle = (status: TripStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6" id="trip-dispatcher-view">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">Trip Dispatcher</h1>
        <p className="text-xs text-[#6B7280]">Plan routes, assign drivers, verify load limits, and coordinate active shipments</p>
      </div>

      {/* Trip Lifecycle Timeline (Wireframe 4 Top Element) */}
      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Trip Operational Lifecycle</span>
        <div className="flex items-center w-full max-w-lg justify-between relative px-2">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          
          {/* Draft dot */}
          <div className="flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-700 shadow-sm">
              01
            </div>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Draft</span>
          </div>

          {/* Dispatched dot */}
          <div className="flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-[#3B82F6] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
              02
            </div>
            <span className="text-[10px] font-bold text-[#3B82F6] mt-1 uppercase">Dispatched</span>
          </div>

          {/* Completed dot */}
          <div className="flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-[#22C55E] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              03
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] mt-1 uppercase">Completed</span>
          </div>

          {/* Cancelled dot */}
          <div className="flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-red-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              04
            </div>
            <span className="text-[10px] font-bold text-red-400 mt-1 uppercase">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Dispatch Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Create Trip Form Panel (Span 2) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Plus size={14} className="text-[#714B67]" />
              Create Transit Trip
            </h3>

            {canEdit ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Source Depot */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Source Location <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gandhinagar Depot"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] w-full"
                    />
                  </div>
                </div>

                {/* Destination Hub */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Destination Location <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <Compass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surat Terminal or Ahmedabad Hub"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] w-full"
                    />
                  </div>
                </div>

                {/* Vehicle Selection (Available Only) */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Vehicle Assigned (Available Only) <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    value={selectedVehicleReg}
                    onChange={(e) => setSelectedVehicleReg(e.target.value)}
                    required
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    {availableVehicles.length > 0 ? (
                      availableVehicles.map(v => (
                        <option key={v.regNo} value={v.regNo}>
                          {v.name} ({v.type} - Max Cap: {v.capacity}) - {v.regNo}
                        </option>
                      ))
                    ) : (
                      <option value="">⚠️ No Available Vehicles in Registry</option>
                    )}
                  </select>
                </div>

                {/* Driver Selection (Available Only) */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Driver Assigned (Active & Compliant) <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    required
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    {availableDrivers.length > 0 ? (
                      availableDrivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.category} - Safety: {d.safety}%) - ID: {d.id}
                        </option>
                      ))
                    ) : (
                      <option value="">⚠️ No Compliant Available Drivers</option>
                    )}
                  </select>
                </div>

                {/* Weight and Distance */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Cargo Weight */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">
                      Cargo Weight (kg) <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="450"
                      value={cargoWeight || ''}
                      onChange={(e) => setCargoWeight(Number(e.target.value))}
                      className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    />
                  </div>

                  {/* Planned Distance */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">
                      Planned Distance (km) <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="45"
                      value={plannedDistance || ''}
                      onChange={(e) => setPlannedDistance(Number(e.target.value))}
                      className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    />
                  </div>
                </div>

                {/* Capacity Error Block (Visual feedback on exceeding limit) */}
                {capacityError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle size={14} className="text-[#EF4444]" />
                      Dispatch Blocked!
                    </div>
                    <pre className="font-sans text-[11px] whitespace-pre-wrap">{capacityError}</pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!!capacityError || availableVehicles.length === 0 || availableDrivers.length === 0}
                    className={`flex-1 py-2 rounded text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      capacityError || availableVehicles.length === 0 || availableDrivers.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#714B67] hover:bg-[#5D3F56]'
                    }`}
                  >
                    <Play size={14} />
                    <span>Dispatch Trip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDestination('');
                      setCargoWeight(0);
                      setPlannedDistance(0);
                    }}
                    className="px-4 py-2 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-xs text-gray-400 p-8 border border-dashed border-gray-200 rounded text-center">
                ⚠️ Trip Creation locked. Switch simulation role to <strong className="text-[#714B67]">Dispatcher</strong> or <strong className="text-[#714B67]">Safety Officer</strong> to edit.
              </div>
            )}
          </div>

          <div className="mt-4 bg-[#F6F7F9] p-3 rounded text-[11px] text-gray-500 border border-gray-100 space-y-1">
            <strong>Odoo ERP Dispatch Guide:</strong>
            <p>1. Vehicles in Maintenance (In Shop) are hidden.</p>
            <p>2. Drivers with safety suspensions are locked.</p>
            <p>3. Automatic overload calculations protect vehicle chassis lifespans.</p>
          </div>
        </div>

        {/* Live Board Active Trips Panel (Span 3) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col lg:col-span-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
            <Compass size={14} className="text-[#00A09D]" />
            Live Shipment Board
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {trips.length > 0 ? (
              trips.map(trip => {
                const vehicle = vehicles.find(v => v.regNo === trip.vehicleReg);
                const driver = drivers.find(d => d.id === trip.driverId);
                const isDispatched = trip.status === 'Dispatched';

                return (
                  <div 
                    key={trip.id} 
                    className="border border-gray-200 rounded-md p-3.5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between gap-3"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#714B67] text-sm">{trip.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeStyle(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">ETA: <strong className="text-[#2E2E2E]">{trip.eta}</strong></span>
                    </div>

                    {/* Middle Details: Route & Vehicle */}
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
                        <span>{trip.source}</span>
                        <ArrowRight size={12} className="text-gray-400" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 mt-2 bg-[#F6F7F9] p-2 rounded">
                        <div className="flex items-center gap-1">
                          <Car size={12} className="text-[#714B67]" />
                          <span className="truncate">{vehicle ? `${vehicle.name} (${vehicle.regNo})` : 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-[#00A09D]" />
                          <span className="truncate">Driver: {driver ? driver.name : 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Scale size={12} className="text-gray-400" />
                          <span>Load: {trip.cargoWeight} kg</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Compass size={12} className="text-gray-400" />
                          <span>Dist: {trip.plannedDistance} km</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Complete, Cancel */}
                    {canEdit && isDispatched && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-[10px]">
                        <button
                          onClick={() => onUpdateTripStatus(trip.id, 'Completed')}
                          className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-2 py-1 rounded font-bold transition-all"
                        >
                          <CheckCircle size={10} />
                          <span>Log Completion</span>
                        </button>
                        <button
                          onClick={() => onUpdateTripStatus(trip.id, 'Cancelled')}
                          className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-2 py-1 rounded font-bold transition-all"
                        >
                          <XCircle size={10} />
                          <span>Cancel Trip</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                No active or scheduled shipments found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
