import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div className="bg-background text-on-surface  font-body selection:bg-primary-container selection:text-white">
          <div className="w-full top-0 fixed z-50 bg-[#f7f9ff] backdrop-blur-xl dark:bg-[#001d33]">
            <div className="flex justify-between items-center px-2 sm:px-8 h-20 max-w-7xl mx-auto">
              <div
                className="text-lg sm:text-xl font-bold w-1/2 tracking-tighter text-[#00286d] dark:text-[#edf4ff] font-headline cursor-pointer"
                onClick={() => navigate("/")}
              >
                The Financial Architect
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a
                  className="font-headline font-bold hover:underline-offset-4 hover:scale-110 duration-300 hover:underline tracking-tight text-sm text-[#4b637e] dark:text-[#d1e4ff] "
                  href="/"
                >
                  Home
                </a>
                <a
                  className="font-headline font-bold hover:underline-offset-4 hover:scale-110 duration-300 hover:underline tracking-tight text-sm text-[#4b637e] dark:text-[#d1e4ff]  transition-all px-3 py-1 rounded-lg"
                  href="#product"
                >
                  Product
                </a>
                <a
                  className="font-headline font-bold hover:underline-offset-4 hover:scale-110 duration-300 hover:underline tracking-tight text-sm text-[#4b637e] dark:text-[#d1e4ff]  transition-all px-3 py-1 rounded-lg"
                  href="#reviews"
                >
                  Reviews
                </a>
                <a
                  className="font-headline font-bold hover:underline-offset-4 hover:scale-110 duration-300 hover:underline tracking-tight text-sm text-[#4b637e] dark:text-[#d1e4ff]  transition-all px-3 py-1 rounded-lg"
                  href="#pricing"
                >
                  Pricing
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="text-[#004D40] w-full hover:scale-110  dark:text-white font-headline font-bold tracking-tight text-sm px-4 py-2  transition-all rounded-lg cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="border border-primary text-primary w-full bg-white font-headline font-bold tracking-tight text-sm px-6 py-2.5 rounded-xl active:scale-95 duration-200 shadow-lg shadow-primary/20 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden pt-25 py-10 md:py-24 px-2 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold tracking-wider uppercase mb-6">
                Intelligent Wealth Management
              </span>
              <h1 className="font-headline text-4xl  md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1] mb-8">
                Architect Your <br />
                <span className="text-tertiary-fixed-dim">
                  Financial Future
                </span>
              </h1>
              <p className="text-on-secondary-container text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                Experience a higher standard of wealth tracking. Simple
                automated flows combined with powerful, editorial-grade insights
                designed for the sophisticated investor.
              </p>
              <div className="flex flex-row gap-4">
                <button
                  className="primary-gradient text-white px-8 py-4 rounded-xl font-headline font-bold sm:text-lg shadow-xl shadow-primary/25 active:scale-95 transition-all cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Start Free Trial
                </button>
                <button className="border border-black/10 text-primary px-8 py-4 rounded-xl font-headline font-bold sm:text-lg hover:bg-surface-container-low transition-all cursor-pointer">
                  View Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-tertiary-container/10 rounded-full blur-3xl"></div>
              <div className="relative bg-surface-container-lowest p-2 rounded-lg shadow-2xl transform">
                <img
                  alt="Financial Dashboard"
                  className="rounded-lg w-full h-auto object-cover border border-surface-container"
                  data-alt="Modern minimalist financial dashboard showing clean line charts and wealth distribution graphs in deep blue and teal tones"
                  loading="lazy"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpR5nOzSII_1-DW0CwBOCDdAxKG6OhlEoZ05zU5wT7l054SEF1z_bJomIf761mdC2GC6P7prb3R7s8iAOBVinNHpzW0hQCnk2yeItiF8iCWq_J0eX2QLDRPIk_vtfMuyUSMcPMXgfTa_rRH5CIB7c6VFjWGKtsCv6pR2eSJTAWGwUWNZ7cGk2NGHl62-H53UszLRQiol4OH_INrjF9aAxcpNDBDWhybOeese-VFedhNqp-oPcxckfPnQ7Ao57jKpueuLb9TZohYdCJ"
                />
                <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl shadow-xl max-w-7xl bg-white hidden md:block">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="material-symbols-outlined text-tertiary-fixed-dim"
                      data-icon="trending_up"
                    >
                      trending_up
                    </span>
                    <span className="text-xs font-bold text-primary font-headline uppercase tracking-tighter">
                      Net Worth Growth
                    </span>
                  </div>
                  <div className="text-2xl text-center font-extrabold text-primary font-headline">
                    +12.4%
                  </div>
                  <div className="text-[10px] text-on-secondary-container mt-1 uppercase tracking-widest font-medium">
                    Monthly Outperformance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="product" className="py-10 md:py-24 px-2 sm:px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">
                Precision Engineered Features
              </h2>
              <p className="text-on-secondary-container max-w-2xl mx-auto">
                Every tool you need to visualize, manage, and expand your
                portfolio with total clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-high p-10 group rounded-full group hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary-container/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-primary text-3xl animate-spin-continuous"
                    data-icon="autorenew"
                  >
                    autorenew
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                  Automated Tracking
                </h3>
                <p className="text-on-secondary-container leading-relaxed">
                  Seamlessly sync all your accounts. Our engine categorizes
                  transactions with 99% accuracy in real-time.
                </p>
              </div>

              <div className="bg-surface-container-high p-10 rounded-full group hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-tertiary-container/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-tertiary text-3xl"
                    data-icon="insights"
                    data-weight="fill"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    insights
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                  Smart Insights
                </h3>
                <p className="text-on-secondary-container leading-relaxed">
                  Advanced AI models predict future cash flow and uncover hidden
                  optimization opportunities within your spending.
                </p>
              </div>

              <div className="bg-surface-container-high p-10 rounded-full group hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-primary text-3xl"
                    data-icon="encrypted"
                  >
                    encrypted
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                  Secure Vault
                </h3>
                <p className="text-on-secondary-container leading-relaxed">
                  Bank-grade 256-bit encryption. Your data is isolated,
                  anonymized, and protected by multi-factor biometric
                  authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="reviews" className="py-10 md:py-24 px-2 sm:px-8 overflow-hidden">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-5">
              <span
                className="material-symbols-outlined text-[20rem]"
                data-icon="format_quote"
              >
                format_quote
              </span>
            </div>
            <div className="text-center relative z-10">
              <div className="mb-10 inline-flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim"
                  data-icon="star"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim"
                  data-icon="star"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim"
                  data-icon="star"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim"
                  data-icon="star"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim"
                  data-icon="star"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <blockquote className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold text-primary leading-tight mb-12 tracking-tight italic">
                "The Financial Architect has completely transformed how I view
                my net worth. It's the first tool that feels as serious about my
                money as I am."
              </blockquote>
              <div className="flex flex-col items-center">
                <img
                  alt="User Portrait"
                  className="w-20 h-20 rounded-full border-4 border-surface-container mb-4 object-cover"
                  data-alt="Professional headshot of a successful middle-aged man in a tailored suit with a confident smile against a soft studio background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoRb8gr_TcN1ayHlgXEYw4qQiJfshhxGxA3wNp0s6asqEr0Zf1O1rhR_FN1dutuVG8ZhPVepOn5lkd58K5hT_V8umThUb2280hmWbkZ2BstvNX-nwuFVO8kGf-Ay2O4GgYzWPm04fw_UUeba2krhh_p5EvxenudcCDRcf0DdurunZTdS-UNUF33SrNjjWQ43Rua6Te8n4VWYnvbzgacQCHVeyZ3xBfYwznmXFRcX0BlLS7_sbCSdG_lxAqclEdDaWffoWgqypuucEN"
                />
                <cite className="not-italic">
                  <span className="block text-primary font-bold font-headline text-lg">
                    Julian Voss
                  </span>
                  <span className="block text-on-secondary-container text-sm font-medium uppercase tracking-widest">
                    Portfolio Manager
                  </span>
                </cite>
              </div>
            </div>
          </div>
        </div>

        <div id="pricing" className="py-10 md:py-24 px-2 sm:px-8">
          <div className="max-w-7xl mx-auto primary-gradient rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-fixed-dim rounded-full blur-[120px]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Join 10,000+ Architects
              </h2>
              <p className="text-blue-100/80 text-xl mb-12 max-w-xl mx-auto">
                Stop tracking in the past. Start designing your legacy with the
                world's most sophisticated financial platform.
              </p>
              <button
                className="bg-white text-primary px-10 py-5 rounded-xl font-headline font-extrabold text-xl hover:bg-surface-container-high transition-all active:scale-95 shadow-lg cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
              <p className="mt-8 text-blue-200/60 text-xs font-medium uppercase tracking-[0.2em]">
                No credit card required for trial
              </p>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#001d33]/15 bg-[#edf4ff] dark:bg-[#001d33]">
          <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 w-full max-w-7xl mx-auto">
            <div className="mb-8 md:mb-0">
              <div className="text-lg font-bold text-[#00286d] dark:text-[#edf4ff] font-headline mb-2">
                The Financial Architect
              </div>
              <div className="font-['Inter'] text-xs font-medium uppercase tracking-wider text-[#4b637e] dark:text-[#d8eaff]">
                © {new Date().getFullYear()} The Financial Architect. All rights
                reserved.
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a
                className="font-['Inter'] text-xs font-medium uppercase tracking-wider text-[#4b637e] dark:text-[#d8eaff] hover:text-[#00286d] dark:hover:text-[#48d7f9] transition-all"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="font-['Inter'] text-xs font-medium uppercase tracking-wider text-[#4b637e] dark:text-[#d8eaff] hover:text-[#00286d] dark:hover:text-[#48d7f9] transition-all"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="font-['Inter'] text-xs font-medium uppercase tracking-wider text-[#4b637e] dark:text-[#d8eaff] hover:text-[#00286d] dark:hover:text-[#48d7f9] transition-all"
                href="#"
              >
                Security
              </a>
              <a
                className="font-['Inter'] text-xs font-medium uppercase tracking-wider text-[#4b637e] dark:text-[#d8eaff] hover:text-[#00286d] dark:hover:text-[#48d7f9] transition-all"
                href="#"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
