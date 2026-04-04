import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/home.css";
import { useState } from "react";
import axios from "axios";
import { useActionNotifier } from "@/hooks/useActionNotifier";

function Signup() {
  const navigate = useNavigate();
  const { notify } = useActionNotifier();

  const [form, setform] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      notify({ type: "error", title: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post("https://zorvyn-task-lemon.vercel.app/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      console.log(response.data);
      notify({ type: "success", title: "User registered successfully" });
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      notify({
        type: "error",
        title:
          error?.response?.data?.error ||
          "An unexpected error occurred. Please try again.",
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
          <div className="relative bg-surface-container-lowest rounded-full p-8 md:p-10 border border-outline-variant/15 shadow-sm">
            <div className="mb-10 text-center">
              <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-3">
                Begin Your Legacy
              </h1>
              <p className="text-on-secondary-container">
                Secure your financial future with planning.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">
                  Full Name
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3 material-symbols-outlined text-outline">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="Alexander Hamilton"
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low focus:ring-2 focus:ring-primary-fixed-dim"
                    onChange={(e) => setform({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

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
                    onChange={(e) =>
                      setform({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full mt-2 px-4 py-3 bg-surface-container-low"
                    onChange={(e) =>
                      setform({ ...form, password: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant">
                    Confirm
                  </label>
                  <input
                    type="password"
                    className="w-full mt-2 px-4 py-3 bg-surface-container-low "
                    onChange={(e) =>
                      setform({ ...form, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <p className="text-sm text-on-secondary-container">
                  I accept the{" "}
                  <span className="text-primary font-semibold">Terms</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-[#00286d] hover:text-white hover:bg-[#00286d] transition-all duration-300 font-bold border border-gray-400  "
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-on-secondary-container">
                Already have an account?{" "}
                <span className="text-primary font-bold cursor-pointer hover:underline">
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
