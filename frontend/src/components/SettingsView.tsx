/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Check, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppSettings, RolePermission } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  permissions: RolePermission[];
  onSaveSettings: (settings: AppSettings) => void;
  canEdit: boolean;
}

export default function SettingsView({
  settings,
  permissions,
  onSaveSettings,
  canEdit
}: SettingsViewProps) {
  // Local Form state
  const [depotName, setDepotName] = useState(settings.depotName);
  const [currency, setCurrency] = useState(settings.currency);
  const [distanceUnit, setDistanceUnit] = useState(settings.distanceUnit);
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depotName || !currency || !distanceUnit) return;
    
    onSaveSettings({
      depotName,
      currency,
      distanceUnit
    });
    
    setSuccessMessage('General parameters updated successfully!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const getBadgeStyle = (perm: 'Full' | 'View' | 'None') => {
    switch (perm) {
      case 'Full':
        return 'bg-green-100 text-green-800 border-green-200 font-bold';
      case 'View':
        return 'bg-blue-100 text-blue-800 border-blue-200 font-medium';
      case 'None':
        return 'bg-gray-100 text-gray-400 border-gray-100 font-medium';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="space-y-6" id="settings-view">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">System Settings & RBAC</h1>
        <p className="text-xs text-[#6B7280]">Configure depot operational profiles and audit enterprise security roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* General Settings Panel (Left - Span 2) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
            <Settings size={14} className="text-[#714B67]" />
            General Parameters
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-xs flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 size={14} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Depot Name */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">Depot Name</label>
              <input
                type="text"
                disabled={!canEdit}
                value={depotName}
                onChange={(e) => setDepotName(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#714B67] disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Currency */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">System Currency Prefix</label>
              <input
                type="text"
                disabled={!canEdit}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#714B67] disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Distance Unit */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">Distance Unit</label>
              <input
                type="text"
                disabled={!canEdit}
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#714B67] disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Save Button */}
            {canEdit ? (
              <button
                type="submit"
                className="w-full py-2 bg-[#714B67] hover:bg-[#5D3F56] text-white text-xs font-semibold rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
                id="save-settings-btn"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-2.5 rounded text-[11px] text-amber-800 flex items-start gap-1.5">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Depot settings lock. Switch simulation role to <strong className="text-[#714B67]">Fleet Manager</strong> to update parameters.</span>
              </div>
            )}
          </form>
        </div>

        {/* Role-Based Access Control (RBAC) Matrix Table (Right - Span 3) */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 lg:col-span-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
            <Shield size={14} className="text-[#00A09D]" />
            Role-Based Access (RBAC) Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F6F7F9] border-b border-gray-200 text-[#6B7280] text-[10px] font-bold uppercase">
                  <th className="py-3 px-3">Role Profile</th>
                  <th className="py-3 px-3 text-center">Fleet</th>
                  <th className="py-3 px-3 text-center">Drivers</th>
                  <th className="py-3 px-3 text-center">Trips</th>
                  <th className="py-3 px-3 text-center">Fuel/Exp</th>
                  <th className="py-3 px-3 text-center">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
                {permissions.map((p) => (
                  <tr key={p.role} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-900">{p.role}</td>
                    
                    {/* Fleet */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(p.fleet)}`}>
                        {p.fleet === 'Full' ? '✓ Full' : p.fleet}
                      </span>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(p.driver)}`}>
                        {p.driver === 'Full' ? '✓ Full' : p.driver}
                      </span>
                    </td>

                    {/* Trip */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(p.trip)}`}>
                        {p.trip === 'Full' ? '✓ Full' : p.trip}
                      </span>
                    </td>

                    {/* Fuel/Exp */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(p.fuelExpense)}`}>
                        {p.fuelExpense === 'Full' ? '✓ Full' : p.fuelExpense}
                      </span>
                    </td>

                    {/* Analytics */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(p.analytics)}`}>
                        {p.analytics === 'Full' ? '✓ Full' : p.analytics}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-[#F6F7F9] p-3 rounded text-[11px] text-gray-500 border border-gray-100 space-y-1">
            <strong>Odoo ERP Access Guideline:</strong>
            <p>Access scopes are fully hardcoded and enforced on page routes. Unprivileged pages are completely redacted from the left sidebar to prevent core database overrides.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
