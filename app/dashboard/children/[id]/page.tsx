"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getChildProfiles,
  getChildRecommendations,
  updateChildProfile,
  deleteChildProfile,
  getMediaUrl,
  ChildProfile,
  Recommendation,
} from "@/lib/api";

function calculateAge(ageMonths: number | null, birthDate: string) {
  if (ageMonths !== null) {
    if (ageMonths < 12) return `${ageMonths} ماهه`;
    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;
    return months > 0 ? `${years} سال و ${months} ماه` : `${years} ساله`;
  }

  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0) return months > 0 ? `${months} ماهه` : "کمتر از یک ماه";
  return months > 0 ? `${years} سال و ${months} ماه` : `${years} ساله`;
}

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

function RecommendationCard({ item }: { item: Recommendation }) {
  const isToy = item.type === "toy";
  const image = isToy
    ? getMediaUrl(item.image ?? null)
    : getMediaUrl(item.cover_image ?? null);

  return (
    <article className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-orange-50 to-teal-50">
        {image ? (
          <img
            src={image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">
            {isToy ? "🧸" : "📚"}
          </div>
        )}

        <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-gray-700 shadow-sm">
          {isToy ? "🧸 اسباب‌بازی" : "📚 کتاب"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="min-w-0 text-lg font-black leading-8 text-gray-900">
            {item.title}
          </h3>

          <div className="w-24 shrink-0">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400">
                تطابق
              </span>
              <span className="text-xs font-black text-emerald-700">
                {item.score}٪
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(item.score, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {item.match_reasons?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.match_reasons.map((reason, index) => (
              <span
                key={`${reason}-${index}`}
                className="rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary)]"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm leading-7 text-gray-600">
          {isToy ? item.short_description : item.description}
        </p>

        {isToy && item.why_it_helps && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4">
            <p className="mb-1 text-xs font-black text-amber-900">
              چرا برای کودک مناسب است؟
            </p>
            <p className="text-xs leading-6 text-amber-800">
              {item.why_it_helps}
            </p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {isToy && item.price_range && (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
              💰 بازه قیمت: {item.price_range}
            </p>
          )}

          {!isToy && item.book_type && (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
              📖 نوع محتوا:{" "}
              {item.book_type === "audio"
                ? "کتاب صوتی"
                : item.book_type === "video"
                  ? "ویدئو / انیمیشن"
                  : "کتاب متنی"}
            </p>
          )}

          {!isToy && item.source_name && (
            <p className="text-xs text-gray-400">
              منبع: {item.source_name}
            </p>
          )}
        </div>

        {isToy && item.affiliate_url && (
          <a
            href={item.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-2xl bg-gray-900 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-gray-800"
          >
            مشاهده محصول ←
          </a>
        )}

        {!isToy && item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-2xl bg-gray-900 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-gray-800"
          >
            مشاهده منبع ←
          </a>
        )}
      </div>
    </article>
  );
}

export default function ChildDetailPage() {
  const params = useParams();
  const childId = Number(params.id);

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    birth_date: "",
    interests: "",
    goals: "",
  });

  const [loadingChild, setLoadingChild] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [error, setError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");

  const handleEdit = () => {
    if (!child) return;

    setEditForm({
      name: child.name,
      birth_date: child.birth_date,
      interests: child.interests.join(", "),
      goals: child.goals.join(", "),
    });

    setSaveError("");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!child) return;

    if (!editForm.name.trim()) {
      setSaveError("نام کودک را وارد کنید.");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const updated = await updateChildProfile(child.id, {
        name: editForm.name.trim(),
        birth_date: editForm.birth_date,
        interests: editForm.interests
          .split(/[,،]/)
          .map((item) => item.trim())
          .filter(Boolean),
        goals: editForm.goals
          .split(/[,،]/)
          .map((item) => item.trim())
          .filter(Boolean),
      });

      setChild(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "خطا در ذخیره پروفایل کودک"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!child) return;

    const confirmed = window.confirm(
      `آیا از حذف پروفایل «${child.name}» مطمئن هستید؟`
    );

    if (!confirmed) return;

    try {
      await deleteChildProfile(child.id);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "خطا در حذف پروفایل کودک"
      );
    }
  };

  useEffect(() => {
    async function loadChild() {
      try {
        setLoadingChild(true);
        setError("");

        const children = await getChildProfiles();
        const found = children.find((item) => item.id === childId);

        if (!found) {
          setError("پروفایل کودک پیدا نشد.");
          return;
        }

        setChild(found);

        try {
          setLoadingRecommendations(true);
          setRecommendationError("");

          const data = await getChildRecommendations(found.id);

          setRecommendations(data.recommendations || []);
          setAgeMonths(data.age_months);
        } catch {
          setRecommendationError(
            "دریافت پیشنهادهای هوشمند با مشکل مواجه شد."
          );
        } finally {
          setLoadingRecommendations(false);
        }
      } catch {
        setError("خطا در دریافت اطلاعات کودک.");
      } finally {
        setLoadingChild(false);
      }
    }

    if (childId) loadChild();
  }, [childId]);

  if (loadingChild) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="h-8 w-48 rounded-xl bg-gray-100" />
            <div className="mt-4 h-5 w-72 rounded-xl bg-gray-100" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-32 rounded-3xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !child) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-6xl">😕</div>

          <p className="mt-5 font-black text-red-600">
            {error || "پروفایل کودک پیدا نشد."}
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-2xl bg-gray-900 px-6 py-3 text-sm font-black text-white"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </main>
    );
  }

  const age = calculateAge(ageMonths, child.birth_date);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Header */}
        <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-teal-100/50 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-bold text-gray-500 transition hover:text-[var(--color-primary)]"
              >
                ← بازگشت به داشبورد
              </Link>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                پروفایل فعال
              </span>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-orange-100 to-teal-100 text-4xl shadow-sm">
                    🧸
                  </div>

                  <div>
                    <p className="text-xs font-black text-[var(--color-primary)]">
                      مدیریت پروفایل کودک
                    </p>

                    <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
                      {child.name}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                      {age} · متولد {formatDate(child.birth_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  ✏️ ویرایش پروفایل
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                >
                  حذف پروفایل
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Edit */}
        {isEditing && (
          <section className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-black text-[var(--color-primary)]">
                ویرایش اطلاعات
              </p>
              <h2 className="mt-1 text-xl font-black text-gray-900">
                اطلاعات پروفایل کودک
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-gray-700">
                  نام کودک
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-gray-700">
                  تاریخ تولد
                </label>
                <input
                  type="date"
                  value={editForm.birth_date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      birth_date: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-gray-700">
                  علایق
                </label>
                <input
                  type="text"
                  value={editForm.interests}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      interests: e.target.value,
                    })
                  }
                  placeholder="مثلاً ورزش، ساختنی"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
                <p className="mt-2 text-xs text-gray-400">
                  موارد را با ویرگول جدا کنید.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-gray-700">
                  اهداف رشد
                </label>
                <input
                  type="text"
                  value={editForm.goals}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      goals: e.target.value,
                    })
                  }
                  placeholder="مثلاً مهارت حرکتی، یادگیری"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
                <p className="mt-2 text-xs text-gray-400">
                  موارد را با ویرگول جدا کنید.
                </p>
              </div>
            </div>

            {saveError && (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                ⚠️ {saveError}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaveError("");
                }}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-gray-700 transition hover:bg-gray-50"
              >
                انصراف
              </button>
            </div>
          </section>
        )}

        {/* Overview */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-gray-400">سن کودک</p>
              <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-lg">
                🎂
              </span>
            </div>
            <p className="mt-4 text-xl font-black text-gray-900">{age}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-gray-400">تعداد علایق</p>
              <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-lg">
                ❤️
              </span>
            </div>
            <p className="mt-4 text-xl font-black text-gray-900">
              {child.interests.length} مورد
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-gray-400">اهداف رشد</p>
              <span className="rounded-xl bg-teal-50 px-2.5 py-1.5 text-lg">
                🎯
              </span>
            </div>
            <p className="mt-4 text-xl font-black text-gray-900">
              {child.goals.length} مورد
            </p>
          </div>
        </section>

        {/* Interests / Goals */}
        <section className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[var(--color-primary)]">
                  شخصی‌سازی
                </p>
                <h2 className="mt-1 text-lg font-black text-gray-900">
                  علایق کودک
                </h2>
              </div>
              <span className="text-2xl">❤️</span>
            </div>

            <div className="mt-5 flex min-h-10 flex-wrap gap-2">
              {child.interests.length > 0 ? (
                child.interests.map((interest, index) => (
                  <span
                    key={`${interest}-${index}`}
                    className="inline-flex whitespace-nowrap rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-[var(--color-primary)]"
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
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[var(--color-secondary)]">
                  مسیر رشد
                </p>
                <h2 className="mt-1 text-lg font-black text-gray-900">
                  اهداف رشدی
                </h2>
              </div>
              <span className="text-2xl">🎯</span>
            </div>

            <div className="mt-5 flex min-h-10 flex-wrap gap-2">
              {child.goals.length > 0 ? (
                child.goals.map((goal, index) => (
                  <span
                    key={`${goal}-${index}`}
                    className="inline-flex whitespace-nowrap rounded-full bg-teal-50 px-4 py-2 text-xs font-black text-[var(--color-secondary)]"
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
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-[var(--color-primary)]">
              ✨ پیشنهاد هوشمند
            </div>

            <h2 className="mt-3 text-2xl font-black text-gray-900">
              پیشنهادهای شخصی‌سازی‌شده برای {child.name}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-500">
              پیشنهادها بر اساس سن، علایق و اهداف رشد کودک رتبه‌بندی شده‌اند
              تا انتخاب مناسب برای والدین ساده‌تر شود.
            </p>
          </div>

          {loadingRecommendations && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-[2rem] bg-white shadow-sm"
                >
                  <div className="h-60 bg-gray-100" />
                  <div className="p-5">
                    <div className="h-5 w-3/4 rounded bg-gray-100" />
                    <div className="mt-4 h-3 w-full rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingRecommendations && recommendationError && (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-7 text-center">
              <div className="text-4xl">⚠️</div>
              <p className="mt-3 font-black text-red-700">
                {recommendationError}
              </p>
            </div>
          )}

          {!loadingRecommendations &&
            !recommendationError &&
            recommendations.length === 0 && (
              <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
                <div className="text-5xl">🔎</div>
                <h3 className="mt-4 text-lg font-black text-gray-900">
                  هنوز پیشنهاد مناسبی پیدا نشد
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  با اضافه شدن محتوای بیشتر، پیشنهادهای دقیق‌تری نمایش داده
                  می‌شود.
                </p>
              </div>
            )}

          {!loadingRecommendations &&
            !recommendationError &&
            recommendations.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((item) => (
                  <RecommendationCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                  />
                ))}
              </div>
            )}
        </section>

        {/* Parent note */}
        <section className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-50 to-teal-50 p-6 sm:p-7">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              💡
            </div>

            <div>
              <h2 className="text-lg font-black text-blue-950">
                نکته مهم برای والدین
              </h2>

              <p className="mt-2 text-sm leading-8 text-blue-900">
                یک اسباب‌بازی خوب لزوماً گران یا الکترونیکی نیست. انتخاب مناسب
                باید با مرحله رشد کودک هماهنگ باشد و فرصت تعامل، بازی، خلاقیت،
                کشف و حل مسئله را فراهم کند.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
