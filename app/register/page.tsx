"use client";

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
      await register(username, email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">ثبت‌نام</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border rounded-md p-2"
          style={{ borderColor: "var(--color-card-border)" }}
        />
        <input
          type="email"
          placeholder="ایمیل (اختیاری)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md p-2"
          style={{ borderColor: "var(--color-card-border)" }}
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded-md p-2"
          style={{ borderColor: "var(--color-card-border)" }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="text-white rounded-md py-2"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <a href="/login" style={{ color: "var(--color-primary)" }}>
          ورود
        </a>
      </p>
    </main>
  );
}
