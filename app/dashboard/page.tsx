"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getChildProfiles, type ChildProfile } from "@/lib/api";
import { getUsername, isLoggedIn } from "@/lib/auth";

export default function DashboardPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isLoggedIn()) {
        window.location.href = "/login";
        return;
      }

      try {
        const profiles = await getChildProfiles();
        setChildren(profiles);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "خطایی در دریافت اطلاعات رخ داد."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="min-h-[70vh] px-4 py-10 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-2 text-sm font-medium text-[var(--color-secondary)]">
            پنل والدین
          </p>

          <h1 className="text-3xl font-extrabold text-[var(--color-ink)]">
            سلام {getUsername() || "والد عزیز"} 👋
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-600">
            اینجا می‌توانید پروفایل کودک را مدیریت کنید و در ادامه پیشنهادهای
            هوشمند آموزشی و محصولات مناسب او را دریافت کنید.
          </p>
        </section>

        <section className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">فرزندان من</h2>
            <p className="mt-1 text-sm text-gray-500">
              پروفایل‌های کودک برای شخصی‌سازی پیشنهادها
            </p>
          </div>

          <Link
            href="/dashboard/children/new"
            className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            + افزودن کودک
          </Link>
        </section>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
            در حال دریافت اطلاعات...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && children.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[var(--color-card-border)] bg-white p-10 text-center">
            <div className="mb-4 text-5xl">🧸</div>

            <h3 className="text-xl font-bold">
              هنوز پروفایلی برای کودک ایجاد نشده است.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              با ساختن پروفایل کودک، KidHub می‌تواند پیشنهادهای مناسب‌تری برای
              سن، علایق و اهداف رشدی کودک ارائه دهد.
            </p>

            <Link
              href="/dashboard/children/new"
              className="mt-6 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-3 font-bold text-white"
            >
              ساخت پروفایل کودک
            </Link>
          </div>
        )}

        {!loading && !error && children.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <Link
                href={`/dashboard/children/${child.id}`}
                key={child.id}
                className="block rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                  🧸
                </div>

                <h3 className="text-xl font-bold">{child.name}</h3>

                <p className="mt-2 text-sm text-gray-500">
                  تاریخ تولد: {child.birth_date}
                </p>

                <div className="mt-5">
                  <p className="text-xs font-bold text-gray-500">علایق</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {child.interests.length > 0 ? (
                      child.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-orange-50 px-3 py-1 text-xs text-[var(--color-primary)]"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        ثبت نشده
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-500">
                    اهداف رشد
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {child.goals.length > 0 ? (
                      child.goals.map((goal) => (
                        <span
                          key={goal}
                          className="rounded-full bg-teal-50 px-3 py-1 text-xs text-[var(--color-secondary)]"
                        >
                          {goal}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        ثبت نشده
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
