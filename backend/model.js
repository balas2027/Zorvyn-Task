const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        transactionAlerts: {
          type: Boolean,
          default: true,
        },
        weeklyReports: {
          type: Boolean,
          default: true,
        },
      },
      preferences: {
        currency: {
          type: String,
          default: "USD",
        },
        timezone: {
          type: String,
          default: "Asia/Kolkata",
        },
      },
      security: {
        twoFactorEnabled: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const CategorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  name: String,
  type: {
    type: String,
    enum: ["income", "expense"],
  },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const IncomeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    category: String,

    IncomeData: [
      {
        name: String,
        value: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Income = mongoose.models.Income || mongoose.model("Income", IncomeSchema);

const ExpenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    category: String,

    ExpensesData: [
      {
        name: String,
        value: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

const TransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

module.exports = {
  User,
  Income,
  Expense,
  Category,
  Transaction,
};
