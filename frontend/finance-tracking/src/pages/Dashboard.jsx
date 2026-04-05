import React, {
  Suspense,
  lazy,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataDashboardContext } from "@/context/DashboardDataContext";
import PageLoader from "@/components/common/PageLoader";
import { useActionNotifier } from "@/hooks/useActionNotifier";
import SideNavbar from "@/components/dashboard/SideNavbar";
import {
  Bell,
  Settings as SettingsIcon,
  User2Icon,
  Menu,
  ChartNoAxesCombined,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainDashBoard = lazy(
  () => import("../components/dashboard/MainDashBoard"),
);
const Transaction = lazy(
  () => import("../components/dashboard/Transaction/Transaction"),
);
const Calender = lazy(
  () => import("../components/dashboard/Calender/Calender"),
);
const Settings = lazy(() => import("../components/dashboard/Settings"));
const Insights = lazy(() => import("../components/dashboard/Insights"));
const Profile = lazy(() => import("../components/dashboard/Profile"));

function Dashboard() {
  const navigate = useNavigate();
  const { notify } = useActionNotifier();
  const dashboardContext = useContext(DataDashboardContext);
  const dashboardData = dashboardContext?.dashboardData || null;
  const refetchDashboardData =
    dashboardContext?.refetchDashboardData || (() => {});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("dashboardRole") || "admin",
  );
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const [transactionEntryMode, setTransactionEntryMode] = useState("list");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("dashboardRole", userRole);
  }, [userRole]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [isProfileMenuOpen]);

  const handleTransactionChanged = () => {
    refetchDashboardData();
  };

  const openTransactionForm = () => {
    setTransactionEntryMode("form");
    setActiveNavItem("Transactions");
  };

  const openTransactionList = () => {
    setTransactionEntryMode("list");
    setActiveNavItem("Transactions");
  };

  const handleProfileView = () => {
    setActiveNavItem("Profile");
    setIsProfileMenuOpen(false);
  };

  const handleSignOut = () => {
    const shouldSignOut = window.confirm("Sign out from this account?");
    if (!shouldSignOut) {
      return;
    }

    localStorage.removeItem("userId");
    setIsProfileMenuOpen(false);
    notify({ type: "info", title: "Signed out successfully" });
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="h-screen overflow-hidden bg-surface flex flex-col md:flex-row">
        <SideNavbar
          userName={dashboardData?.user?.name}
          isOpen={isSidebarOpen}
          activeItem={activeNavItem}
          onOpen={() => setIsSidebarOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
          onSelectItem={(item) => {
            if (item === "Transactions") {
              setTransactionEntryMode("list");
            }
            setActiveNavItem(item);
          }}
        />

        <div className="flex flex-1 flex-col min-w-0 h-screen md:h-auto">
          <div className="navbar bg-white shrink-0 px-2 md:px-10 py-5 flex flex-row justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="heading flex items-center gap-2 text-xs sm:text-2xl font-bold text-secondary">
                <span>
                  <ChartNoAxesCombined className="h-6 w-6" />
                </span>{" "}
                The Financial Architect
              </div>
            </div>
            <div className="action-buttons flex gap-2 sm:gap-8">
              <div className="icon w-10 h-10 sm:flex hidden rounded-full hover:bg-blue-100  items-center justify-center text-primary cursor-pointer">
                <Bell className="h-5 w-5" />
              </div>
              <div
                className="inline-flex items-center rounded-full border border-black/10 bg-surface-container p-1"
                role="group"
                aria-label="Role toggle"
              >
                <button
                  type="button"
                  onClick={() => setUserRole("admin")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    userRole === "admin"
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-blue-100"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("viewer")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    userRole === "viewer"
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-blue-100"
                  }`}
                >
                  Viewer
                </button>
              </div>
              <button
                type="button"
                onClick={() => setActiveNavItem("Settings")}
                className="icon w-10 h-10  rounded-full hover:bg-blue-100 hidden sm:flex items-center justify-center text-primary cursor-pointer"
                aria-label="Open settings"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="icon w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <User2Icon className="h-5 w-5" />
                </button>
                {isProfileMenuOpen ? (
                  <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_34px_-10px_rgba(0,29,51,0.25)]">
                    <button
                      type="button"
                      onClick={handleProfileView}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-primary hover:bg-surface-container-low"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-blue-100 transition"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            className={`flex-1 overflow-y-${activeNavItem === "Dashboard" ? "auto" : "auto"} w-full`}
          >
            <Suspense
              fallback={<PageLoader label="Loading dashboard section..." />}
            >
              {activeNavItem === "Dashboard" && (
                <MainDashBoard
                  dashboardData={dashboardData}
                  onAddTransaction={openTransactionForm}
                  onViewTransactions={openTransactionList}
                  userRole={userRole}
                />
              )}
              {activeNavItem === "Transactions" && (
                <Transaction
                  viewMode={transactionEntryMode}
                  userRole={userRole}
                  onModeChange={setTransactionEntryMode}
                  onTransactionChanged={handleTransactionChanged}
                />
              )}
              {activeNavItem === "Calendar" && (
                <Calender dashboardData={dashboardData} />
              )}
              {activeNavItem === "Insights" && <Insights />}
              {activeNavItem === "Settings" && <Settings />}
              {activeNavItem === "Profile" && (
                <Profile dashboardData={dashboardData} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
