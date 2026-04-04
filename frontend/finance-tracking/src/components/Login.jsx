import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/home.css";
import { useActionNotifier } from "@/hooks/useActionNotifier";
import { apiUrl } from "@/config/api";

function Login() {
  const navigate = useNavigate();
  const { notify } = useActionNotifier();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      notify({ type: "error", title: "All fields are required" });
      return;
    }

    try {
      const response = await axios.post(apiUrl("/api/login"), {
        email: form.email,
        password: form.password,
      });

      if (response?.data?.userId) {
        localStorage.setItem("userId", response.data.userId);
      }

      notify({ type: "success", title: "Login successful" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      notify({
        type: "error",
        title:
          error?.response?.data?.error || "Failed to login. Please try again.",
      });
    }
  }

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface">
      <header className="flex items-center justify-end px-6 py-4 lg:px-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-secondary hover:text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Back</span>
        </button>
      </header>

      <main className="flex items-center justify-center bg-surface">
        <div className="w-full max-w-xl relative">
          <div className="relative bg-surface-container-lowest rounded-full p-8 md:p-10 border border-black/10 shadow-sm">
            <div className="mb-10 text-center">
              <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-3">
                Welcome Back
              </h1>
              <p className="text-on-secondary-container">
                Sign in to continue your financial journey.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">
                  Email
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3 material-symbols-outlined text-outline">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="alexander@architect.com"
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low focus:ring-2 focus:ring-primary-fixed-dim"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">
                  Password
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3 material-symbols-outlined text-outline">
                    lock
                  </span>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low focus:ring-2 focus:ring-primary-fixed-dim"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <p className="text-sm text-on-secondary-container">
                  Remember me
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-[#00286d] hover:text-white hover:bg-[#00286d] transition-all duration-300 font-bold border border-gray-400"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-on-secondary-container">
                Don&apos;t have an account?{" "}
                <span
                  className="text-primary font-bold cursor-pointer hover:underline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
