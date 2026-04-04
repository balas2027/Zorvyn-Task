import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_16px_48px_-16px_rgba(0,29,51,0.22)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-on-secondary-container">
          404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-sm font-medium text-on-secondary-container sm:text-base">
          The page you are looking for does not exist or the link is invalid.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-fixed-dim"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
