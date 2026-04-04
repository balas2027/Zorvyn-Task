import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { DataDashboardContext } from "@/context/DashboardDataContext";
import CalenderRowView from "./CalenderRowView";
import CalenderSidebar from "./CalenderSidebar";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const buildTransactionItems = (dashboardData) => {
  const incomeTransactions = (dashboardData?.incomesdata || []).flatMap(
    (group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        title: item.name || "Income",
        category: group.category || "Uncategorized",
        amount: item.value,
        dateTime: item.date,
        type: "income",
      })),
  );

  const expenseTransactions = (dashboardData?.expensesdata || []).flatMap(
    (group) =>
      (group?.data || []).map((item) => ({
        id: item._id,
        title: item.name || "Expense",
        category: group.category || "Uncategorized",
        amount: item.value,
        dateTime: item.date,
        type: "expense",
      })),
  );

  return [...incomeTransactions, ...expenseTransactions].sort(
    (first, second) => new Date(second.dateTime) - new Date(first.dateTime),
  );
};

const buildMonthMatrix = (currentDate) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dates = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    dates.push(day);
    day = addDays(day, 1);
  }

  return dates.reduce((weeks, date, index) => {
    if (index % 7 === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(date);
    return weeks;
  }, []);
};

const groupTransactionsByDay = (transactions) => {
  const map = new Map();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.dateTime);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = format(date, "yyyy-MM-dd");
    const entry = {
      ...transaction,
      date,
      timeLabel: format(date, "HH:mm"),
    };

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(entry);
  });

  map.forEach((entries, key) => {
    map.set(
      key,
      entries.sort((first, second) => first.date - second.date),
    );
  });

  return map;
};

const CalendarDayTimeline = ({ selectedDate, transactions, onBackToMonth }) => {
  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const dayTransactions = transactions.get(selectedKey) || [];
  const incomeTotal = dayTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenseTotal = dayTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <Paper className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-gray-200 shadow-none">
      <Box className="flex items-center justify-between border-b gap-30 md:gap-0 border-gray-200 px-6 py-4">
        <Box>
          <Typography className="text-18 font-bold text-primary">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </Typography>
          <Typography className="mt-1 text-sm text-gray-500">
            {dayTransactions.length} transaction
            {dayTransactions.length === 1 ? "" : "s"} on this day
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onBackToMonth}
          startIcon={<ArrowLeft className="h-4 w-4" />}
          sx={{ borderRadius: "20px", textTransform: "none" }}
        >
          Month View
        </Button>
      </Box>

      <Box className="grid gap-4 border-b border-gray-200 px-6 py-4 sm:grid-cols-3">
        <Box className="rounded-2xl bg-emerald-50 p-4">
          <Typography className="text-12 font-semibold uppercase tracking-widest text-emerald-700">
            Income
          </Typography>
          <Typography className="mt-2 text-22 font-bold text-emerald-700">
            {formatCurrency(incomeTotal)}
          </Typography>
        </Box>
        <Box className="rounded-2xl bg-red-50 p-4">
          <Typography className="text-12 font-semibold uppercase tracking-widest text-red-700">
            Expense
          </Typography>
          <Typography className="mt-2 text-22 font-bold text-red-700">
            {formatCurrency(expenseTotal)}
          </Typography>
        </Box>
        <Box className="rounded-2xl bg-blue-50 p-4">
          <Typography className="text-12 font-semibold uppercase tracking-widest text-primary">
            Net
          </Typography>
          <Typography className="mt-2 text-22 font-bold text-primary">
            {formatCurrency(incomeTotal - expenseTotal)}
          </Typography>
        </Box>
      </Box>

      <Box className="flex-1 overflow-y-auto p-6">
        {dayTransactions.length ? (
          <div className="space-y-4">
            {dayTransactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <div
                  key={`${transaction.type}-${transaction.id}`}
                  className="rounded-3xl border border-black/10 bg-surface-container-lowest p-5 shadow-[0_8px_24px_-12px_rgba(0,29,51,0.12)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isIncome ? "bg-emerald-100" : "bg-red-100"}`}
                      >
                        {isIncome ? (
                          <TrendingUp className="h-5 w-5 text-emerald-700" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-700" />
                        )}
                      </div>
                      <div>
                        <Typography className="text-15 font-bold text-on-surface">
                          {transaction.title}
                        </Typography>
                        <Typography className="mt-1 text-sm text-on-secondary-container">
                          {transaction.category}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <Typography className="flex items-center gap-1 text-sm text-on-secondary-container sm:justify-end">
                          <Clock3 className="h-4 w-4" />
                          {transaction.timeLabel}
                        </Typography>
                        <Typography
                          className={`mt-1 text-lg font-bold ${isIncome ? "text-emerald-700" : "text-red-700"}`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-black/10 bg-surface-container/40 text-sm font-medium text-on-secondary-container">
            No transactions found for this day.
          </div>
        )}
      </Box>
    </Paper>
  );
};

