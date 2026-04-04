import React from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const buildMiniCalendarRows = ({
  currentDate,
  selectedDate,
  setCurrentDate,
  onDateSelect,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let index = 0; index < 7; index += 1) {
      const cloneDay = day;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      days.push(
        <Box
          key={day.toString()}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[11px] ${isSelected ? "bg-blue-600 font-bold text-white" : isToday ? "bg-green-600 font-bold text-white" : !isCurrentMonth ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => {
            setCurrentDate(cloneDay);
            onDateSelect?.(cloneDay);
          }}
        >
          {format(day, "d")}
        </Box>,
      );
      day = addDays(day, 1);
    }

    rows.push(
      <Box
        key={day.toString()}
        className="flex w-full justify-between px-1 py-1"
      >
        {days}
      </Box>,
    );
    days = [];
  }

  return rows;
};

function CalenderSidebar({
  currentDate,
  setCurrentDate,
  selectedDate,
  onDateSelect,
  filter,
}) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const miniCalendarRows = buildMiniCalendarRows({
    currentDate,
    selectedDate,
    setCurrentDate,
    onDateSelect,
  });

  return (
    <div className="flex h-full w-full gap-3 flex-col">
      <Box className="mb-6 flex items-center  justify-between">
        <Typography className="text-sm font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </Typography>
        <Box className="flex items-center gap-1">
          <IconButton
            onClick={() => setCurrentDate(addMonths(currentDate, -1))}
            size="small"
          >
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <IconButton
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            size="small"
          >
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </Box>
      </Box>

      <Box className="mb-4 flex w-full justify-between px-1">
        {weekDays.map((label) => (
          <Typography
            key={label}
            className="w-8 text-center text-[10px] font-medium text-gray-500"
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box className="flex flex-col gap-1">{miniCalendarRows}</Box>

      <Divider className="" />

      <Box className="mt-3">
        <Typography className="mb-3 text-sm font-semibold text-gray-800">
          Activity Types
        </Typography>
        <List dense className="p-0 flex">
          <ListItemButton
            className="rounded-lg"
            sx={{ opacity: filter === "all" || filter === "income" ? 1 : 0.4 }}
          >
            <Box className="mr-3 h-4 w-4 rounded bg-emerald-500" />
            <ListItemText
              primary="Income"
              primaryTypographyProps={{ className: "text-sm" }}
            />
          </ListItemButton>
          <ListItemButton
            className="rounded-lg"
            sx={{ opacity: filter === "all" || filter === "expense" ? 1 : 0.4 }}
          >
            <Box className="mr-3 h-4 w-4 rounded bg-red-500" />
            <ListItemText
              primary="Expense"
              primaryTypographyProps={{ className: "text-sm" }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Typography className="text-xs text-gray-400">
        Click any date to view the day transactions
      </Typography>
    </div>
  );
}

export default CalenderSidebar;
