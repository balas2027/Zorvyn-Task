import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";
import { useActionNotifier } from "@/hooks/useActionNotifier";
import TransactionForm from "@/components/dashboard/Transaction/TransactionForm";
import TransactionList from "@/components/dashboard/Transaction/TransactionList";
import { apiUrl } from "@/config/api";

function Transaction({
  viewMode = "list",
  userRole = "admin",
  onModeChange = () => {},
  onTransactionChanged = () => {},
}) {
  const { notify } = useActionNotifier();
  const userId = localStorage.getItem("userId");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    year: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const canManageTransactions = userRole === "admin";

  useEffect(() => {
    setShowForm(viewMode === "form" && canManageTransactions);
  }, [viewMode, canManageTransactions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setPagination({
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "15",
      });

      if (filters.category) {
        params.append("category", filters.category);
      }
      if (filters.type) {
        params.append("type", filters.type);
      }
      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }
      if (filters.minAmount) {
        params.append("minAmount", filters.minAmount);
      }
      if (filters.maxAmount) {
        params.append("maxAmount", filters.maxAmount);
      }
      if (filters.year) {
        params.append("year", filters.year);
      }
      const trimmedSearch = debouncedSearchTerm.trim();
      if (trimmedSearch) {
        params.append("search", trimmedSearch);
      }

      const url = apiUrl(`/api/transactions/${userId}?${params.toString()}`);
      const response = await axios.get(url);

      setTransactions(response.data?.data || []);
      setPagination(
        response.data?.pagination || {
          page: 1,
          limit: 15,
          total: response.data?.data?.length || 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, filters, debouncedSearchTerm]);

  const fetchCategories = useCallback(async () => {
    if (!userId) {
      setCategories([]);
      return;
    }

    try {
      const response = await axios.get(apiUrl("/api/categories"), {
        params: { userId },
      });
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, [fetchTransactions]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManageTransactions) {
      notify({
        type: "info",
        title: "Viewer role cannot create or edit transactions",
      });
      return;
    }

    if (!formData.description || !formData.amount || !formData.category) {
      notify({ type: "error", title: "Please fill all fields" });
      return;
    }

    try {
      if (editingId) {
        await axios.put(apiUrl(`/api/transactions/${userId}/${editingId}`), {
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          date: new Date(formData.date),
        });
      } else {
        const payload = {
          userId,
          category: formData.category,
          name: formData.description,
          value: parseFloat(formData.amount),
          date: new Date(formData.date),
        };

        if (formData.type === "income") {
          await axios.post(apiUrl("/api/incomes"), payload);
        } else {
          await axios.post(apiUrl("/api/expenses"), payload);
        }
      }

      resetForm();
      setShowForm(false);
      onModeChange("list");
      await fetchTransactions();
      onTransactionChanged();
      notify({
        type: "success",
        title: editingId
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      notify({ type: "error", title: "Error saving transaction" });
    }
  };

  const handleDelete = async (transactionId) => {
    if (!canManageTransactions) {
      notify({ type: "info", title: "Viewer role cannot delete transactions" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await axios.delete(
        apiUrl(`/api/transactions/${userId}/${transactionId}`),
      );
      await fetchTransactions();
      onTransactionChanged();
      notify({ type: "success", title: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      notify({ type: "error", title: "Error deleting transaction" });
    }
  };

  const handleAddCategory = async ({ name, type }) => {
    if (!userId) {
      notify({ type: "error", title: "Please login again" });
      return { ok: false };
    }

    try {
      const response = await axios.post(apiUrl("/api/categories"), {
        name,
        type,
        userId,
      });

      await fetchCategories();
      setFormData((prev) => ({
        ...prev,
        type,
        category: response.data?.category?.name || name,
      }));

      notify({ type: "success", title: "Category added successfully" });
      return {
        ok: true,
        name: response.data?.category?.name || name,
      };
    } catch (error) {
      const message =
        error?.response?.data?.error || "Unable to add category right now";
      notify({ type: "error", title: message });
      return { ok: false };
    }
  };

  const handleEdit = (transaction) => {
    if (!canManageTransactions) {
      notify({ type: "info", title: "Viewer role cannot edit transactions" });
      return;
    }

    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split("T")[0],
    });
    setEditingId(transaction._id);
    setShowForm(true);
    onModeChange("form");
  };

  const handleCancelForm = async () => {
    resetForm();
    setShowForm(false);
    onModeChange("list");
    await fetchTransactions();
    onTransactionChanged();
  };

  const availableCategories = categories.filter(
    (cat) => cat.type === formData.type,
  );

  const handleApplyFilters = (nextFilters) => {
    setCurrentPage(1);
    setFilters(nextFilters);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setFilters({
      category: "",
      type: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      year: "",
    });
  };

  return (
    <div className="flex-1 pb-8 pt-4 sm:pt-24 min-h-screen overflow-y-hidden md:py-8 md:pt-8">
      <div className="mx-auto px-2 md:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Transactions</h1>
            <p className="mt-2 text-sm max-w-100 text-justify font-medium text-on-secondary-container md:text-left">
              Detailed ledger of your architectural capital movements and
              operational liquidity.
            </p>
          </div>

          {canManageTransactions && (
            <button
              type="button"
              onClick={() => {
                if (!canManageTransactions) {
                  notify({
                    type: "info",
                    title: "Switch to Admin role to create transactions",
                  });
                  return;
                }

                const nextShowForm = !showForm;
                setShowForm(nextShowForm);
                onModeChange(nextShowForm ? "form" : "list");
                if (!nextShowForm) {
                  resetForm();
                }
              }}
              className="self-start rounded-full bg-primary px-4 py-2 text-lg font-semibold text-white transition hover:bg-primary-fixed-dim disabled:opacity-70 sm:self-auto"
            >
              <span className="inline-flex items-center gap-2">
                {showForm ? (
                  <ArrowLeft className="h-5 w-5" strokeWidth={3} />
                ) : (
                  <Plus className="h-5 w-5" strokeWidth={3} />
                )}

                {showForm ? "Back" : canManageTransactions ? "Create" : "View"}
              </span>
            </button>
          )}
        </div>

        {showForm ? (
          <TransactionForm
            editingId={editingId}
            formData={formData}
            availableCategories={availableCategories}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            onAddCategory={handleAddCategory}
          />
        ) : (
          <TransactionList
            categories={categories}
            searchTerm={searchTerm}
            onSearchChange={(nextSearch) => {
              setCurrentPage(1);
              setSearchTerm(nextSearch);
            }}
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            loading={loading}
            transactions={transactions}
            pagination={pagination}
            onPreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            onNextPage={() =>
              setCurrentPage((prev) =>
                pagination.hasNextPage ? prev + 1 : prev,
              )
            }
            onEdit={handleEdit}
            onDelete={handleDelete}
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
}

export default Transaction;
