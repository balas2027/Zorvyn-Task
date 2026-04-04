const express = require("express");
const cors = require("cors");
const { User, Expense, Income, Category, Transaction } = require("./model");
const { connectToMongo } = require("./db");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  if (req.path === "/" || req.path === "/api") {
    return next();
  }

  try {
    await connectToMongo();
    return next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return res.status(503).json({ error: "Database unavailable" });
  }
});

const DEFAULT_USER_SETTINGS = {
  notifications: {
    email: true,
    transactionAlerts: true,
    weeklyReports: true,
  },
  preferences: {
    currency: "USD",
    timezone: "Asia/Kolkata",
  },
  security: {
    twoFactorEnabled: false,
  },
};

const mergeUserSettings = (settings = {}) => ({
  notifications: {
    ...DEFAULT_USER_SETTINGS.notifications,
    ...(settings.notifications || {}),
  },
  preferences: {
    ...DEFAULT_USER_SETTINGS.preferences,
    ...(settings.preferences || {}),
  },
  security: {
    ...DEFAULT_USER_SETTINGS.security,
    ...(settings.security || {}),
  },
});

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  bio: user.bio || "",
  settings: mergeUserSettings(user.settings),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

app.get("/api", async (req, res) => {
  res.send("Welcome to Finance Tracker API");
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Finance Tracker backend is running" });
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists. Try to Register with a different email.",
      });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({
      email,
      password,
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users/:userId/profile", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: serializeUser(user) });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/users/:userId/profile", async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, bio, preferences } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && String(existingUser._id) !== String(userId)) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }

    if (name !== undefined) {
      user.name = name;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (bio !== undefined) {
      user.bio = bio;
    }

    const nextSettings = mergeUserSettings(user.settings);
    if (preferences && typeof preferences === "object") {
      nextSettings.preferences = {
        ...nextSettings.preferences,
        ...preferences,
      };
    }
    user.settings = nextSettings;

    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/users/:userId/settings", async (req, res) => {
  const { userId } = req.params;
  const { notifications, preferences, security } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nextSettings = mergeUserSettings(user.settings);

    if (notifications && typeof notifications === "object") {
      nextSettings.notifications = {
        ...nextSettings.notifications,
        ...notifications,
      };
    }

    if (preferences && typeof preferences === "object") {
      nextSettings.preferences = {
        ...nextSettings.preferences,
        ...preferences,
      };
    }

    if (security && typeof security === "object") {
      nextSettings.security = {
        ...nextSettings.security,
        ...security,
      };
    }

    user.settings = nextSettings;
    await user.save();

    return res.status(200).json({
      message: "Settings updated successfully",
      settings: nextSettings,
    });
  } catch (err) {
    console.error("Error updating user settings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/users/:userId/password", async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (String(newPassword).length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Promise.all([
      Income.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      User.deleteOne({ _id: userId }),
    ]);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting user account:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/categories", async (req, res) => {
  const { name, type, userId } = req.body;
  try {
    if (!name || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid category type" });
    }

    const normalizedName = String(name).trim();
    if (!normalizedName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const duplicate = await Category.findOne({
      userId: userId || null,
      type,
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (duplicate) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({
      name: normalizedName,
      type,
      userId: userId || null,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const { type, userId } = req.query;
    const query = {
      $or: [{ userId: null }, { userId: { $exists: false } }],
    };

    if (userId) {
      query.$or.push({ userId });
    }

    if (type) {
      query.type = type;
    }

    const dbCategories = await Category.find(query).lean();

    // If userId is provided, include categories inferred from user transaction data.
    if (!userId) {
      return res.status(200).json({ categories: dbCategories });
    }

    const [incomeDocs, expenseDocs, transactionDocs] = await Promise.all([
      Income.find({ userId }).lean(),
      Expense.find({ userId }).lean(),
      Transaction.find({ userId }).select("category type").lean(),
    ]);

    const categoryMap = new Map();

    const addCategory = (name, categoryType, source = "derived") => {
      const normalizedName = (name || "").trim();
      if (!normalizedName || !categoryType) {
        return;
      }
      if (type && categoryType !== type) {
        return;
      }
      const key = `${categoryType}::${normalizedName.toLowerCase()}`;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          _id: key,
          name: normalizedName,
          type: categoryType,
          source,
        });
      }
    };

    dbCategories.forEach((item) =>
      addCategory(item.name, item.type, "category"),
    );
    incomeDocs.forEach((item) =>
      addCategory(item.category || item.name, "income"),
    );
    expenseDocs.forEach((item) =>
      addCategory(item.category || item.name, "expense"),
    );
    transactionDocs.forEach((item) => addCategory(item.category, item.type));

    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    res.status(200).json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/incomes", async (req, res) => {
  const { userId, category, name, value, date } = req.body;
  try {
    if (!userId || !category || !name || value === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const income = await Income.findOne({ userId, category });
    if (income) {
      income.IncomeData.push({ name, value, date: date || new Date() });
      await income.save();
    } else {
      const newIncome = new Income({
        userId,
        category,
        IncomeData: [{ name, value, date: date || new Date() }],
      });
      await newIncome.save();
    }
    res.status(201).json({ message: "Income added successfully" });
  } catch (err) {
    console.error("Error adding income:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  const { userId, category, name, value, date } = req.body;
  try {
    if (!userId || !category || !name || value === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const expense = await Expense.findOne({ userId, category });
    if (expense) {
      expense.ExpensesData.push({ name, value, date: date || new Date() });
      await expense.save();
    } else {
      const newExpense = new Expense({
        userId,
        category,
        ExpensesData: [{ name, value, date: date || new Date() }],
      });
      await newExpense.save();
    }
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  res.status(201).json({ message: "Expense added successfully" });
});

// Transaction CRUD Endpoints
app.post("/api/transactions", async (req, res) => {
  const { userId, description, amount, category, type, date } = req.body;
  try {
    if (!userId || !description || !amount || !category || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    const transaction = new Transaction({
      userId,
      description,
      amount,
      category,
      type,
      date: date || new Date(),
    });
    await transaction.save();
    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    category,
    type,
    search,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    year,
    page = 1,
    limit = 15,
  } = req.query;

  try {
    const query = { userId };
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 15, 1);
    const skip = (parsedPage - 1) * parsedLimit;
    const parsedMinAmount =
      minAmount !== undefined && minAmount !== "" ? Number(minAmount) : null;
    const parsedMaxAmount =
      maxAmount !== undefined && maxAmount !== "" ? Number(maxAmount) : null;
    const parsedYear = year ? Number(year) : null;

    let effectiveStartDate = startDate ? new Date(startDate) : null;
    let effectiveEndDate = endDate ? new Date(endDate) : null;

    if (Number.isNaN(effectiveStartDate?.getTime())) {
      effectiveStartDate = null;
    }
    if (Number.isNaN(effectiveEndDate?.getTime())) {
      effectiveEndDate = null;
    }

    if (parsedYear && Number.isFinite(parsedYear)) {
      const yearStart = new Date(parsedYear, 0, 1, 0, 0, 0, 0);
      const yearEnd = new Date(parsedYear, 11, 31, 23, 59, 59, 999);
      effectiveStartDate = effectiveStartDate
        ? new Date(Math.max(effectiveStartDate.getTime(), yearStart.getTime()))
        : yearStart;
      effectiveEndDate = effectiveEndDate
        ? new Date(Math.min(effectiveEndDate.getTime(), yearEnd.getTime()))
        : yearEnd;
    }

    if (
      effectiveStartDate &&
      effectiveEndDate &&
      effectiveStartDate.getTime() > effectiveEndDate.getTime()
    ) {
      return res.status(200).json({
        data: [],
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: parsedPage > 1,
        },
      });
    }

    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    const searchValue = typeof search === "string" ? search.trim() : "";
    if (searchValue) {
      const searchRegex = new RegExp(searchValue, "i");
      query.description = searchRegex;
    }
    if (effectiveStartDate || effectiveEndDate) {
      query.date = {};
      if (effectiveStartDate) {
        query.date.$gte = effectiveStartDate;
      }
      if (effectiveEndDate) {
        query.date.$lte = effectiveEndDate;
      }
    }
    if (
      (parsedMinAmount !== null && Number.isFinite(parsedMinAmount)) ||
      (parsedMaxAmount !== null && Number.isFinite(parsedMaxAmount))
    ) {
      query.amount = {};
      if (parsedMinAmount !== null && Number.isFinite(parsedMinAmount)) {
        query.amount.$gte = parsedMinAmount;
      }
      if (parsedMaxAmount !== null && Number.isFinite(parsedMaxAmount)) {
        query.amount.$lte = parsedMaxAmount;
      }
    }

    const transactionDocs = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    const transactionsFromCollection = transactionDocs.map((item) => ({
      _id: item._id,
      userId: item.userId,
      description: item.description,
      amount: item.amount,
      category: item.category || "Uncategorized",
      type: item.type,
      date: item.date,
      source: "transaction",
    }));

    const legacyTransactions = [
      ...incomes.flatMap((incomeDoc) =>
        incomeDoc.IncomeData.map((item) => ({
          _id: item._id,
          userId,
          description: item.name,
          amount: item.value,
          category: incomeDoc.category || incomeDoc.name || "Uncategorized",
          type: "income",
          date: item.date,
          source: "legacy",
        })),
      ),
      ...expenses.flatMap((expenseDoc) =>
        expenseDoc.ExpensesData.map((item) => ({
          _id: item._id,
          userId,
          description: item.name,
          amount: item.value,
          category: expenseDoc.category || expenseDoc.name || "Uncategorized",
          type: "expense",
          date: item.date,
          source: "legacy",
        })),
      ),
    ]
      .filter((item) => (category ? item.category === category : true))
      .filter((item) => (type ? item.type === type : true))
      .filter((item) => {
        if (!searchValue) {
          return true;
        }
        return String(item.description || "")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      })
      .filter((item) => {
        if (!effectiveStartDate && !effectiveEndDate) {
          return true;
        }
        const itemDate = new Date(item.date);
        if (effectiveStartDate && itemDate < effectiveStartDate) {
          return false;
        }
        if (effectiveEndDate && itemDate > effectiveEndDate) {
          return false;
        }
        return true;
      })
      .filter((item) => {
        const amount = Number(item.amount);
        if (
          parsedMinAmount !== null &&
          Number.isFinite(parsedMinAmount) &&
          amount < parsedMinAmount
        ) {
          return false;
        }
        if (
          parsedMaxAmount !== null &&
          Number.isFinite(parsedMaxAmount) &&
          amount > parsedMaxAmount
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const combinedTransactions = [
      ...transactionsFromCollection,
      ...legacyTransactions,
    ]
      .filter((item) => (category ? item.category === category : true))
      .filter((item) => (type ? item.type === type : true))
      .filter((item) => {
        if (!searchValue) {
          return true;
        }
        return String(item.description || "")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      })
      .filter((item) => {
        if (!effectiveStartDate && !effectiveEndDate) {
          return true;
        }
        const itemDate = new Date(item.date);
        if (effectiveStartDate && itemDate < effectiveStartDate) {
          return false;
        }
        if (effectiveEndDate && itemDate > effectiveEndDate) {
          return false;
        }
        return true;
      })
      .filter((item) => {
        const amount = Number(item.amount);
        if (
          parsedMinAmount !== null &&
          Number.isFinite(parsedMinAmount) &&
          amount < parsedMinAmount
        ) {
          return false;
        }
        if (
          parsedMaxAmount !== null &&
          Number.isFinite(parsedMaxAmount) &&
          amount > parsedMaxAmount
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalTransactions = combinedTransactions.length;
    const paginatedTransactions = combinedTransactions.slice(
      skip,
      skip + parsedLimit,
    );

    return res.status(200).json({
      data: paginatedTransactions,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: totalTransactions,
        totalPages: Math.max(Math.ceil(totalTransactions / parsedLimit), 1),
        hasNextPage: parsedPage * parsedLimit < totalTransactions,
        hasPrevPage: parsedPage > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions/:userId/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;

  try {
    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ data: transaction });
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/transactions/:userId/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;
  const { description, amount, category, type, date } = req.body;

  try {
    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });
    if (transaction) {
      if (description) transaction.description = description;
      if (amount !== undefined) transaction.amount = amount;
      if (category) transaction.category = category;
      if (type) transaction.type = type;
      if (date) transaction.date = date;

      await transaction.save();
      return res.status(200).json({
        message: "Transaction updated successfully",
        transaction,
      });
    }

    // Legacy fallback: update data stored inside Income/Expense documents.
    const legacyIncome = await Income.findOne({
      userId,
      "IncomeData._id": transactionId,
    });
    if (legacyIncome) {
      const legacyItem = legacyIncome.IncomeData.id(transactionId);
      if (!legacyItem) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      const targetType = type || "income";
      const targetCategory = category || legacyIncome.category;
      const nextPayload = {
        name: description || legacyItem.name,
        value: amount !== undefined ? amount : legacyItem.value,
        date: date || legacyItem.date,
      };

      if (targetType === "income" && targetCategory === legacyIncome.category) {
        legacyItem.name = nextPayload.name;
        legacyItem.value = nextPayload.value;
        legacyItem.date = nextPayload.date;
        await legacyIncome.save();
      } else {
        legacyItem.deleteOne();
        await legacyIncome.save();
        const targetDoc =
          targetType === "income"
            ? await Income.findOneAndUpdate(
                { userId, category: targetCategory },
                { $push: { IncomeData: nextPayload } },
                { new: true, upsert: true },
              )
            : await Expense.findOneAndUpdate(
                { userId, category: targetCategory },
                { $push: { ExpensesData: nextPayload } },
                { new: true, upsert: true },
              );
        if (!targetDoc) {
          return res
            .status(500)
            .json({ error: "Unable to move legacy transaction" });
        }
      }

      return res
        .status(200)
        .json({ message: "Transaction updated successfully" });
    }

    const legacyExpense = await Expense.findOne({
      userId,
      "ExpensesData._id": transactionId,
    });
    if (legacyExpense) {
      const legacyItem = legacyExpense.ExpensesData.id(transactionId);
      if (!legacyItem) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      const targetType = type || "expense";
      const targetCategory = category || legacyExpense.category;
      const nextPayload = {
        name: description || legacyItem.name,
        value: amount !== undefined ? amount : legacyItem.value,
        date: date || legacyItem.date,
      };

      if (
        targetType === "expense" &&
        targetCategory === legacyExpense.category
      ) {
        legacyItem.name = nextPayload.name;
        legacyItem.value = nextPayload.value;
        legacyItem.date = nextPayload.date;
        await legacyExpense.save();
      } else {
        legacyItem.deleteOne();
        await legacyExpense.save();
        const targetDoc =
          targetType === "income"
            ? await Income.findOneAndUpdate(
                { userId, category: targetCategory },
                { $push: { IncomeData: nextPayload } },
                { new: true, upsert: true },
              )
            : await Expense.findOneAndUpdate(
                { userId, category: targetCategory },
                { $push: { ExpensesData: nextPayload } },
                { new: true, upsert: true },
              );
        if (!targetDoc) {
          return res
            .status(500)
            .json({ error: "Unable to move legacy transaction" });
        }
      }

      return res
        .status(200)
        .json({ message: "Transaction updated successfully" });
    }

    return res.status(404).json({ error: "Transaction not found" });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/transactions/:userId/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId,
    });
    if (transaction) {
      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    }

    const legacyIncome = await Income.findOne({
      userId,
      "IncomeData._id": transactionId,
    });
    if (legacyIncome) {
      legacyIncome.IncomeData.pull({ _id: transactionId });
      await legacyIncome.save();
      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    }

    const legacyExpense = await Expense.findOne({
      userId,
      "ExpensesData._id": transactionId,
    });
    if (legacyExpense) {
      legacyExpense.ExpensesData.pull({ _id: transactionId });
      await legacyExpense.save();
      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    }

    return res.status(404).json({ error: "Transaction not found" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/summary/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalIncome = incomes.reduce((sum, income) => {
      return (
        sum +
        income.IncomeData.reduce((incomeSum, item) => incomeSum + item.value, 0)
      );
    }, 0);

    const totalExpense = expenses.reduce((sum, expense) => {
      return (
        sum +
        expense.ExpensesData.reduce(
          (expenseSum, item) => expenseSum + item.value,
          0,
        )
      );
    }, 0);

    const balance = totalIncome - totalExpense;

    const incomeArray = incomes.map((income) => ({
      category: income.category || income.name || "Uncategorized",
      data: income.IncomeData,
    }));

    const expenseArray = expenses.map((expense) => ({
      category: expense.category || expense.name || "Uncategorized",
      data: expense.ExpensesData,
    }));

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      incomesdata: incomeArray,
      expensesdata: expenseArray,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
