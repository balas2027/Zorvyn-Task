import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Mail, Phone, Shield, UserCircle2, Wallet } from "lucide-react";

function Profile({ dashboardData }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://zorvyn-task-lemon.vercel.app/api/users/${userId}/profile`,
        );
        setProfile(response.data?.user || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const summary = dashboardData?.summary || {};

  const infoRows = useMemo(
    () => [
      {
        label: "Email",
        value: profile?.email || "-",
        icon: Mail,
      },
      {
        label: "Phone",
        value: profile?.phone || "Not added",
        icon: Phone,
      },
      {
        label: "Currency",
        value: profile?.settings?.preferences?.currency || "USD",
        icon: Wallet,
      },
      {
        label: "2FA",
        value: profile?.settings?.security?.twoFactorEnabled
          ? "Enabled"
          : "Disabled",
        icon: Shield,
      },
    ],
    [profile],
  );

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm font-medium text-on-secondary-container">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto pb-8 pt-4 sm:pt-24 md:py-8 md:pt-8">
      <div className="mx-auto px-2 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
          <p className="mt-2 text-sm font-medium text-on-secondary-container">
            Your account identity and financial account status.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <section className="rounded-4xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-primary">
                <UserCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {profile?.name || "User"}
                </h2>
                <p className="text-sm text-on-secondary-container">
                  Joined{" "}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-low px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <row.icon className="h-4 w-4" />
                    {row.label}
                  </span>
                  <span className="text-sm font-medium text-on-secondary-container">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {profile?.bio ? (
              <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-on-secondary-container">
                  Bio
                </p>
                <p className="mt-2 text-sm text-on-surface">{profile.bio}</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-4xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] md:p-8">
            <h3 className="text-lg font-bold text-primary">
              Financial Snapshot
            </h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs uppercase text-emerald-700">Income</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  ${(summary.totalIncome || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-3">
                <p className="text-xs uppercase text-rose-700">Expense</p>
                <p className="mt-1 text-xl font-bold text-rose-700">
                  ${(summary.totalExpense || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3">
                <p className="text-xs uppercase text-primary">Balance</p>
                <p className="mt-1 text-xl font-bold text-primary">
                  ${(summary.balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
