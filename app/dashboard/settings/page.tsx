"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [nameForm, setNameForm] = useState({ name: "", businessName: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [nameMsg, setNameMsg] = useState({ text: "", success: false });
  const [passMsg, setPassMsg] = useState({ text: "", success: false });
  const [nameLoading, setNameLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMsg({ text: "", success: false });

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameForm),
      });
      const data = await res.json();
      setNameMsg({ text: data.message || data.error, success: res.ok });
    } catch {
      setNameMsg({ text: "Network error", success: false });
    } finally {
      setNameLoading(false);
    }
  };

  const handlePassUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: "", success: false });

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ text: "Passwords do not match", success: false });
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passForm),
      });
      const data = await res.json();
      setPassMsg({ text: data.message || data.error, success: res.ok });
      if (res.ok) setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPassMsg({ text: "Network error", success: false });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Update */}
      <div className="auth-card rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-lg">Update Profile</h2>

        {nameMsg.text && (
          <div className={"text-sm rounded-lg px-4 py-2 " + (nameMsg.success ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400")}>
            {nameMsg.text}
          </div>
        )}

        <form onSubmit={handleNameUpdate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
            <input type="text" value={nameForm.name} onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })} className="input-field" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Business Name</label>
            <input type="text" value={nameForm.businessName} onChange={(e) => setNameForm({ ...nameForm, businessName: e.target.value })} className="input-field" placeholder="Your business name" />
          </div>
          <button type="submit" disabled={nameLoading} className="btn-primary w-auto px-6 disabled:opacity-50">
            {nameLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Update */}
      <div className="auth-card rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-lg">Change Password</h2>

        {passMsg.text && (
          <div className={"text-sm rounded-lg px-4 py-2 " + (passMsg.success ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400")}>
            {passMsg.text}
          </div>
        )}

        <form onSubmit={handlePassUpdate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Current Password</label>
            <input type="password" value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">New Password</label>
            <input type="password" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Confirm New Password</label>
            <input type="password" value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={passLoading} className="btn-primary w-auto px-6 disabled:opacity-50">
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}