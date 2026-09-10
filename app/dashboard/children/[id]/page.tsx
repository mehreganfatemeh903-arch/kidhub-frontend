"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getChildProfiles, type ChildProfile } from "@/lib/api";

export default function ChildDetailPage() {
  const params = useParams();
  const childId = Number(params.id);

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChild() {
      try {
        const children = await getChildProfiles();
        const found = children.find((item) => item.id === childId);

        if (!found) {
          setError("پروفایل کودک پیدا نشد.");
          return;
        }

        setChild(found);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "خطا در دریافت اطلاعات کودک"
        );
      } finally {
        setLoading(false);
      }
    }

    if (childId) {
      loadChild();
    }
  }, [childId]);

  if (loading) {
    return (
      <main className="min-h-[70vh] px-4 py-10" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
          در حال دریافت اطلاعات کودک...
        </div>
      </main>
    );
  }

  if (error || !child) {
    return (
      <main className="min-h-[70vh] px-4 py-10" dir="rtl">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "پروفایل کودک پیدا نشد."}
          </div>

          <Link
            href="/dashboard"
            className="mt-5 inline-block font-bold text-[var(--color-secondary)]"
          >
            ← بازگشت به داشبورد
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] px-4 py-10 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-bold text-[var(--color-secondary)]"
        >
          ← بازگشت به داشبورد
        </Link>

        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-5xl">
              🧒
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--color-primary)]">
                پروفایل کودک
              </p>

              <h1 className="mt-1 text-3xl font-extrabold">
                {child.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                تاریخ تولد: {child.birth_date}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">علایق کودک</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {child.interests.length > 0 ? (
                child.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-[var(--color-primary)]"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  هنوز علاقه‌ای ثبت نشده است.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">اهداف رشد</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {child.goals.length > 0 ? (
                child.goals.map((goal) => (
                  <span
                    key={goal}
                    className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-[var(--color-secondary)]"
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  هنوز هدف رشدی ثبت نشده است.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-[var(--color-primary)]">
            قدم بعدی
          </p>

          <h2 className="mt-2 text-2xl font-extrabold">
            پیشنهادهای هوشمند KidHub
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-500">
            بر اساس سن، علایق و اهداف رشد این کودک، در مرحله بعد پیشنهادهای
            شخصی‌سازی‌شده کتاب، اسباب‌بازی و فعالیت‌های آموزشی ارائه خواهد شد.
          </p>
        </section>
      </div>
    </main>
  );
}