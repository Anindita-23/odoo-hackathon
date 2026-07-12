/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  isCollapsed, 
  setIsCollapsed 
}: SidebarProps) {
  
  // Define menu items and their allowed roles
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] 
    },
    { 
      id: 'fleet', 
      label: 'Fleet', 
      icon: Car,
      roles: ['Fleet Manager', 'Dispatcher', 'Financial Analyst'] 
    },
    { 
      id: 'drivers', 
      label: 'Drivers', 
      icon: Users,
      roles: ['Fleet Manager', 'Safety Officer'] 
    },
    { 
      id: 'trips', 
      label: 'Trips', 
      icon: Route,
      roles: ['Dispatcher', 'Safety Officer'] 
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      icon: Wrench,
      roles: ['Fleet Manager'] 
    },
    { 
      id: 'expenses', 
      label: 'Fuel & Expenses', 
      icon: Fuel,
      roles: ['Financial Analyst'] 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      roles: ['Financial Analyst', 'Fleet Manager'] 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      roles: ['Fleet Manager'] 
    }
  ];

  // Filter menu items based on role permission (Odoo-like module restriction)
  const allowedMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      id="transitops-sidebar"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#714B67] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              T
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-[#2E2E2E]">
              Transit<span className="text-[#00A09D]">Ops</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded bg-[#714B67] flex items-center justify-center text-white font-bold text-lg mx-auto shadow-sm">
            T
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors hidden md:block"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="toggle-sidebar-btn"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 bg-[#F6F7F9] border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <ShieldAlert size={12} className="text-[#714B67]" />
            <span className="truncate">Role: <strong className="text-[#714B67]">{userRole}</strong></span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md font-medium transition-all ${
                isActive 
                  ? 'bg-[#714B67] text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={item.label}
              id={`sidebar-tab-${item.id}`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Branding */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 bg-white text-center">
          <p className="text-[10px] text-gray-400 font-mono">
            TRANSITOPS © 2026 • RBAC ENABLED
          </p>
        </div>
      )}
    </aside>
  );
}
