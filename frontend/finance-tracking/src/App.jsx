import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import UserDashboardData from "@/api/UserDashboardData";
import PageLoader from "@/components/common/PageLoader";

const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
