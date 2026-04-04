import React, { useState } from "react";

function TransactionForm({
  editingId,
  formData,
  availableCategories,
  onInputChange,
  onSubmit,
  onCancel,
  onAddCategory = async () => ({ ok: false }),
}) {
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: formData.type || "expense",
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const openCategoryPopup = () => {
    setCategoryForm({
      name: "",
      type: formData.type || "expense",
    });
    setIsCategoryPopupOpen(true);
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) {
      return;
    }

    setIsAddingCategory(true);
    const result = await onAddCategory({
      name: categoryForm.name.trim(),
      type: categoryForm.type,
    });
    setIsAddingCategory(false);

    if (result?.ok) {
      setIsCategoryPopupOpen(false);
      onInputChange({
        target: {
          name: "category",
          value: result.name,
        },
      });
      onInputChange({
        target: {
          name: "type",
          value: categoryForm.type,
        },
      });
    }
  };

  return (
    <>
      <div className="bg-surface-container-low p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_-8px_rgba(0,29,51,0.06)] border border-black/10 mb-8">
        <h3 className="text-lg font-bold text-primary mb-6">
          {editingId ? "Edit Transaction" : "Add New Transaction"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="e.g., Grocery Shopping"
                className="w-full px-4 py-2 rounded-xl border border-black/10 focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={onInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 rounded-xl border border-black/10 focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={onInputChange}
                className="w-full px-4 py-2 rounded-xl border border-black/10 focus:ring-0"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-on-surface">
                  Category
                </label>
                <button
                  type="button"
                  onClick={openCategoryPopup}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Add Category
                </button>
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="w-full px-4 py-2 rounded-xl border border-black/10 focus:ring-0"
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onInputChange}
                className="w-full px-4 py-2 rounded-xl border border-black/10 focus:ring-0"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-fixed-dim transition"
            >
              {editingId ? "Update" : "Add"} Transaction
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-xl border border-black/10 text-sm font-semibold text-primary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isCategoryPopupOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_42px_-10px_rgba(0,29,51,0.35)]">
            <h4 className="text-lg font-bold text-primary">Add Category</h4>
            <p className="mt-1 text-sm text-on-secondary-container">
              Create a new category to use in your transaction form.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleCreateCategory}>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g., Investments"
                  className="w-full rounded-xl border border-black/10 px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Category Type
                </label>
                <select
                  value={categoryForm.type}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-black/10 px-4 py-2"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryPopupOpen(false)}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-primary"
                  disabled={isAddingCategory}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={isAddingCategory || !categoryForm.name.trim()}
                >
                  {isAddingCategory ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TransactionForm;
