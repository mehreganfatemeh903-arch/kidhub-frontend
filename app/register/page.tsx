"use client";

import Link from "next/link";
import { useState } from "react";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(username.trim(), email.trim(), password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-80px)] px-4 py-12 flex items-center justify-center"
    >
      <section className="w-full max-w-md">
        <div
          className="rounded-3xl border p-7 sm:p-9 shadow-sm"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-card-border)",
          }}
        >
          <div className="text-center mb-8">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
              }}
            >
              ✨
            </div>

            <h1
              className="text-3xl font-extrabold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              ثبت‌نام در کیدهاب
            </h1>

            <p className="text-sm leading-7 text-gray-500">
              حساب کاربری خود را بسازید و تجربه شخصی‌تری از کیدهاب داشته باشید.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold mb-2"
              >
                نام کاربری
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="یک نام کاربری انتخاب کنید"
                autoComplete="username"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "var(--color-background)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                ایمیل
                <span className="mr-1 font-normal text-gray-400">
                  (اختیاری)
                </span>
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                className="w-full rounded-xl border px-4 py-3 outline-none transition"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "var(--color-background)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "var(--color-background)",
                }}
              />

              <p className="mt-2 text-xs text-gray-400">
                بهتر است رمز عبور حداقل ۸ کاراکتر داشته باشد.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "در حال ثبت‌نام..." : "ایجاد حساب کاربری"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-gray-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              وارد شوید
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
