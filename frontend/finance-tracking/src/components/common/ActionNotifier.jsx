import React, { useCallback, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ActionNotifierContext } from "@/context/ActionNotifierContext";

function ToastItem({ item, onClose }) {
  const stylesByType = {
    success: {
      container: "border-emerald-300/60 bg-emerald-50 text-emerald-800",
      icon: CheckCircle2,
    },
    error: {
      container: "border-red-300/60 bg-red-50 text-red-700",
      icon: AlertCircle,
    },
    info: {
      container: "border-blue-300/60 bg-blue-50 text-blue-800",
      icon: Info,
    },
  };

  const selected = stylesByType[item.type] || stylesByType.info;
  const Icon = selected.icon;

  return (
    <div
      className={`pointer-events-auto w-80 rounded-2xl border px-4 py-3 shadow-[0_12px_35px_-12px_rgba(0,29,51,0.45)] backdrop-blur-sm ${selected.container}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5">{item.title}</p>
          {item.message ? (
            <p className="mt-0.5 text-xs font-medium opacity-90">
              {item.message}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-full p-1 transition hover:bg-black/10"
          aria-label="Close notification"
          onClick={() => onClose(item.id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ActionNotifierProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((options) => {
    const nextOptions =
      typeof options === "string" ? { title: options } : options;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextItem = {
      id,
      type: nextOptions?.type || "info",
      title: nextOptions?.title || "Action completed",
      message: nextOptions?.message || "",
    };

    setNotifications((prev) => [...prev, nextItem]);

    const timeout =
      typeof nextOptions?.duration === "number" ? nextOptions.duration : 1000;
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, timeout);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ActionNotifierContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-fit max-w-[calc(100vw-1rem)] flex-col gap-2 sm:right-6 sm:top-6">
        {notifications.map((item) => (
          <ToastItem key={item.id} item={item} onClose={removeNotification} />
        ))}
      </div>
    </ActionNotifierContext.Provider>
  );
}
