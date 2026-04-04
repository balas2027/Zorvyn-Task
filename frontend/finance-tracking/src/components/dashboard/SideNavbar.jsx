import React, { useState } from "react";
import { CalendarDays, X } from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5A1.5 1.5 0 0 1 10.5 12h-5A1.5 1.5 0 0 1 4 10.5v-5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5.5A1.5 1.5 0 0 1 13.5 4h5A1.5 1.5 0 0 1 20 5.5v3A1.5 1.5 0 0 1 18.5 10h-5A1.5 1.5 0 0 1 12 8.5v-3ZM4 14.5A1.5 1.5 0 0 1 5.5 13h5A1.5 1.5 0 0 1 12 14.5v5A1.5 1.5 0 0 1 10.5 21h-5A1.5 1.5 0 0 1 4 19.5v-5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15.5A1.5 1.5 0 0 1 13.5 14h5A1.5 1.5 0 0 1 20 15.5v5A1.5 1.5 0 0 1 18.5 22h-5A1.5 1.5 0 0 1 12 20.5v-5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Transactions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10h8M8 14h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Calendar",
    icon: <CalendarDays className="h-full w-full" />,
  },
  {
    label: "Insights",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 16l5-5 4 4 7-8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 7h4v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M10.5 4.5h3l.7 2.2a7.8 7.8 0 0 1 1.8 1.1l2.2-.6 1.5 2.7-1.7 1.6c.1.5.1 1 0 1.5l1.7 1.6-1.5 2.7-2.2-.6c-.6.4-1.2.8-1.8 1.1l-.7 2.2h-3l-.7-2.2c-.6-.3-1.2-.7-1.8-1.1l-2.2.6-1.5-2.7 1.7-1.6a6 6 0 0 1 0-1.5L4.3 10l1.5-2.7 2.2.6c.6-.4 1.2-.8 1.8-1.1l.7-2.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
];

function SideNavbar(props) {
  const [internalActiveItem, setInternalActiveItem] = useState("Dashboard");
  const {
    isOpen = true,
    onClose = () => {},
    onSelectItem = () => {},
    activeItem,
  } = props;

  const currentActiveItem = activeItem || internalActiveItem;

  const handleSelect = (label) => {
    setInternalActiveItem(label);
    onSelectItem(label);
  };

  const navigationList = (
    <nav className="flex flex-col gap-2 px-4 pb-6 md:px-5">
      {navigationItems.map((item) => {
        const isActive = currentActiveItem === item.label;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => handleSelect(item.label)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white text-primary"
                : "text-[#5c708b] hover:bg-white/75 hover:text-primary"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isActive ? "bg-surface-container-low" : "bg-transparent"
              }`}
            >
              <span className="h-5 w-5">{item.icon}</span>
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-900/30 md:hidden" />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/70 bg-[#eaf2ff] transition-all duration-300 md:static md:z-auto md:h-full md:shadow-none ${
          isOpen
            ? "w-60 translate-x-0 shadow-2xl md:w-60 md:translate-x-0"
            : "w-60 -translate-x-full md:w-0 md:overflow-hidden md:translate-x-0"
        }`}
      >
        <div className="flex pt-6 justify-between p-4">
          <h1 className="text-xl font-bold pl-3 text-primary">Menu</h1>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5c708b] hover:bg-red-500 hover:text-white duration-300 transition "
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="">{navigationList}</div>

        <div className="mt-auto px-5 pb-6">
          <div className="rounded-3xl bg-white/75 p-4 shadow-[0_10px_30px_rgba(0,40,109,0.06)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a99af]">
              User Profile
            </p>
            <p className="mt-2 text-sm leading-6 text-center text-[#5c708b]">
              {props.userName || "Loading..."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideNavbar;
