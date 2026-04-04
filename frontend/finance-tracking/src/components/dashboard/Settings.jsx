import React, { useEffect, useMemo, useState } from "react";
import { User, Bell, Lock, Trash2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../pages/home.css";
import { useActionNotifier } from "@/hooks/useActionNotifier";
import { apiUrl } from "@/config/api";

const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    transactionAlerts: true,
    weeklyReports: true,
  },
  preferences: {
    currency: "USD",
    timezone: "Asia/Kolkata",
  },
  security: {
    twoFactorEnabled: false,
  },
};

function Settings() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { notify } = useActionNotifier();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    currency: "USD",
    timezone: "Asia/Kolkata",
  });

  const [notifications, setNotifications] = useState(
    DEFAULT_SETTINGS.notifications,
  );
  const [security, setSecurity] = useState(DEFAULT_SETTINGS.security);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const canSavePassword = useMemo(() => {
    return (
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.confirmPassword
    );
  }, [passwordForm]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          apiUrl(`/api/users/${userId}/profile`),
        );
        const user = response.data?.user;
        if (!user) {
          return;
        }

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          currency: user.settings?.preferences?.currency || "USD",
          timezone: user.settings?.preferences?.timezone || "Asia/Kolkata",
        });

        setNotifications({
          ...DEFAULT_SETTINGS.notifications,
          ...(user.settings?.notifications || {}),
        });

        setSecurity({
          ...DEFAULT_SETTINGS.security,
          ...(user.settings?.security || {}),
        });
      } catch (error) {
        console.error("Error fetching settings data:", error);
        setStatus("Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const saveProfile = async () => {
    if (!userId) {
      return;
    }

    try {
      setSaving(true);
      setStatus("");

      await axios.put(apiUrl(`/api/users/${userId}/profile`), {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        preferences: {
          currency: profile.currency,
          timezone: profile.timezone,
        },
      });

      setStatus("Profile updated successfully.");
      notify({ type: "success", title: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      const message =
        error?.response?.data?.error || "Failed to update profile.";
      setStatus(message);
      notify({ type: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    if (!userId) {
      return;
    }

    try {
      setSaving(true);
      setStatus("");

      await axios.put(apiUrl(`/api/users/${userId}/settings`), {
        notifications,
      });

      setStatus("Notification settings updated.");
      notify({ type: "success", title: "Notification settings updated" });
    } catch (error) {
      console.error("Error updating notifications:", error);
      const message =
        error?.response?.data?.error || "Failed to update notifications.";
      setStatus(message);
      notify({ type: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const saveSecurity = async () => {
    if (!userId) {
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus("New password and confirm password do not match.");
      notify({
        type: "error",
        title: "New password and confirm password do not match",
      });
      return;
    }

    try {
      setSaving(true);
      setStatus("");

      await axios.put(apiUrl(`/api/users/${userId}/settings`), {
        security,
      });

      if (canSavePassword) {
        await axios.put(apiUrl(`/api/users/${userId}/password`), {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStatus("Security settings updated.");
      notify({ type: "success", title: "Security settings updated" });
    } catch (error) {
      console.error("Error updating security:", error);
      const message =
        error?.response?.data?.error || "Failed to update security settings.";
      setStatus(message);
      notify({ type: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!userId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete account permanently? This action cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setSaving(true);
      await axios.delete(apiUrl(`/api/users/${userId}`));
      localStorage.removeItem("userId");
      notify({ type: "success", title: "Account deleted successfully" });
      navigate("/signup", { replace: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      const message =
        error?.response?.data?.error || "Failed to delete account.";
      setStatus(message);
      notify({ type: "error", title: message });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-on-secondary-container">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen overflow-y-auto pb-8 pt-4 sm:pt-24 md:py-8 md:pt-8">
      <div className="mx-auto px-2 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="mt-2 text-sm font-medium text-on-secondary-container">
            Manage your account preferences and application settings.
          </p>
          {status ? (
            <p className="mt-3 text-sm font-semibold text-primary">{status}</p>
          ) : null}
        </div>

        <div className="grid w-full grid-cols-2 gap-8">
          <div className="col-span-2 rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:col-span-1 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">
                Account Settings
              </h3>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Full Name
                </span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Email
                </span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Phone
                </span>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">
                    Currency
                  </span>
                  <select
                    value={profile.currency}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        currency: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface">
                    Timezone
                  </span>
                  <input
                    type="text"
                    value={profile.timezone}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        timezone: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Bio
                </span>
                <textarea
                  value={profile.bio}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, bio: event.target.value }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
              </label>

              <button
                type="button"
                disabled={saving}
                onClick={saveProfile}
                className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                Save Profile
              </button>
            </div>
          </div>

          <div className="flex-col flex gap-6">
            <div className="col-span-2 rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:col-span-1 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary">
                  Notifications
                </h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(notifications.email)}
                    onChange={(event) =>
                      setNotifications((prev) => ({
                        ...prev,
                        email: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-on-surface">
                    Email notifications
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(notifications.transactionAlerts)}
                    onChange={(event) =>
                      setNotifications((prev) => ({
                        ...prev,
                        transactionAlerts: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-on-surface">
                    Transaction alerts
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(notifications.weeklyReports)}
                    onChange={(event) =>
                      setNotifications((prev) => ({
                        ...prev,
                        weeklyReports: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-on-surface">
                    Weekly report summary
                  </span>
                </label>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={saveNotifications}
                className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                Save Notifications
              </button>
            </div>

            <div className="col-span-2 rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:col-span-1 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary">Security</h3>
              </div>

              <label className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(security.twoFactorEnabled)}
                  onChange={(event) =>
                    setSecurity((prev) => ({
                      ...prev,
                      twoFactorEnabled: event.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                <span className="flex items-center gap-2 text-sm font-medium text-on-surface">
                  <Shield className="h-4 w-4" />
                  Two-factor authentication
                </span>
              </label>

              <div className="grid gap-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-sm"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={saveSecurity}
                className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                Save Security
              </button>
            </div>
            <div className="col-span-2 rounded-xl border border-red-200 bg-surface-container-low p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:col-span-1 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
              </div>

              <p className="mb-4 text-sm text-on-secondary-container">
                This permanently removes your profile and all associated
                financial data.
              </p>
              <button
                type="button"
                disabled={saving}
                onClick={deleteAccount}
                className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
