"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const [userEmail, setUserEmail] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) throw new Error("User not found.");

      // Re-authenticate
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: oldPassword,
        });

      if (signInError) throw new Error("Current password is incorrect.");

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage("✅ Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      setUserEmail(data.user.email);
    }
  };

  fetchUser();
}, []);


  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="w-full rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-700 px-8 py-6 mb-8 flex items-center gap-3">
        <span className="text-white text-xl">⚙️</span>
        <h1 className="text-xl font-semibold text-white">
          Account Settings
        </h1>
      </div>

      {/* ================= CONTENT ================= */}
<div className="max-w-6xl mx-auto">
  {/* HEADER */}
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* ---------- ACCOUNT INFORMATION ---------- */}
    <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 border border-emerald-600 shadow-sm p-7">
  <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-white">
  Account Information
</h2>
          

          <p className="text-slate-100 text-sm mt-1">Your personal and role details</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-slate-200 mb-1 font-medium">
  Email
</label>

          <div className="relative">
            <input
  readOnly
  value={userEmail}
  className="w-full rounded-lg bg-white/90 border border-white/30
    px-4 py-2 text-slate-900"
/>

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <label className="block text-slate-200 mb-1 font-medium">
              Role
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
              <span className="text-gray-900">Barangay Treasurer</span>
            </div>
          </div>

                  </div>

        <div>
          <label className="block text-slate-200 mb-1 font-medium">
            Barangay
          </label>
          <div className="relative">
            <input
              readOnly
              value="Barangay Danahao, Clarin, Bohol"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 cursor-default"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ---------- CHANGE PASSWORD ---------- */}
   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-xl font-semibold text-slate-900">
        Change Password
      </h2>
      <p className="text-slate-500 text-sm mt-1">
        Update your password for enhanced security
      </p>
    </div>

    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
      <svg
        className="w-5 h-5 text-emerald-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>
  </div>

  <form onSubmit={handleChangePassword} className="space-y-6">
    {/* CURRENT PASSWORD */}
    <div>
      <label className="block text-lgfont-medium text-slate-700 mb-2">
        Current Password
      </label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3.5
          text-slate-900 bg-white
          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          transition"
        placeholder="Enter current password"
      />
    </div>

    {/* NEW PASSWORD */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        New Password
      </label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3.5
          text-slate-900 bg-white
          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          transition"
        placeholder="Enter new password"
      />
    </div>

    {/* CONFIRM PASSWORD */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Confirm New Password
      </label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3.5
          text-slate-900 bg-white
          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          transition"
        placeholder="Confirm new password"
      />
    </div>

    {/* MESSAGE */}
    {message && (
      <div
        className={`p-4 rounded-xl border ${
          message.startsWith("✅")
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {message}
      </div>
    )}

    {/* BUTTON */}
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-emerald-600 px-6 py-3.5
        text-white font-medium
        hover:bg-emerald-700
        focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        transition disabled:opacity-50"
    >
      {loading ? "Updating..." : "Update Password"}
    </button>

    {/* FOOTER NOTE */}
    <p className="text-sm text-slate-500 border-t border-slate-200 pt-5">
      Use at least 8 characters with a mix of letters, numbers, and symbols.
    </p>
  </form>
</div>
</div> </div> </div> ); }