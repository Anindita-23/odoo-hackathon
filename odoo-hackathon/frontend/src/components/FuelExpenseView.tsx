/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Fuel, Coins, Plus, AlertCircle, CheckCircle2, TrendingUp, Sparkles, Scale } from 'lucide-react';
import { Vehicle, FuelLog, ExpenseLog, Trip } from '../types';

interface FuelExpenseViewProps {
  vehicles: Vehicle[];
  trips: Trip[];
  fuelLogs: FuelLog[];
  expenseLogs: ExpenseLog[];
  maintenanceCost: number; // passed from parent
  onAddFuelLog: (log: FuelLog) => void;
  onAddExpenseLog: (expense: ExpenseLog) => void;
  canEdit: boolean;
}

export default function FuelExpenseView({
  vehicles,
  trips,
  fuelLogs,
  expenseLogs,
  maintenanceCost,
  onAddFuelLog,
  onAddExpenseLog,
  canEdit
}: FuelExpenseViewProps) {
  // Modal States
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Forms State
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelDate, setFuelDate] = useState('2026-07-11');
  const [fuelLiters, setFuelLiters] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);

  const [expenseTrip, setExpenseTrip] = useState('');
  const [expenseVehicle, setExpenseVehicle] = useState('');
  const [expenseToll, setExpenseToll] = useState<number>(0);
  const [expenseOther, setExpenseOther] = useState<number>(0);

  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdowns setup
  const nonRetiredVehicles = vehicles.filter(v => v.status !== 'Retired');

  React.useEffect(() => {
    if (nonRetiredVehicles.length > 0 && !fuelVehicle) {
      setFuelVehicle(nonRetiredVehicles[0].regNo);
    }
    if (nonRetiredVehicles.length > 0 && !expenseVehicle) {
      setExpenseVehicle(nonRetiredVehicles[0].regNo);
    }
  }, [nonRetiredVehicles, fuelVehicle, expenseVehicle]);

  // Dynamic Calculations
  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.cost, 0);
  const totalTolls = expenseLogs.reduce((acc, curr) => acc + curr.toll, 0);
  const totalOtherExpenses = expenseLogs.reduce((acc, curr) => acc + curr.other, 0);
  
  // Total Operational Cost is: Fuel Logs + Maintenance Cost (from completed/active records) + Tolls + Other
  const totalOperationalCost = totalFuelCost + maintenanceCost + totalTolls + totalOtherExpenses;

  // Handlers
  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!fuelVehicle || fuelLiters <= 0 || fuelCost <= 0 || !fuelDate) {
      setValidationError('Please enter valid fuel log parameters.');
      return;
    }

    const newLog: FuelLog = {
      id: 'F' + String(fuelLogs.length + 1).padStart(2, '0'),
      vehicleReg: fuelVehicle,
      date: fuelDate,
      liters: fuelLiters,
      cost: fuelCost
    };

    onAddFuelLog(newLog);
    setSuccessMessage('Fuel Consumption record successfully logged!');
    setFuelLiters(0);
    setFuelCost(0);

    setTimeout(() => {
      setIsFuelModalOpen(false);
      setSuccessMessage('');
    }, 1500);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!expenseVehicle || expenseToll < 0 || expenseOther < 0) {
      setValidationError('Please enter valid expense cost values.');
      return;
    }

    // Try linking maintenance cost if applicable
    const linkedMaint = 0; // standard custom linked maint is 0 unless defined

    const newExpense: ExpenseLog = {
      id: 'E' + String(expenseLogs.length + 1).padStart(2, '0'),
      tripId: expenseTrip || 'UNLINKED',
      vehicleReg: expenseVehicle,
      toll: expenseToll,
      other: expenseOther,
      maintLinked: linkedMaint,
      total: expenseToll + expenseOther + linkedMaint
    };

    onAddExpenseLog(newExpense);
    setSuccessMessage('Expense successfully logged and added to Ledger.');
    setExpenseToll(0);
    setExpenseOther(0);
    setExpenseTrip('');

    setTimeout(() => {
      setIsExpenseModalOpen(false);
      setSuccessMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-6" id="fuel-expenses-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2E2E2E] tracking-tight">Fuel & Expense Management</h1>
          <p className="text-xs text-[#6B7280]">Consolidate fuel, maintenance tickets, tolls, and miscellaneous transport costs</p>
        </div>
        
        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setValidationError('');
                setSuccessMessage('');
                setIsFuelModalOpen(true);
              }}
              className="flex items-center gap-1 bg-[#714B67] hover:bg-[#5D3F56] text-white text-xs font-semibold px-3 py-2 rounded shadow-sm transition-all"
              id="log-fuel-btn"
            >
              <Plus size={14} />
              <span>Log Fuel</span>
            </button>
            <button
              onClick={() => {
                setValidationError('');
                setSuccessMessage('');
                setIsExpenseModalOpen(true);
              }}
              className="flex items-center gap-1 border border-[#714B67] text-[#714B67] hover:bg-gray-50 text-xs font-semibold px-3 py-2 rounded transition-all"
              id="add-expense-btn"
            >
              <Plus size={14} />
              <span>Add Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Fuel Logs & Other Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fuel Logs Panel */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
              <Fuel size={14} className="text-[#714B67]" />
              Fuel Logs
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F7F9] border-b border-gray-100 text-[#6B7280] text-[10px] font-bold uppercase">
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Logging Date</th>
                    <th className="py-2.5 px-3 text-center">Fuel Liters</th>
                    <th className="py-2.5 px-3 text-right">Fuel Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
                  {fuelLogs.map(log => {
                    const vehicle = vehicles.find(v => v.regNo === log.vehicleReg);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-semibold">
                          <span>{vehicle ? vehicle.name : '—'}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">{log.vehicleReg}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 font-mono">{log.date}</td>
                        <td className="py-3 px-3 text-center font-semibold text-gray-700">{log.liters} L</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#714B67]">₹{log.cost.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Subtotal Fuel Cost:</span>
            <span className="font-bold text-[#2E2E2E] font-mono">₹{totalFuelCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Other Expenses Panel */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
              <Coins size={14} className="text-[#00A09D]" />
              Other Expenses (Toll / Misc)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F7F9] border-b border-gray-100 text-[#6B7280] text-[10px] font-bold uppercase">
                    <th className="py-2.5 px-3">Trip Link</th>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3 text-center">Toll Fee</th>
                    <th className="py-2.5 px-3 text-center">Other/Misc</th>
                    <th className="py-2.5 px-3 text-center">Maint. Linked</th>
                    <th className="py-2.5 px-3 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-[#2E2E2E]">
                  {expenseLogs.map(exp => {
                    const vehicle = vehicles.find(v => v.regNo === exp.vehicleReg);
                    return (
                      <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#714B67]">{exp.tripId}</td>
                        <td className="py-3 px-3 font-semibold">{vehicle ? vehicle.name : 'Unlinked'}</td>
                        <td className="py-3 px-3 text-center font-mono">₹{exp.toll.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center font-mono">₹{exp.other.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center font-mono text-gray-400">
                          {exp.maintLinked > 0 ? `₹${exp.maintLinked.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-800">₹{exp.total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Subtotal Transit Expenses:</span>
            <span className="font-bold text-[#2E2E2E] font-mono">₹{(totalTolls + totalOtherExpenses).toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Dynamic Total Operational Cost Banner (Wireframe 6 Bottom Summary) */}
      <div className="bg-[#714B67] text-white rounded-md p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4" id="operational-cost-banner">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-full">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">TOTAL OPERATIONAL COST (AUTO)</h3>
            <p className="text-[11px] text-white/70 font-mono">Formula: Fuel Costs + Maintenance + Tolls + Misc Logistics Costs</p>
          </div>
        </div>
        
        <div className="text-center sm:text-right">
          <span className="text-2xl font-bold font-mono">₹{totalOperationalCost.toLocaleString()}</span>
          <span className="text-[10px] block font-mono text-green-300">Auto-aggregated and compiled from Odoo live transactions</span>
        </div>
      </div>

      {/* Log Fuel Modal Form */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#714B67] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Fuel size={14} />
                Log Fuel Entry
              </h3>
              <button onClick={() => setIsFuelModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded">✕</button>
            </div>
            <form onSubmit={handleFuelSubmit} className="p-5 space-y-4">
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-xs">
                  {validationError}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-xs">
                  {successMessage}
                </div>
              )}

              {/* Vehicle */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Select Vehicle</label>
                <select
                  value={fuelVehicle}
                  onChange={(e) => setFuelVehicle(e.target.value)}
                  className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#714B67]"
                >
                  {nonRetiredVehicles.map(v => (
                    <option key={v.regNo} value={v.regNo}>{v.name} ({v.regNo})</option>
                  ))}
                </select>
              </div>

              {/* Liters */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Liters (L)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 42"
                  value={fuelLiters || ''}
                  onChange={(e) => setFuelLiters(Number(e.target.value))}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Cost */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Total Fuel Cost (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 3150"
                  value={fuelCost || ''}
                  onChange={(e) => setFuelCost(Number(e.target.value))}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Refueling Date</label>
                <input
                  type="date"
                  required
                  value={fuelDate}
                  onChange={(e) => setFuelDate(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsFuelModalOpen(false)} className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded bg-[#714B67] hover:bg-[#5D3F56] font-semibold text-white shadow-sm">Save Fuel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal Form */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#714B67] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Coins size={14} />
                Log General Expense
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded">✕</button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-5 space-y-4">
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-xs">
                  {validationError}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-xs">
                  {successMessage}
                </div>
              )}

              {/* Trip Link */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Link to Trip (Optional)</label>
                <select
                  value={expenseTrip}
                  onChange={(e) => setExpenseTrip(e.target.value)}
                  className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs"
                >
                  <option value="">Unlinked/General Depot Expense</option>
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.id} ({t.source} ➔ {t.destination})</option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Assigned Vehicle</label>
                <select
                  value={expenseVehicle}
                  onChange={(e) => setExpenseVehicle(e.target.value)}
                  className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#714B67]"
                >
                  {nonRetiredVehicles.map(v => (
                    <option key={v.regNo} value={v.regNo}>{v.name} ({v.regNo})</option>
                  ))}
                </select>
              </div>

              {/* Toll Fee */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Toll Charges (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={expenseToll || ''}
                  onChange={(e) => setExpenseToll(Number(e.target.value))}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Other Charges */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Other/Misc Charges (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={expenseOther || ''}
                  onChange={(e) => setExpenseOther(Number(e.target.value))}
                  className="border border-gray-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded bg-[#714B67] hover:bg-[#5D3F56] font-semibold text-white shadow-sm">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
