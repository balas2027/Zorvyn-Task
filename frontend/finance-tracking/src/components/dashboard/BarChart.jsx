import React, { useMemo } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatMonthKey = (dateValue) => {
  const date = new Date(dateValue);
  const month = MONTH_LABELS[date.getMonth()] || "";
  return `${month} ${date.getFullYear()}`;
};

const formatDayKey = (dateValue) => {
  const date = new Date(dateValue);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatYearKey = (dateValue) => {
  const date = new Date(dateValue);
  return `${date.getFullYear()}`;
};

const AGGREGATION_LABELS = {
  day: "Day",
  month: "Month",
  year: "Year",
};

const normalizeTransactions = (transactions = []) =>
  transactions
    .filter((transaction) => transaction && transaction.date)
    .map((transaction) => ({
      id:
        transaction.id ||
        transaction._id ||
        `${transaction.type}-${transaction.date}`,
      date: transaction.date,
      amount: Number(transaction.amount) || 0,
      type: transaction.type === "income" ? "income" : "expense",
      category: transaction.category || "Uncategorized",
      name: transaction.name || transaction.description || "Transaction",
    }));

const getBucketConfig = (date, aggregationMode) => {
  if (aggregationMode === "day") {
    return {
      key: date.toISOString().slice(0, 10),
      label: formatDayKey(date),
    };
  }

  if (aggregationMode === "year") {
    return {
      key: `${date.getFullYear()}`,
      label: formatYearKey(date),
    };
  }

  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: formatMonthKey(date),
  };
};

const buildChartData = (transactions = [], aggregationMode = "month") => {
  const bucketMap = new Map();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const { key, label } = getBucketConfig(date, aggregationMode);

    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        key,
        label,
        income: 0,
        expense: 0,
      });
    }

    const entry = bucketMap.get(key);
    const bucket = transaction.type === "income" ? "income" : "expense";
    entry[bucket] += transaction.amount;
  });

  return Array.from(bucketMap.values()).sort((first, second) =>
    first.key.localeCompare(second.key),
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const incomeEntry = payload.find((entry) => entry.dataKey === "income");
  const expenseEntry = payload.find((entry) => entry.dataKey === "expense");

  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,29,51,0.3)]">
      <p className="text-sm font-bold text-primary">{label}</p>
      <div className="mt-3 space-y-2 text-sm font-medium text-on-secondary-container">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Income
          </span>
          <span className="font-semibold text-emerald-700">
            {formatCurrency(incomeEntry?.value ?? 0)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            Expense
          </span>
          <span className="font-semibold text-rose-700">
            {formatCurrency(expenseEntry?.value ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

function TransactionBarChart({
  transactions = [],
  title = "Monthly Transaction Overview",
  description = "Income and expense totals grouped by month.",
  aggregationMode = "month",
  height = 320,
}) {
  const normalizedTransactions = useMemo(
    () => normalizeTransactions(transactions),
    [transactions],
  );

  const chartData = useMemo(
    () => buildChartData(normalizedTransactions, aggregationMode),
    [normalizedTransactions, aggregationMode],
  );

  const totals = useMemo(
    () =>
      normalizedTransactions.reduce(
        (accumulator, transaction) => {
          const bucket = transaction.type || "expense";
          accumulator[bucket] += transaction.amount;
          return accumulator;
        },
        { income: 0, expense: 0 },
      ),
    [normalizedTransactions],
  );

  return (
    <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.08)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary">
            {title}{" "}
            <span className="text-sm font-semibold text-on-secondary-container">
              ({AGGREGATION_LABELS[aggregationMode] || "Month"} view)
            </span>
          </h3>
          <p className="mt-2 text-sm font-medium text-on-secondary-container">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
            Income {formatCurrency(totals.income)}
          </span>
          <span className="rounded-full bg-rose-100 px-4 py-2 text-rose-700">
            Expense {formatCurrency(totals.expense)}
          </span>
        </div>
      </div>

      {chartData.length ? (
        <div
          className="outline-none focus:outline-none"
          style={{ width: "100%", height }}
        >
          <ResponsiveContainer>
            <RechartsBarChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 23, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="rgba(0,29,51,0.08)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="rgba(0,29,51,0.55)"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}k`}
                stroke="rgba(0,29,51,0.55)"
              />
              <Tooltip
                cursor={{ fill: "rgba(0,29,51,0.04)" }}
                content={<CustomTooltip />}
              />

              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="var(--color-income, #34d399)"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="var(--color-expense, #f87171)"
                radius={[10, 10, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex min-h-60 items-center justify-center rounded-3xl border border-dashed border-outline-variant/20 bg-surface-container/40 text-sm font-medium text-on-secondary-container">
          No transaction data available yet.
        </div>
      )}
    </section>
  );
}

export default TransactionBarChart;
