import React from "react";
import { lazy, Suspense } from "react";
import "../../pages/home.css";
import {
  PlusCircle,
  Wallet2Icon,
  LandmarkIcon,
  NotebookTextIcon,
  TrendingUp,
  TrendingDownIcon,
  PieChart as PieChartIcon,
} from "lucide-react";

const MiniBarChart = lazy(() => import("./MiniBarChart"));
const PieChartCard = lazy(() => import("./PieChart"));

function MainDashBoard(props) {
  const {
    dashboardData,
    userRole = "admin",
    onAddTransaction = () => {},
    onViewTransactions = () => {},
  } = props;
  const canManageTransactions = userRole === "admin";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const formatDate = (dateValue) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateValue));

  const recentTransactions = [
    ...(dashboardData?.incomesdata || []).flatMap((group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        name: item.name,
        category: group.category,
        date: item.date,
        amount: item.value,
        type: "income",
      })),
    ),
    ...(dashboardData?.expensesdata || []).flatMap((group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        name: item.name,
        category: group.category,
        date: item.date,
        amount: item.value,
        type: "expense",
      })),
    ),
  ]
    .sort((first, second) => new Date(second.date) - new Date(first.date))
    .slice(0, 5);

  const allTransactions = [
    ...(dashboardData?.incomesdata || []).flatMap((group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        name: item.name,
        category: group.category,
        date: item.date,
        amount: item.value,
        type: "income",
      })),
    ),
    ...(dashboardData?.expensesdata || []).flatMap((group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        name: item.name,
        category: group.category,
        date: item.date,
        amount: item.value,
        type: "expense",
      })),
    ),
  ];

  const dashboardsummary = [
    {
      title: "Total Balance",
      icon: LandmarkIcon,
      color: "blue-100",
      symbolcolor: "text-primary",
      textcolor:
        (dashboardData?.summary?.balance || 0) >= 0
          ? "text-green-500"
          : "text-red-500",
      absoluteboxcolor: "",
      value: dashboardData?.summary?.balance || 0,
      description: "5% increase from last month",
      descriptionicon:
        (dashboardData?.summary?.balance || 0) >= 0
          ? TrendingUp
          : TrendingDownIcon,
    },
    {
      title: "Total Income",
      icon: Wallet2Icon,
      color: "blue-200",
      symbolcolor: "text-blue-900",
      textcolor: "text-primary",
      absoluteboxcolor: "",
      value: dashboardData?.summary?.totalIncome || 0,
      description: "8% increase from last month",
      descriptionicon: TrendingUp,
    },
    {
      title: "Total Expense",
      icon: NotebookTextIcon,
      color: "red-100",
      symbolcolor: "text-red-500",
      textcolor: "text-primary",
      absoluteboxcolor: "",

      value: dashboardData?.summary?.totalExpense || 0,
      description: "2% decrease from last month",
      descriptionicon: TrendingDownIcon,
    },
  ];
  return (
    <>
      <div>
        <main className="flex-1 pb-8 pt-4 sm:pt-24 min-h-screen overflow-y-auto md:py-8 md:pt-8">
          <div className="mx-auto px-2 md:px-10">
            <div className="top flex gap-5 md:gap-0 flex-row justify-between items-center mb-8">
              <div className="heading  max-w-xl">
                <h1 className="text-3xl font-bold text-primary">
                  Financial Overview
                </h1>

                <p className="mt-2 text-sm text-justify md:text-left font-medium text-on-secondary-container">
                  Status report for the current fiscal period. Here's a quick
                  overview of your financial health and recent activities.
                </p>
              </div>
              {canManageTransactions && (
                <div className="add-transaction-button hidden sm:flex">
                  <button
                    type="button"
                    disabled={!canManageTransactions}
                    className="flex flex-col sm:flex-row items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-sm font-semibold text-secondary border hover:text-black transition"
                    onClick={onAddTransaction}
                  >
                    <span className="material-symbols-outlined">
                      <PlusCircle strokeWidth={2} />
                    </span>
                    Add Transactions
                  </button>
                </div>
              )}
            </div>

            {dashboardData ? (
              <div className="grid gap-10 md:gap-20 sm:grid-cols-3">
                {dashboardsummary.map((item) => (
                  <div
                    key={item.title}
                    className="bg-surface-container-lowest group p-8 rounded-full shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] border border-black/10 relative overflow-hidden group"
                  >
                    <div
                      className={`absolute h-10 w-10 group-hover:bg-${item.color}/30 group-hover:h-20 group-hover:w-20 transition-all duration-500 rounded-bl-xl right-0 top-0 z-10 bg-${item.color}/20 `}
                    ></div>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex flex-col gap-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-primary-container bg-${item.color} p-2 rounded-lg`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${item.symbolcolor}`}
                          />
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-widest text-on-secondary-container">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-4xl font-bold tracking-tighter headline-font ${item.textcolor}`}
                        >
                          ${item.value.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-tertiary-fixed-dim font-bold text-sm">
                          <span className="material-symbols-outlined text-sm">
                            <item.descriptionicon
                              className={`h-4 w-4 ${item.symbolcolor}`}
                            />
                          </span>
                          <span
                            className={`text-sm font-medium ${item.symbolcolor}`}
                          >
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-[#5c708b]">
                Loading dashboard data...
              </p>
            )}
          </div>
          <div className="mx-auto mt-10 grid w-full gap-10 px-2 pb-10 md:px-10 xl:grid-cols-2">
            <Suspense fallback={<ChartFallback label="Loading bar chart..." />}>
              <MiniBarChart transactions={allTransactions} />
            </Suspense>
            <Suspense fallback={<ChartFallback label="Loading pie chart..." />}>
              <PieChartCard transactions={allTransactions} />
            </Suspense>
          </div>
          <div className="mx-auto mt-10 px-2 md:px-10 pb-10">
            <section className="rounded-4xl border border-black/10 bg-surface-container-low p-6 shadow-[0_16px_48px_-12px_rgba(0,29,51,0.08)] sm:p-10">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary headline-font">
                    Recent Transactions
                  </h3>
                  <p className="mt-2 text-sm font-medium text-on-secondary-container">
                    Latest income and expense activity pulled from your
                    dashboard data.
                  </p>
                </div>
                <button
                  className="self-start text-sm font-bold text-primary hover:underline sm:self-auto"
                  onClick={onViewTransactions}
                >
                  View All Records
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-on-secondary-container/60">
                        Entity
                      </th>
                      <th className="pb-4 pr-2 md:pr-0 text-[11px] font-bold uppercase tracking-widest text-on-secondary-container/60">
                        Classification
                      </th>
                      <th className="pb-4 pl-2 md:pl-0 text-[11px] font-bold uppercase tracking-widest text-on-secondary-container/60">
                        Date
                      </th>
                      <th className="pb-4 text-right text-[11px] font-bold uppercase tracking-widest text-on-secondary-container/60">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/10">
                    {recentTransactions.length ? (
                      recentTransactions.map((transaction, index) => {
                        const isIncome = transaction.type === "income";
                        const normalizedId = String(transaction.id || "");
                        const shortId = normalizedId
                          ? normalizedId.slice(-6).toUpperCase()
                          : "N/A";
                        const rowKey =
                          normalizedId ||
                          `${transaction.type || "txn"}-${transaction.date || "date"}-${index}`;

                        return (
                          <tr
                            key={rowKey}
                            className="group cursor-pointer transition-colors hover:bg-blue-100"
                          >
                            <td className="py-6 pr-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    isIncome ? "bg-green-100" : "bg-red-100"
                                  }`}
                                >
                                  {isIncome ? (
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <TrendingDownIcon className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-on-surface">
                                    {transaction.name}
                                  </div>
                                  <div className="text-xs font-medium text-on-secondary-container/60">
                                    {isIncome
                                      ? `Income #${shortId}`
                                      : `Expense #${shortId}`}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-6 pr-4">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                  isIncome
                                    ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                                    : "bg-surface-container-high text-on-secondary-container"
                                }`}
                              >
                                {transaction.category || "Uncategorized"}
                              </span>
                            </td>

                            <td className="py-6 pr-4 text-sm font-medium text-on-secondary-container">
                              {formatDate(transaction.date)}
                            </td>

                            <td
                              className={`py-6 text-right font-bold ${
                                isIncome
                                  ? "text-tertiary-container"
                                  : "text-on-surface"
                              }`}
                            >
                              {isIncome ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          className="py-8 text-sm text-on-secondary-container/70"
                          colSpan={4}
                        >
                          No transaction records found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default MainDashBoard;

function ChartFallback({ label }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-4xl border border-black/10 bg-surface-container-lowest shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-on-secondary-container">
          {label}
        </span>
      </div>
    </div>
  );
}
