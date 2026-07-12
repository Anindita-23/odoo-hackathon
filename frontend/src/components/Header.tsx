/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Shield, LogOut, ChevronDown, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ 
  userRole, 
  setUserRole, 
  onLogout, 
  searchQuery, 
  setSearchQuery 
}: HeaderProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles: UserRole[] = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst'
  ];

  // Colors for roles
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Fleet Manager':
        return 'bg-[#714B67]/10 text-[#714B67] border-[#714B67]/20';
      case 'Dispatcher':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      case 'Safety Officer':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'Financial Analyst':
        return 'bg-[#00A09D]/10 text-[#00A09D] border-[#00A09D]/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <header 
      className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40"
      id="transitops-header"
    >
      {/* Search Input (ERP-style global search) */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search registrations, drivers, trips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] transition-all bg-[#F6F7F9]"
          id="global-search-input"
        />
      </div>

      {/* Action Controls & User Info */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Hackathon Evaluation */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Switch roles for testing"
            id="role-switcher-btn"
          >
            <Shield size={12} className="text-[#714B67]" />
            <span className="text-gray-600">Simulate:</span>
            <span className="text-[#2E2E2E]">{userRole}</span>
            <ChevronDown size={12} className="text-gray-400" />
          </button>
          
          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-md border border-gray-200 shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 border-b border-gray-100 bg-[#F6F7F9]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Role-Based Security Matrix
                </span>
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${
                    userRole === r ? 'text-[#714B67] font-semibold bg-[#714B67]/5' : 'text-gray-700'
                  }`}
                  id={`role-select-${r.replace(' ', '-')}`}
                >
                  <span>{r}</span>
                  {userRole === r && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#714B67]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Placeholder */}
        <button 
          className="p-1.5 rounded-md hover:bg-gray-50 text-gray-500 hover:text-gray-700 relative transition-colors"
          title="Notifications"
          id="notification-bell"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-[#2E2E2E]">Shraddha</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(userRole)}`}>
              {userRole}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-gray-100">
            S
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-[#EF4444] transition-colors"
            title="Log Out"
            id="logout-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
