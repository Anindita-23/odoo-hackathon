/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Search, Users, ShieldAlert, AlertTriangle, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';
import { Driver, DriverStatus } from '../types';

interface DriversViewProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => boolean;
  onUpdateDriverStatus: (id: string, status: DriverStatus) => void;
  canEdit: boolean;
}

export default function DriversView({ drivers, onAddDriver, onUpdateDriverStatus, canEdit }: DriversViewProps) {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    licenseNo: '',
    category: 'LMV',
    expiry: '',
    contact: '',
    tripCompl: 100,
    safety: 100,
    status: 'Available'
  });
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Helper to parse expiry date and check if it's expired
  // Expiry is in format MM/YYYY
  const isLicenseExpired = (expiryStr: string) => {
    if (!expiryStr) return false;
    try {
      const parts = expiryStr.split('/');
      if (parts.length !== 2) return false;
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      
      // Current date is July 2026
      const currentYear = 2026;
      const currentMonth = 7;

      if (year < currentYear) return true;
      if (year === currentYear && month < currentMonth) return true;
      return false;
    } catch {
      return false;
    }
  };

  // Filtered list
  const filteredDrivers = drivers.filter(driver => {
    const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.contact.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeStyle = (status: DriverStatus, isExpired: boolean) => {
    if (isExpired) return 'bg-red-100 text-red-800 border-red-200';
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'On Trip':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Off Duty':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Suspended':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!newDriver.name || !newDriver.licenseNo || !newDriver.expiry || !newDriver.contact) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    // Simple license expiry format validation (MM/YYYY)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!expiryRegex.test(newDriver.expiry)) {
      setValidationError('Expiry Date must be in MM/YYYY format (e.g. 12/2028).');
      return;
    }

    const driverToSubmit: Driver = {
      id: 'D' + String(drivers.length + 1).padStart(2, '0'),
      name: newDriver.name,
      licenseNo: newDriver.licenseNo.toUpperCase(),
      category: newDriver.category as any,
      expiry: newDriver.expiry,
      contact: newDriver.contact,
      tripCompl: Number(newDriver.tripCompl) || 100,
      safety: Number(newDriver.safety) || 100,
      status: (newDriver.status || 'Available') as DriverStatus
    };

    const success = onAddDriver(driverToSubmit);
    if (success) {
      setSuccessMessage('Driver Profile created in Odoo Registry!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
        setNewDriver({
          name: '',
          licenseNo: '',
          category: 'LMV',
          expiry: '',
          contact: '',
          tripCompl: 100,
          safety: 100,
          status: 'Available'
        });
      }, 1500);
    } else {
      setValidationError('Failed to register driver. Profile database conflict.');
    }
  };

  return (
    <div className="space-y-6" id="drivers-registry-view">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">Drivers & Safety Profiles</h1>
          <p className="text-xs text-[#6B7280]">Manage personnel listings, check compliance statuses, and track road safety statistics</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#714B67] hover:bg-[#5D3F56] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-all"
            id="add-driver-btn"
          >
            <Plus size={16} />
            <span>Add Driver</span>
          </button>
        )}
      </div>

      {/* Safety Rule Banner */}
      <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-xs flex items-start gap-2">
        <ShieldAlert size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold">Odoo Security Compliance Rule:</strong>
          <p>Any driver with an <strong className="underline">Expired License</strong> (relative to current date Jul 2026) or status flagged as <strong className="underline">Suspended</strong> is immediately blocked from trip planning and dispatcher vehicle locks.</p>
        </div>
      </div>

      {/* Filter and Quick Controls */}
      <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm" id="driver-controls">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver name, license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#714B67] w-full"
              id="driver-search"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#714B67] bg-white"
            id="driver-status-filter"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Quick legend info */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#22C55E]" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#3B82F6]" /> On Trip</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-400" /> Off Duty</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#F59E0B]" /> Suspended</span>
        </div>
      </div>

      {/* Main Table list */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden" id="driver-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F7F9] border-b border-gray-200 text-[#6B7280] text-[10px] font-bold uppercase">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">License No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Trip Compl. %</th>
                <th className="py-3 px-4 text-center">Safety Rating</th>
                <th className="py-3 px-4">Compliance Status</th>
                {canEdit && <th className="py-3 px-4 text-right">Quick Toggle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => {
                  const isExpired = isLicenseExpired(driver.expiry);
                  const isSuspended = driver.status === 'Suspended';
                  const hasViolation = isExpired || isSuspended;

                  return (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#714B67] font-bold">
                          {driver.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{driver.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">ID: {driver.id}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-600">{driver.licenseNo}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                          {driver.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1">
                          <span className={isExpired ? 'text-[#EF4444] font-bold' : ''}>
                            {driver.expiry}
                          </span>
                          {isExpired && (
                            <span className="bg-red-100 text-red-800 text-[9px] px-1 rounded-sm font-bold animate-pulse">
                              EXPIRED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono">{driver.contact}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${driver.tripCompl >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
                              style={{ width: `${driver.tripCompl}%` }}
                            />
                          </div>
                          <span className="font-bold">{driver.tripCompl}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#00A09D]">
                          <ShieldCheck size={14} className={driver.safety >= 90 ? 'text-[#00A09D]' : 'text-amber-500'} />
                          <span className="font-bold">{driver.safety}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {hasViolation ? (
                          <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Blocked (Non-Compliant)
                          </span>
                        ) : (
                          <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <UserCheck size={10} />
                            Ready (Active)
                          </span>
                        )}
                      </td>
                      {canEdit && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex rounded-md shadow-xs text-[10px] border border-gray-200 overflow-hidden">
                            {(['Available', 'Off Duty', 'Suspended'] as DriverStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => onUpdateDriverStatus(driver.id, st)}
                                className={`px-2 py-1 font-semibold transition-all ${
                                  driver.status === st
                                    ? st === 'Available'
                                      ? 'bg-green-600 text-white'
                                      : st === 'Suspended'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-gray-600 text-white'
                                    : 'bg-white hover:bg-gray-50 text-gray-600'
                                } border-r border-gray-100 last:border-0`}
                                title={`Set ${st}`}
                              >
                                {st.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={canEdit ? 9 : 8} className="py-12 text-center text-gray-400 text-sm">
                    No drivers registered or matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#714B67] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Users size={16} />
                Create Driver Safety Profile
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
                  <ShieldAlert size={14} className="flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-2.5 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">
                  Full Driver Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  id="new-driver-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* License No */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    License Number <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DL-88213"
                    value={newDriver.licenseNo}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNo: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-driver-license"
                  />
                </div>

                {/* License Category */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    License Category
                  </label>
                  <select
                    value={newDriver.category}
                    onChange={(e) => setNewDriver({ ...newDriver, category: e.target.value as any })}
                    className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-driver-category"
                  >
                    <option value="LMV">LMV (Light Motor Vehicle)</option>
                    <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    License Expiry (MM/YYYY) <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/2028"
                    value={newDriver.expiry}
                    onChange={(e) => setNewDriver({ ...newDriver, expiry: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-driver-expiry"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5">Note: Expiring before 07/2026 locks driver</span>
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Contact Number <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="98765xxxxx"
                    value={newDriver.contact}
                    onChange={(e) => setNewDriver({ ...newDriver, contact: e.target.value })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                    id="new-driver-contact"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Trip Completion */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Initial Trip Compl. %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="95"
                    value={newDriver.tripCompl}
                    onChange={(e) => setNewDriver({ ...newDriver, tripCompl: Number(e.target.value) })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>

                {/* Safety Rating */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Initial Safety Rating %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="97"
                    value={newDriver.safety}
                    onChange={(e) => setNewDriver({ ...newDriver, safety: Number(e.target.value) })}
                    className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              {/* Initial Status */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">
                  Active Duty Status
                </label>
                <select
                  value={newDriver.status}
                  onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value as any })}
                  className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  id="new-driver-status"
                >
                  <option value="Available">Available</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 font-semibold text-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#714B67] hover:bg-[#5D3F56] font-semibold text-white transition-all shadow-sm"
                  id="submit-driver-btn"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
