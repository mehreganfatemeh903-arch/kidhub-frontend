"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createChildProfile } from "@/lib/api";

const interestOptions = [
  "پازل",
  "نقاشی",
  "کتاب",
  "ساختنی",
  "موسیقی",
  "علوم",
  "ورزش",
  "داستان",
];

const goalOptions = [
  "خلاقیت",
  "حل مسئله",
  "تمرکز",
  "مهارت اجتماعی",
  "زبان و گفتار",
  "مهارت حرکتی",
  "اعتمادبه‌نفس",
  "یادگیری",
];

export default function NewChildPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleItem(
    value: string,
    current: string[],
    setter: (items: string[]) => void
  ) {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!localStorage.getItem("kidhub_access")) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      await createChildProfile({
        name,
        birth_date: birthDate,
        interests,
        goals,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "خطا در ایجاد پروفایل کودک"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] px-4 py-10 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-5 text-sm font-medium text-[var(--color-secondary)]"
          >
            ← بازگشت به داشبورد
          </button>

          <p className="mb-2 text-sm font-medium text-[var(--color-primary)]">
            پروفایل کودک
          </p>

          <h1 className="text-3xl font-extrabold">
            اطلاعات کودک را وارد کنید
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            این اطلاعات به KidHub کمک می‌کند پیشنهادهای آموزشی و محصولات
            مناسب‌تری برای کودک ارائه دهد.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                نام کودک
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="مثلاً آریا"
                className="w-full rounded-xl border p-3 outline-none focus:ring-2"
                style={{ borderColor: "var(--color-card-border)" }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                تاریخ تولد
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                required
                className="w-full rounded-xl border p-3 outline-none"
                style={{ borderColor: "var(--color-card-border)" }}
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">علایق کودک</h2>
            <p className="mt-1 text-sm text-gray-500">
              موارد مورد علاقه را انتخاب کنید.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() =>
                      toggleItem(interest, interests, setInterests)
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-white text-gray-700"
                    }`}
                    style={{
                      borderColor: selected
                        ? "var(--color-primary)"
                        : "var(--color-card-border)",
                    }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">اهداف رشد</h2>
            <p className="mt-1 text-sm text-gray-500">
              هدف‌هایی که می‌خواهید KidHub در پیشنهادها در نظر بگیرد.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {goalOptions.map((goal) => {
                const selected = goals.includes(goal);

                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleItem(goal, goals, setGoals)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-[var(--color-secondary)] text-white"
                        : "bg-white text-gray-700"
                    }`}
                    style={{
                      borderColor: selected
                        ? "var(--color-secondary)"
                        : "var(--color-card-border)",
                    }}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ذخیره..." : "ذخیره پروفایل کودک"}
          </button>
        </form>
      </div>
    </main>
  );
}
