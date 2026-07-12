/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('Shraddha@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Fleet Manager');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('❌ Email address is required.');
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMsg('❌ Account locked after 5 failed attempts. Please contact the administrator.');
      return;
    }

    // Standard credential checking simulation
    if (email.toLowerCase() !== 'shraddha@gmail.com' || password !== '••••••••') {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      
      if (nextFail >= 5) {
        setErrorMsg('❌ Invalid credentials. Account locked after 5 failed attempts.');
      } else {
        setErrorMsg(`❌ Invalid credentials. Attempt ${nextFail} of 5. Please use seeded credentials.`);
      }
      return;
    }

    // Success login
    onLogin(selectedRole);
  };

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row bg-[#F6F7F9]"
      id="login-page-container"
    >
      
      {/* Left Branding Side Panel (Gray Background) */}
      <div className="w-full md:w-5/12 bg-gray-200 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-300">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded bg-[#714B67] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              T
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl tracking-tight text-[#2E2E2E]">
                Transit<span className="text-[#00A09D]">Ops</span>
              </span>
              <span className="block text-[10px] text-gray-500 font-medium">Smart Transport Operations Platform</span>
            </div>
          </div>

          {/* Description list */}
          <div className="space-y-4 pt-8">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">One login, four roles:</h2>
            <ul className="space-y-3.5 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#714B67] mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#714B67] font-bold">Fleet Manager</strong>
                  <p className="text-gray-500 text-[11px]">Audit vehicles, configure maintenance work orders, and handle general parameter settings.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#3B82F6] font-bold">Dispatcher</strong>
                  <p className="text-gray-500 text-[11px]">Coordinate live trips, plan source-to-destination routes, and verify load limit safety thresholds.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#F59E0B] font-bold">Safety Officer</strong>
                  <p className="text-gray-500 text-[11px]">Audit driver categories, safety profiles, and enforce driver license expiration compliance.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A09D] mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#00A09D] font-bold">Financial Analyst</strong>
                  <p className="text-gray-500 text-[11px]">Log vehicle fuel costs, audit tolls, and view rolling vehicle returns on investments.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 text-gray-400 text-[10px] font-mono border-t border-gray-300">
          TRANSITOPS © 2026 • RBAC ENABLED HACKATHON BUILD
        </div>
      </div>

      {/* Right Sign In Form Panel (Dark Theme / Slate Surface) */}
      <div className="w-full md:w-7/12 bg-[#212121] p-8 md:p-16 flex items-center justify-center text-white">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Sign in to your account
            </h1>
            <p className="text-xs text-gray-400">Enter your credentials to continue to Odoo transit hub</p>
          </div>

          {/* Validation block */}
          {errorMsg && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 p-3 rounded text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5 animate-bounce" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded px-9 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] text-white"
                  placeholder="Shraddha@gmail.com"
                  id="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded px-9 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] text-white"
                  id="login-password"
                />
              </div>
            </div>

            {/* Simulated Role (RBAC) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Select Persona (RBAC Scope)</label>
              <div className="relative">
                <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] text-white appearance-none"
                  id="login-role-select"
                >
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>
            </div>

            {/* Checks & Actions */}
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#714B67] rounded border-gray-700 text-[#714B67]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Seeded account credentials: \nEmail: Shraddha@gmail.com \nPassword: •••••••• (Use the default asterisk letters filled)')}
                className="hover:underline text-[#00A09D] font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={failedAttempts >= 5}
              className={`w-full py-2.5 rounded text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                failedAttempts >= 5
                  ? 'bg-red-950/20 text-red-700 cursor-not-allowed border border-red-900/55'
                  : 'bg-[#714B67] hover:bg-[#5D3F56] text-white active:scale-95'
              }`}
              id="signin-submit-btn"
            >
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick Guide */}
          <div className="bg-[#2A2A2A] border border-gray-800 rounded p-3 text-[11px] text-gray-400 space-y-1">
            <span className="font-semibold text-[#00A09D] flex items-center gap-1">
              <Sparkles size={12} /> Hackathon Quick Access:
            </span>
            <p>Seeded credentials are pre-filled! Select any role in the list above and click <strong className="text-white">Sign In</strong> to instantly scope your Odoo workspace.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
