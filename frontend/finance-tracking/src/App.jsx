import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserDashboardData from "@/api/UserDashboardData";
import PageLoader from "@/components/common/PageLoader";

const lazyWithRetry = (importer, cacheKey) =>
  lazy(async () => {
    const hasRetried = sessionStorage.getItem(cacheKey) === "true";

    try {
      const module = await importer();
      sessionStorage.removeItem(cacheKey);
      return module;
    } catch (error) {
      if (!hasRetried) {
        sessionStorage.setItem(cacheKey, "true");
        window.location.reload();
        return new Promise(() => {});
      }

      throw error;
    }
  });

const Home = lazyWithRetry(() => import("./pages/Home"), "lazy-retry-home");
const Signup = lazyWithRetry(
  () => import("./components/Signup"),
  "lazy-retry-signup",
);
const Login = lazyWithRetry(
  () => import("./components/Login"),
  "lazy-retry-login",
);
const Dashboard = lazyWithRetry(
  () => import("./pages/Dashboard"),
  "lazy-retry-dashboard",
);
const NotFound = lazyWithRetry(
  () => import("./pages/NotFound"),
  "lazy-retry-not-found",
);
function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader label="Loading page..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <UserDashboardData>
                <Dashboard />{" "}
              </UserDashboardData>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