const CalendarMonthGrid = ({
  currentDate,
  selectedDate,
  onDateClick,
  transactionsByDay,
}) => {
  const weeks = useMemo(() => buildMonthMatrix(currentDate), [currentDate]);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const focusDate = selectedDate || currentDate;

  const currentWeek = useMemo(() => {
    const matchedWeek = weeks.find((week) =>
      week.some((date) => isSameDay(date, focusDate)),
    );
    return matchedWeek || weeks[0] || [];
  }, [weeks, focusDate]);

  return (
    <Paper className="hidden md:flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-gray-200 shadow-none">
      <Box className=" w-full flex flex-row border-b border-gray-200 bg-surface-container-low px-6 py-3">
        {weekDays.map((day) => (
          <Box
            key={day}
            className="flex items-center  justify-center border-gray-100 py-3"
            sx={{ width: "14%", flexShrink: 0 }}
          >
            <Typography
              variant="body2"
              className="text-sm font-semibold text-gray-600"
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box className="flex flex-1 flex-col bg-white md:overflow-y-auto">
        <Box className="overflow-x-auto md:hidden">
          <CalenderRowView
            key={`mobile-${format(currentWeek[0] || focusDate, "yyyy-MM-dd")}`}
            week={currentWeek}
            currentDate={currentDate}
            selectedDate={selectedDate}
            transactionsByDay={transactionsByDay}
            onDateClick={onDateClick}
          />
        </Box>

        <Box className="hidden md:flex md:flex-col">
          {weeks.map((week, weekIndex) => (
            <CalenderRowView
              key={`${format(week[0], "yyyy-MM-dd")}-${weekIndex}`}
              week={week}
              currentDate={currentDate}
              selectedDate={selectedDate}
              transactionsByDay={transactionsByDay}
              onDateClick={onDateClick}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

function Calender({ dashboardData: dashboardDataProp }) {
  const dashboardContext = useContext(DataDashboardContext);
  const dashboardData =
    dashboardDataProp ?? dashboardContext?.dashboardData ?? null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const transactions = useMemo(
    () => buildTransactionItems(dashboardData),
    [dashboardData],
  );

  const visibleTransactions = useMemo(() => {
    if (filter === "income") {
      return transactions.filter(
        (transaction) => transaction.type === "income",
      );
    }

    if (filter === "expense") {
      return transactions.filter(
        (transaction) => transaction.type === "expense",
      );
    }

    return transactions;
  }, [transactions, filter]);

  const transactionsByDay = useMemo(
    () => groupTransactionsByDay(visibleTransactions),
    [visibleTransactions],
  );

  const totals = useMemo(
    () =>
      transactions.reduce(
        (accumulator, transaction) => {
          accumulator[transaction.type] += Number(transaction.amount) || 0;
          return accumulator;
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  );

  const currentMonthYear = format(currentDate, "MMMM yyyy");
  const isDayView = selectedDate !== null;

  const handleFilterChange = (_, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <Box className="flex flex-col gap-4 border-b border-gray-200  px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Box className="flex items-center  gap-3 sm:flex-row sm:items-center sm:gap-4">
            {isDayView ? (
              <>
                <Typography className="text-lg font-bold text-primary sm:text-2xl">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </Typography>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(null);
                  }}
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                >
                  Current Month
                </Button>
                <Box className="flex items-center">
                  <IconButton
                    onClick={() => setCurrentDate(addMonths(currentDate, -1))}
                    size="small"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    size="small"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </IconButton>
                </Box>
                <Typography className="text-lg font-bold text-primary sm:text-2xl">
                  {currentMonthYear}
                </Typography>
              </>
            )}
          </Box>

          <Box className="flex flex-wrap items-center gap-3">
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{
                borderRadius: "20px",
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderColor: "divider",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { backgroundColor: "primary.dark" },
                  },
                },
                "& .MuiToggleButton-root:first-of-type": {
                  borderRadius: "20px 0 0 20px",
                },
                "& .MuiToggleButton-root:last-of-type": {
                  borderRadius: "0 20px 20px 0",
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="income">Income</ToggleButton>
              <ToggleButton value="expense">Expense</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <div className="flex flex-1 flex-col-reverse md:grid md:grid-cols-1 overflow-visible xl:min-h-0 xl:overflow-hidden xl:grid-cols-[1fr_20rem]">
          <Box className="flex min-h-0 flex-1 p-2 md:p-4">
            {isDayView ? (
              <CalendarDayTimeline
                selectedDate={selectedDate}
                transactions={transactionsByDay}
                onBackToMonth={() => setSelectedDate(null)}
              />
            ) : (
              <CalendarMonthGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
                transactionsByDay={transactionsByDay}
              />
            )}
          </Box>

          <Box className="min-h-0 border-l border-gray-200 bg-white p-4 lg:p-5">
            <CalenderSidebar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateClick}
              filter={filter}
              transactions={visibleTransactions}
              totals={totals}
            />
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Calender;
