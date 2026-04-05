import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const description = "A pie chart with a custom label";

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444"];

const normalizeTransactions = (transactions = []) =>
  transactions
    .filter((transaction) => transaction && transaction.date)
    .map((transaction) => ({
      date: transaction.date,
      amount: Number(transaction.amount) || 0,
      type: transaction.type === "income" ? "income" : "expense",
      category: transaction.category || "Uncategorized",
    }));

const buildCategoryData = (transactions = [], selectedType = "expense") => {
  const categoryMap = new Map();

  transactions.forEach((transaction) => {
    if (transaction.type !== selectedType) {
      return;
    }

    const key = transaction.category;

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        name: key,
        value: 0,
      });
    }

    const entry = categoryMap.get(key);
    entry.value += transaction.amount;
  });

  return Array.from(categoryMap.values())
    .sort((first, second) => second.value - first.value)
    .map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));
};

const formatValue = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0]?.payload;

  return (
    <div className="rounded-2xl border border-black/10 bg-surface-container-low px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,29,51,0.3)]">
      <p className="text-sm font-bold text-primary">{entry?.name}</p>
      <p className="mt-2 text-sm font-medium text-on-secondary-container">
        {entry?.name === "income" ? "Income" : "Expense"}:{" "}
        <span className="font-semibold text-on-surface">
          {formatValue(entry?.value)}
        </span>
      </p>
    </div>
  );
};

function PieChartCard({ transactions = [] }) {
  const [selectedType, setSelectedType] = useState("expense");
  const chartData = useMemo(
    () => buildCategoryData(normalizeTransactions(transactions), selectedType),
    [selectedType, transactions],
  );
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  console.log(chartData);
  return (
    <section className="flex flex-col rounded-xl border border-black/10 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary">
            {selectedType === "income" ? "Income" : "Outcome"} by Category
          </h3>
          <p className="mt-1 text-sm font-medium text-on-secondary-container">
            Category wise income and outcome breakdown
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-on-secondary-container">
          <button
            type="button"
            onClick={() => setSelectedType("income")}
            className={`rounded-full px-4 py-2 transition ${selectedType === "income" ? "bg-primary text-white" : "bg-surface-container-high text-on-secondary-container"}`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("expense")}
            className={`rounded-full px-4 py-2 transition ${selectedType === "expense" ? "bg-primary text-white" : "bg-surface-container-high text-on-secondary-container"}`}
          >
            Outcome
          </button>
        </div>
      </div>

      <div className="flex min-h-72 items-center justify-center">
        <div className="h-72 w-full  outline-none focus:outline-none">
          <ResponsiveContainer>
            <RechartsPieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                sm:innerRadius={72}
                innerRadius={35}
                sm:outerRadius={108}
                outerRadius={60}
                paddingAngle={3}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
                label={({ name, value, ...props }) => (
                  <text
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground, #002d4f)"
                    className="text-xs font-semibold"
                  >
                    {`${name}:`} {` ${formatValue(value)}`}
                  </text>
                )}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-on-secondary-container">
        <span>
          Showing {selectedType === "income" ? "income" : "outcome"} categories
          for your saved records
        </span>
        <span className="font-semibold text-primary">
          Total: $ {formatValue(total)}
        </span>
      </div>
    </section>
  );
}

export function ChartPieLabelCustom() {
  return <PieChartCard />;
}

export default PieChartCard;
