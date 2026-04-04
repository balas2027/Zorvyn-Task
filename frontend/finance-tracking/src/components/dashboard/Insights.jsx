import React, { lazy, Suspense, useContext, useMemo, useState } from "react";
import { BarChart3, PieChart, TrendingUp, Wallet2 } from "lucide-react";
import { DataDashboardContext } from "@/context/DashboardDataContext";

const TransactionBarChart = lazy(() => import("./BarChart"));

function Insights({ dashboardData: dashboardDataProp }) {
  const dashboardContext = useContext(DataDashboardContext);
  const dashboardData =
    dashboardDataProp ?? dashboardContext?.dashboardData ?? null;
  const [aggregationMode, setAggregationMode] = useState("day");

  const transactionData = useMemo(() => {
    const incomeTransactions = (dashboardData?.incomesdata || []).flatMap(
      (group) =>
        (group?.data || []).map((item) => ({
          id: item._id,
          name: item.name,
          category: group.category,
          date: item.date,
          amount: item.value,
          type: "income",
        })),
    );

    const expenseTransactions = (dashboardData?.expensesdata || []).flatMap(
      (group) =>
        (group?.data || []).map((item) => ({
          id: item._id,
          name: item.name,
          category: group.category,
          date: item.date,
          amount: item.value,
          type: "expense",
        })),
    );

    return [...incomeTransactions, ...expenseTransactions].sort(
      (first, second) => new Date(second.date) - new Date(first.date),
    );
  }, [dashboardData]);

  const totals = useMemo(() => {
    return transactionData.reduce(
      (accumulator, transaction) => {
        if (transaction.type === "income") {
          accumulator.income += Number(transaction.amount) || 0;
        } else {
          accumulator.expense += Number(transaction.amount) || 0;
        }
        return accumulator;
      },
      { income: 0, expense: 0 },
    );
  }, [transactionData]);

  const summary = dashboardData?.summary || {};
  const totalIncome = summary.totalIncome ?? totals.income;
  const totalExpense = summary.totalExpense ?? totals.expense;
  const balance = summary.balance ?? totalIncome - totalExpense;

  const highestSpendingCategory = useMemo(() => {
    const categoryTotals = transactionData
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => {
        const key = transaction.category || "Uncategorized";
        acc[key] = (acc[key] || 0) + (Number(transaction.amount) || 0);
        return acc;
      }, {});

    const [category, amount] = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0] || ["No data", 0];

    return { category, amount };
  }, [transactionData]);

  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousDate.getMonth();
    const previousYear = previousDate.getFullYear();

    const currentExpense = transactionData
      .filter((item) => item.type === "expense")
      .filter((item) => {
        const date = new Date(item.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const previousExpense = transactionData
      .filter((item) => item.type === "expense")
      .filter((item) => {
        const date = new Date(item.date);
        return (
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousYear
        );
      })
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const delta = currentExpense - previousExpense;
    const deltaPercent = previousExpense
      ? (delta / previousExpense) * 100
      : currentExpense
        ? 100
        : 0;

    return {
      currentExpense,
      previousExpense,
      delta,
      deltaPercent,
    };
  }, [transactionData]);

  const observation = useMemo(() => {
    if (!transactionData.length) {
      return "No transactions yet. Add records to unlock automatic spending observations.";
    }

    if (monthlyComparison.delta > 0) {
      return `Spending increased by ${Math.abs(monthlyComparison.deltaPercent).toFixed(1)}% versus last month. Consider reviewing ${highestSpendingCategory.category} first.`;
    }

    if (monthlyComparison.delta < 0) {
      return `Great progress: spending reduced by ${Math.abs(monthlyComparison.deltaPercent).toFixed(1)}% compared to last month.`;
    }

    return "Your monthly spend is stable. You can optimize by trimming your top category further.";
  }, [transactionData, monthlyComparison, highestSpendingCategory]);

  return (
    <div className="flex-1 min-h-screen overflow-y-auto pb-8 pt-4 sm:pt-24 md:py-8 md:pt-8">
      <div className="mx-auto px-2 md:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2">
                <TrendingUp className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-primary">Total Income</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-700">
              ${totalIncome.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-on-secondary-container">
              All income records combined from your saved dashboard data.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-rose-100 p-2">
                <PieChart className="h-5 w-5 text-rose-700" />
              </div>
              <h3 className="text-lg font-bold text-primary">Total Expense</h3>
            </div>
            <p className="text-3xl font-bold text-rose-700">
              ${totalExpense.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-on-secondary-container">
              Combined expenses across all categories and months.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Net Balance</h3>
            </div>
            <p
              className={`text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-red-600"}`}
            >
              ${balance.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-on-secondary-container">
              {balance >= 0
                ? "Positive cash flow overall."
                : "Your expenses are above your income."}
            </p>
          </div>
        </div>


        <div className="my-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Financial Insights
            </h1>
            <p className="mt-2 text-sm font-medium text-on-secondary-container md:text-left text-justify">
              Analyze your spending patterns and income trends with detailed
              charts and analytics.
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2 self-start rounded-full border border-outline-variant/15 bg-surface-container-lowest p-1 shadow-[0_8px_24px_-12px_rgba(0,29,51,0.16)] lg:self-auto">
            {[
              { key: "day", label: "Day Wise" },
              { key: "month", label: "Month Wise" },
              { key: "year", label: "Year Wise" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setAggregationMode(option.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  aggregationMode === option.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-secondary-container hover:bg-surface-container-high"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        

        <div className="mb-10">
          <Suspense
            fallback={<ChartFallback label="Loading insights chart..." />}
          >
            <TransactionBarChart
              transactions={transactionData}
              title="Income vs Expense by Month"
              description="This chart uses your saved income and expense records from the dashboard summary."
              aggregationMode={aggregationMode}
            />
          </Suspense>
        </div>

        {!dashboardData && (
          <div className="mt-8 rounded-4xl border border-dashed border-outline-variant/20 bg-surface-container-lowest p-8 text-sm font-medium text-on-secondary-container">
            No dashboard data is available yet. Add income or expenses to
            populate the chart.
          </div>
        )}
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-on-secondary-container">
              Highest Spending Category
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              {highestSpendingCategory.category}
            </p>
            <p className="mt-1 text-sm font-medium text-on-secondary-container">
              ${highestSpendingCategory.amount.toLocaleString()} total expense.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-on-secondary-container">
              Monthly Comparison
            </p>
            <p
              className={`mt-2 text-xl font-bold ${monthlyComparison.delta <= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {monthlyComparison.delta <= 0 ? "Down" : "Up"}{" "}
              {Math.abs(monthlyComparison.deltaPercent).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm font-medium text-on-secondary-container">
              This month ${monthlyComparison.currentExpense.toLocaleString()} vs
              last month ${monthlyComparison.previousExpense.toLocaleString()}.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-on-secondary-container">
              Observation
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-on-surface">
              {observation}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2">
              <Wallet2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">
              Transaction Coverage
            </h3>
          </div>
          <p className="text-sm font-medium text-on-secondary-container">
            {transactionData.length} transaction
            {transactionData.length === 1 ? "" : "s"} are currently feeding the
            insights chart.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insights;

function ChartFallback({ label }) {
  return (
    <div className="flex min-h-90 items-center justify-center rounded-4xl border border-outline-variant/10 bg-surface-container-lowest shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
      <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/10 bg-white px-5 py-4">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-on-secondary-container">
          {label}
        </span>
      </div>
    </div>
  );
}
