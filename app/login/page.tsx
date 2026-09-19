"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username.trim(), password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ورود انجام نشد. لطفاً دوباره تلاش کنید."
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
              👋
            </div>

            <h1
              className="text-3xl font-extrabold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              ورود به کیدهاب
            </h1>

            <p className="text-sm leading-7 text-gray-500">
              برای دسترسی به حساب کاربری و امکانات شخصی خود وارد شوید.
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
                placeholder="نام کاربری خود را وارد کنید"
                autoComplete="username"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2"
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
                autoComplete="current-password"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "var(--color-background)",
                }}
              />
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
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-gray-500">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
