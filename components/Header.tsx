"use client";

import Link from "next/link";
import { useState } from "react";
import AuthNav from "@/components/AuthNav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-card-border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-xl shadow-sm">
            🧸
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[var(--color-primary)]">
              کیدهاب
            </span>
            <span className="hidden text-[11px] font-medium text-gray-500 sm:block">
              انتخاب هوشمند برای رشد کودک
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            خانه
          </Link>

          <Link
            href="/toys"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            اسباب‌بازی‌ها
          </Link>

          <Link
            href="/books"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            کتاب‌ها
          </Link>

          <Link
            href="/articles"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            مجله والدین
          </Link>

          <Link
            href="/about"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            درباره ما
          </Link>

          <Link
            href="/contact"
            className="font-medium transition hover:text-[var(--color-primary)]"
          >
            تماس با ما
          </Link>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/"
            className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            پیشنهاد هوشمند
          </Link>

          <AuthNav />
        </div>

        <button
          type="button"
          aria-label="باز کردن منو"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-card-border)] text-xl lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--color-card-border)] bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">

            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              خانه
            </Link>

            <Link
              href="/toys"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              اسباب‌بازی‌ها
            </Link>

            <Link
              href="/books"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              کتاب‌ها
            </Link>

            <Link
              href="/articles"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              مجله والدین
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              درباره ما
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--color-bg)]"
            >
              تماس با ما
            </Link>

            <Link
              href="/"
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-center font-bold text-white"
            >
              پیشنهاد هوشمند
            </Link>

            <div className="mt-3 border-t border-[var(--color-card-border)] pt-3">
              <AuthNav />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
