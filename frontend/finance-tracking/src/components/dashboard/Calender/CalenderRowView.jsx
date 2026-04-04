import React from "react";
import { Box, Typography } from "@mui/material";
import { format, isSameDay, isSameMonth } from "date-fns";

function CalenderRowView({
  week,
  currentDate,
  selectedDate,
  transactionsByDay,
  onDateClick,
}) {
  const today = new Date();

  return (
    <Box className="flex w-full min-w-175">
      {week.map((date) => {
        const isCurrentMonth = isSameMonth(date, currentDate);
        const isToday = isSameDay(date, today);
        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
        const dayKey = format(date, "yyyy-MM-dd");
        const dayTransactions = transactionsByDay.get(dayKey) || [];

        return (
          <Box
            key={dayKey}
            onClick={() => onDateClick(date)}
            className={`relative flex h-44 cursor-pointer flex-col border-r border-b border-gray-200 p-2 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"} ${isSelected ? "bg-blue-50 ring-2 ring-inset ring-blue-400" : ""}`}
            sx={{ width: "14.2857%", flexShrink: 0 }}
          >
            <Box className="mb-3 flex items-start justify-between">
              <Typography
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${isToday ? "bg-green-600 text-white" : "text-gray-700"}`}
              >
                {format(date, "d")}
              </Typography>
            </Box>

            <Box className="flex flex-1 flex-col gap-2 overflow-hidden">
              {dayTransactions.slice(0, 3).map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <Box
                    key={`${transaction.type}-${transaction.id}`}
                    className={`truncate rounded-xl px-3 py-2 text-[11px] font-medium ${isIncome ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                  >
                    {transaction.title}
                  </Box>
                );
              })}
              {dayTransactions.length > 3 && (
                <Typography className="px-1 text-[11px] font-medium text-gray-500">
                  + {dayTransactions.length - 3} more
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default CalenderRowView;
