import React from "react";

function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-surface-container-lowest px-5 py-4 shadow-[0_8px_24px_-12px_rgba(0,29,51,0.12)]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-on-secondary-container">
          {label}
        </span>
      </div>
    </div>
  );
}

export default PageLoader;
