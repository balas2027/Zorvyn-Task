import React, { useMemo, useState } from "react";
import {
  Edit2,
  Trash2,
  ShoppingBag,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  X,
  Search,
} from "lucide-react";
import { Drawer } from "@mui/material";
import "../../../pages/home.css";
import "../../../index.css";
function TransactionList({
  categories,
  searchTerm,
  onSearchChange,
  filters,
  onApplyFilters,
  onClearFilters,
  loading,
  transactions,
  pagination,
  onPreviousPage,
  onNextPage,
  onEdit,
  onDelete,
  userRole = "admin",
}) {
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);

  const updateDraftFilter = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const availableYears = useMemo(() => {
    const yearsFromData = transactions
      .map((item) => new Date(item.date).getFullYear())
      .filter((year) => Number.isFinite(year));

    const nowYear = new Date().getFullYear();
    const baselineYears = [nowYear, nowYear - 1, nowYear - 2, nowYear - 3];

    return Array.from(new Set([...yearsFromData, ...baselineYears]))
      .sort((first, second) => second - first)
      .map((year) => String(year));
  }, [transactions]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters || {}).filter((value) => value !== "").length;
  }, [filters]);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((first, second) => {
      const dateA = new Date(first.date);
      const dateB = new Date(second.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [transactions, sortOrder]);
  const canManageTransactions = userRole === "admin";

  const handleOpenDrawer = () => {
    setDraftFilters(filters);
    setIsFilterDrawerOpen(true);
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    setIsFilterDrawerOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      category: "",
      type: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      year: "",
    };
    setDraftFilters(clearedFilters);
    onClearFilters();
    setIsFilterDrawerOpen(false);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-300 bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high sm:max-w-md">
          <Search className="h-4 w-4 shrink-0 text-on-secondary-container" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-on-surface outline-none border-none focus:ring-0"
            placeholder="Search transaction name..."
          />
        </div>
        <button
          type="button"
          onClick={handleOpenDrawer}
          className="ml-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-surface-container px-4 py-4 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <div className="h-full w-[320px] max-w-[90vw] bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">
              Filter Transactions
            </h3>
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(false)}
              className="rounded-full p-2 text-on-secondary-container transition hover:bg-surface-container"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                Type
              </label>
              <select
                value={draftFilters.type}
                onChange={(event) =>
                  updateDraftFilter("type", event.target.value)
                }
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                Category
              </label>
              <select
                value={draftFilters.category}
                onChange={(event) =>
                  updateDraftFilter("category", event.target.value)
                }
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name || "Uncategorized"}>
                    {cat.name || "Uncategorized"}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                  Min Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={draftFilters.minAmount}
                  onChange={(event) =>
                    updateDraftFilter("minAmount", event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                  Max Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={draftFilters.maxAmount}
                  onChange={(event) =>
                    updateDraftFilter("maxAmount", event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                Year
              </label>
              <select
                value={draftFilters.year}
                onChange={(event) =>
                  updateDraftFilter("year", event.target.value)
                }
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                  Start Date
                </label>
                <input
                  type="date"
                  value={draftFilters.startDate}
                  onChange={(event) =>
                    updateDraftFilter("startDate", event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-secondary-container">
                  End Date
                </label>
                <input
                  type="date"
                  value={draftFilters.endDate}
                  onChange={(event) =>
                    updateDraftFilter("endDate", event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-primary"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </Drawer>

      {loading ? (
        <div className="bg-surface-container-low p-8 rounded-4xl shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] border border-black/10">
          <p className="text-center text-on-secondary-container">
            Loading transactions...
          </p>
        </div>
      ) : sortedTransactions.length > 0 ? (
        <div className="bg-surface-container-low rounded-4xl md:p-4 shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] border border-black/10">
          <section className="bg-surface-container-low rounded-2xl overflow-hidden">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 text-left bg-surface-container-high">
                    <th className="py-5 px-8 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container">
                      <div className="flex gap-4">
                        <div>Date</div>
                        <div className="flex items-center gap-1 text-on-secondary-container text-[10px] font-medium">
                          <ArrowUp
                            strokeWidth={3}
                            className={`h-4 w-4 hover:text-black ${sortOrder === "asc" ? "text-primary" : ""}`}
                            onClick={() => setSortOrder("asc")}
                          />
                          <ArrowDown
                            strokeWidth={3}
                            className={`h-4 w-4 hover:text-black ${sortOrder === "desc" ? "text-primary" : ""}`}
                            onClick={() => setSortOrder("desc")}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-5 px-6 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container">
                      Transaction Name
                    </th>
                    <th className="py-5 px-6 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container">
                      Category
                    </th>
                    <th className="py-5 px-6 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container text-center">
                      Type
                    </th>
                    <th className="py-5 px-6 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container text-right">
                      Amount
                    </th>
                    <th className="py-5 px-8 text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-on-secondary-container text-right">
                      {canManageTransactions ? "Actions" : "View"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {sortedTransactions.map((transaction, index) => {
                    const isIncome = transaction.type === "income";

                    return (
                      <tr
                        key={transaction._id}
                        className={`hover:bg-blue-200 ${index % 2 == 0 ? "bg-surface-container-low" : "bg-surface-container"} transition-colors group`}
                      >
                        <td className="py-5 px-8">
                          <div className="text-sm md:text-lg font-semibold text-primary">
                            {formatDate(transaction.date)}
                          </div>
                          <div className="text-[10px] md:text-[12px] text-on-secondary-container font-medium">
                            {formatTime(transaction.date)}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container border border-black/10">
                              {isIncome ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <ShoppingBag className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <span className="text-sm font-bold text-on-surface">
                              {transaction.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="text-xs md:text-[14px] font-medium px-3 py-1 bg-surface-container-highest/50 rounded-full text-on-secondary-container">
                            {transaction.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-5 px-6  text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-[12px] font-bold uppercase ${
                              isIncome
                                ? "bg-tertiary-fixed/40 text-tertiary-container"
                                : "bg-error-container/40 text-error"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <span className="text-sm font-extrabold text-on-surface">
                            {isIncome ? "+" : "-"}$
                            {formatAmount(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          {canManageTransactions ? (
                            <div className="flex items-center justify-end gap-1 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEdit(transaction)}
                                className="p-1.5 hover:bg-white rounded-lg text-primary transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onDelete(transaction._id)}
                                className="p-1.5 hover:bg-white rounded-lg text-error transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-on-secondary-container">
                              Read-only
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-secondary-container">
              Showing page {pagination.page} of {pagination.totalPages} (
              {pagination.total} records)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={!pagination.hasPrevPage}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onNextPage}
                disabled={!pagination.hasNextPage}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest p-8 rounded-4xl shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] border border-black/10">
          <p className="text-center text-on-secondary-container">
            No transactions found.
          </p>
        </div>
      )}
    </>
  );
}

export default TransactionList;
