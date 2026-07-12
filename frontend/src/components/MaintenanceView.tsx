/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Vehicle, MaintenanceRecord } from '../types';

interface MaintenanceViewProps {
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  onAddMaintenanceRecord: (record: MaintenanceRecord) => void;
  onCompleteMaintenance: (recordId: string) => void;
  canEdit: boolean;
}

export default function MaintenanceView({
  vehicles,
  maintenanceRecords,
  onAddMaintenanceRecord,
  onCompleteMaintenance,
  canEdit
}: MaintenanceViewProps) {
  // Form State
  const [vehicleReg, setVehicleReg] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [date, setDate] = useState('2026-07-11');
  const [maintStatus, setMaintStatus] = useState<'Active' | 'Completed'>('Active');
  
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Find non-retired vehicles for dropdown
  const allowedVehicles = vehicles.filter(v => v.status !== 'Retired');

  // Set default vehicle on load if not set
  React.useEffect(() => {
    if (allowedVehicles.length > 0 && !vehicleReg) {
      setVehicleReg(allowedVehicles[0].regNo);
    }
  }, [allowedVehicles, vehicleReg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!vehicleReg || !serviceType || cost <= 0 || !date) {
      setValidationError('Please fill in all service parameters correctly.');
      return;
    }

    const recordId = 'M' + String(maintenanceRecords.length + 1).padStart(2, '0');
    const newRecord: MaintenanceRecord = {
      id: recordId,
      vehicleReg,
      serviceType,
      cost,
      date,
      status: maintStatus
    };

    onAddMaintenanceRecord(newRecord);
    setSuccessMessage('Service Record logged and state synchronized successfully!');
    
    // reset form
    setServiceType('');
    setCost(0);
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6" id="maintenance-view">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">Fleet Maintenance Logs</h1>
        <p className="text-xs text-[#6B7280]">Log mechanical service, configure mechanical work orders, and trigger automatic asset status updates</p>
      </div>

      {/* State Machine Transition Guidelines Banner (Wireframe 5 Bottom Graphic) */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded p-4 text-xs">
        <h4 className="font-bold text-[#714B67] uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles size={14} />
          Automated ERP State Transition System
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-2 border-l-2 border-amber-400 pl-3">
            <div>
              <p className="font-semibold text-amber-700">Available ➔ In Shop (Active Maintenance)</p>
              <p className="text-[10px] text-gray-500">Creating a maintenance ticket automatically pulls the vehicle from the trip dispatch pool.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l-2 border-green-500 pl-3">
            <div>
              <p className="font-semibold text-green-700">In Shop ➔ Available (Record Completed)</p>
              <p className="text-[10px] text-gray-500">Marking a mechanical ticket as Completed immediately restores the vehicle to the ready-pool.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Log Service Record Form (Left - Span 2) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
              <Plus size={14} className="text-[#714B67]" />
              Log Mechanical Work
            </h3>

            {canEdit ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {validationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-xs flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{validationError}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-xs flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Vehicle Selection */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Select Vehicle <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    required
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="maint-vehicle-select"
                  >
                    {allowedVehicles.map(v => (
                      <option key={v.regNo} value={v.regNo}>
                        {v.name} ({v.type} - Current: {v.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Service Type / Task Description <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oil Change, Engine Repair, Brake Pad Replace"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="maint-service-type"
                  />
                </div>

                {/* Cost */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Service Cost (₹) <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="e.g. 2500"
                    value={cost || ''}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="maint-cost"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Service Logging Date <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>

                {/* Status selector */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Service Status Scope
                  </label>
                  <select
                    value={maintStatus}
                    onChange={(e) => setMaintStatus(e.target.value as any)}
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    <option value="Active">Active (Sends Vehicle to Shop)</option>
                    <option value="Completed">Completed (Vehicle remains Available)</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2 bg-[#714B67] hover:bg-[#5D3F56] text-white text-xs font-semibold rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
                  id="maint-save-btn"
                >
                  <Wrench size={14} />
                  <span>Log Service Ticket</span>
                </button>
              </form>
            ) : (
              <div className="text-xs text-gray-400 p-8 border border-dashed border-gray-200 rounded text-center">
                ⚠️ Service Log creation locked. Switch simulation role to <strong className="text-[#714B67]">Fleet Manager</strong> to edit.
              </div>
            )}
          </div>

          <div className="mt-4 bg-[#F6F7F9] p-3 rounded text-[11px] text-gray-500 border border-gray-100 flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <TrendingUp size={12} className="text-[#00A09D]" />
              Total Mechanical Cost:
            </span>
            <span className="font-bold text-[#2E2E2E] font-mono">
              ₹{maintenanceRecords.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Service Log list (Right - Span 3) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col lg:col-span-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
            <Wrench size={14} className="text-[#00A09D]" />
            Active Service Logs
          </h3>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F6F7F9] border-b border-gray-100 text-[#6B7280] text-[10px] font-bold uppercase">
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Service Type</th>
                  <th className="py-3 px-3">Cost (INR)</th>
                  <th className="py-3 px-3">Logged Date</th>
                  <th className="py-3 px-3">Status</th>
                  {canEdit && <th className="py-3 px-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
                {maintenanceRecords.length > 0 ? (
                  maintenanceRecords.map((record) => {
                    const vehicle = vehicles.find(v => v.regNo === record.vehicleReg);
                    const isActive = record.status === 'Active';

                    return (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-semibold">
                          <div className="flex flex-col">
                            <span>{vehicle ? vehicle.name : '—'}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{record.vehicleReg}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-700">{record.serviceType}</td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-600">₹{record.cost.toLocaleString()}</td>
                        <td className="py-3 px-3 text-gray-500 font-mono">{record.date}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            isActive 
                              ? 'bg-amber-100 text-amber-800 border-amber-200' 
                              : 'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {isActive ? 'In Shop' : 'Completed'}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="py-3 px-3 text-right">
                            {isActive ? (
                              <button
                                onClick={() => onCompleteMaintenance(record.id)}
                                className="text-[10px] bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-bold px-2 py-1 rounded transition-colors"
                                title="Mark service complete and restore vehicle status to Available"
                              >
                                Mark Ready
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium">Archived</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={canEdit ? 6 : 5} className="py-8 text-center text-gray-400 text-xs">
                      No mechanical records logged in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
