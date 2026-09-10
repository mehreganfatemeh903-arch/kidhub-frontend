"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoggedIn, getUsername, logout } from "@/lib/auth";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUsername(getUsername());
  }, []);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    setUsername(null);
    window.location.href = "/";
  }

  if (loggedIn) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/dashboard"
          className="rounded-lg px-3 py-2 font-medium transition hover:bg-orange-50"
          style={{ color: "var(--color-primary)" }}
        >
          داشبورد والدین
        </Link>

        <span className="hidden sm:inline text-gray-500">
          {username} خوش آمدید
        </span>

        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 font-medium transition hover:bg-orange-50"
          style={{ color: "var(--color-primary)" }}
        >
          خروج
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 font-medium transition hover:bg-gray-50"
      >
        ورود
      </Link>

      <Link
        href="/register"
        className="rounded-lg px-4 py-2 font-semibold text-white shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        ثبت‌نام
      </Link>
    </div>
  );
}
