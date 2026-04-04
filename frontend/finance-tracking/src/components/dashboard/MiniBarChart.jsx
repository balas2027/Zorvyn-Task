import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const description = "A multiple bar chart";

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

const buildMonthLabel = (dateValue) => {
  const date = new Date(dateValue);
  const month = MONTH_LABELS[date.getMonth()] || "";
  return `${month} ${date.getFullYear()}`;
};

const normalizeTransactions = (transactions = []) =>
  transactions
    .filter((transaction) => transaction && transaction.date)
    .map((transaction) => ({
      date: transaction.date,
      amount: Number(transaction.amount) || 0,
      type: transaction.type === "income" ? "income" : "expense",
    }));

const buildMonthlyData = (transactions = []) => {
  const monthlyMap = new Map();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = buildMonthLabel(date);

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        key,
        month: label,
        income: 0,
        expense: 0,
      });
    }

    const entry = monthlyMap.get(key);
    entry[transaction.type] += transaction.amount;
  });

  return Array.from(monthlyMap.values()).sort((first, second) =>
    first.key.localeCompare(second.key),
  );
};

const formatValue = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const incomeEntry = payload.find((entry) => entry.dataKey === "income");
  const expenseEntry = payload.find((entry) => entry.dataKey === "expense");

  return (
    <div className="rounded-2xl border border-black/10 bg-surface-container-low px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,29,51,0.3)]">
      <p className="text-sm font-bold text-primary">{label}</p>
      <p className="mt-2 flex items-center justify-between gap-6 text-sm font-medium text-on-secondary-container">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Income
        </span>
        <span className="font-semibold text-on-surface">
          {formatValue(incomeEntry?.value ?? 0)}
        </span>
      </p>
      <p className="mt-1 flex items-center justify-between gap-6 text-sm font-medium text-on-secondary-container">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          Expense
        </span>
        <span className="font-semibold text-on-surface">
          {formatValue(expenseEntry?.value ?? 0)}
        </span>
      </p>
    </div>
  );
};

function MiniBarChart({ transactions = [] }) {
  const chartData = useMemo(
    () => buildMonthlyData(normalizeTransactions(transactions)),
    [transactions],
  );

  const totals = useMemo(
    () =>
      chartData.reduce(
        (accumulator, item) => {
          accumulator.income += item.income;
          accumulator.expense += item.expense;
          return accumulator;
        },
        { income: 0, expense: 0 },
      ),
    [chartData],
  );

  return (
    <section className="rounded-xl border border-black/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary">Monthly Overview</h3>
          <p className="mt-1 text-sm font-medium text-on-secondary-container">
            Month wise income and expense overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-on-secondary-container">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </div>

      <div className="h-72 w-full outline-none focus:outline-none">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="rgba(0,29,51,0.08)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,29,51,0.04)" }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="income"
              fill="var(--chart-1, #34d399)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="var(--chart-2, #f87171)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-on-secondary-container">
        Income ${formatValue(totals.income)} and expense $
        {formatValue(totals.expense)} across your saved records.
      </p>
    </section>
  );
}

export function ChartBarMultiple() {
  return <MiniBarChart />;
}

export default MiniBarChart;
