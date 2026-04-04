import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataDashboardContext } from "@/context/DashboardDataContext";
import { apiUrl } from "@/config/api";

function UserDashboardData({ children }) {
  const [dashboardData, setDashboardData] = useState(null);

  const refetchDashboardData = useCallback(async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setDashboardData(null);
      return;
    }

    try {
      const response = await axios.get(
        apiUrl(`/api/summary/${userId}`),
      );
      setDashboardData(response.data || null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refetchDashboardData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refetchDashboardData]);

  const providerValue = useMemo(
    () => ({
      dashboardData,
      refetchDashboardData,
    }),
    [dashboardData, refetchDashboardData],
  );

  return (
    <DataDashboardContext.Provider value={providerValue}>
      {children}
    </DataDashboardContext.Provider>
  );
}

export default UserDashboardData;
