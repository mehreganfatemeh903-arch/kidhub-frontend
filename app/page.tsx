import Link from "next/link";

type AgeGroup = {
  id: number;
  title: string;
  min_age_months: number;
  max_age_months: number;
  order: number;
  description: string;
};

async function getAgeGroups(): Promise<AgeGroup[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/age-groups/`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.value ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const ageGroups = await getAgeGroups();

  const sortedAgeGroups = [...ageGroups].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main dir="rtl">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div className="max-w-2xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "#FFF3E8",
                  color: "var(--color-primary)",
                }}
              >
                <span>✨</span>
                انتخاب هوشمند برای کودکان
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">
                بهترین انتخاب برای
                <span
                  className="block mt-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  رشد و شادی کودک
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                کیدهاب به والدین کمک می‌کند بر اساس سن، علاقه و نیازهای
                رشدی کودک، کتاب و اسباب‌بازی مناسب را راحت‌تر پیدا کنند.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/toys"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  شروع انتخاب
                </Link>

                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-bold transition hover:bg-white"
                  style={{
                    borderColor: "var(--color-card-border)",
                    color: "var(--color-secondary)",
                  }}
                >
                  راهنمای والدین
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
                <span>✓ متناسب با سن کودک</span>
                <span>✓ توجه به رشد و یادگیری</span>
                <span>✓ انتخاب ساده‌تر برای والدین</span>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-3xl"
                style={{ backgroundColor: "#FFD9C8" }}
              />

              <div
                className="relative rounded-[2rem] border p-6 shadow-sm sm:p-8"
                style={{
                  borderColor: "var(--color-card-border)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">انتخاب مناسب کودک</p>
                    <h2 className="mt-1 text-xl font-bold">
                      از کجا شروع کنیم؟
                    </h2>
                  </div>

                  <span className="text-4xl">🧸</span>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "#FFF8F2" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎂</span>
                      <div>
                        <p className="font-bold">سن کودک</p>
                        <p className="text-sm text-gray-500">
                          پیشنهادهای متناسب با سن
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "#F1F8F7" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <p className="font-bold">نیاز رشدی</p>
                        <p className="text-sm text-gray-500">
                          یادگیری، خلاقیت و مهارت‌ها
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "#FFF8F2" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❤️</span>
                      <div>
                        <p className="font-bold">علاقه کودک</p>
                        <p className="text-sm text-gray-500">
                          انتخاب نزدیک‌تر به علایق کودک
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-6 rounded-2xl p-4 text-center text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  به‌زودی: پیشنهاد شخصی‌سازی‌شده با هوش مصنوعی
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="border-y border-[var(--color-card-border)] bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              انتخاب سریع
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              کودک شما چند ساله است؟
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              با انتخاب گروه سنی، پیشنهادهای مناسب‌تر را سریع‌تر پیدا کنید.
            </p>
          </div>

          {sortedAgeGroups.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAgeGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: "var(--color-card-border)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{group.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {group.description}
                      </p>
                    </div>

                    <span className="text-3xl">🎈</span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Link
                      href={`/toys?age=${group.id}`}
                      className="rounded-lg py-2 text-center text-xs font-bold text-white transition hover:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      اسباب‌بازی
                    </Link>

                    <Link
                      href={`/books?age=${group.id}`}
                      className="rounded-lg py-2 text-center text-xs font-bold text-white transition hover:opacity-90"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      کتاب
                    </Link>

                    <Link
                      href={`/articles?age=${group.id}`}
                      className="rounded-lg py-2 text-center text-xs font-bold text-white transition hover:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      مقاله
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border bg-white p-8 text-center text-gray-500">
              در حال آماده‌سازی گروه‌های سنی...
            </div>
          )}

        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="max-w-2xl">
            <p
              className="text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              فراتر از یک فروشگاه
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              کیدهاب قرار است انتخاب را هوشمند کند
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              هدف کیدهاب فقط نمایش محصولات نیست؛ بلکه کمک به والدین برای
              تصمیم‌گیری آگاهانه درباره بازی، مطالعه و رشد کودک است.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div
              className="rounded-2xl border bg-white p-6"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <div className="text-3xl">🧠</div>
              <h3 className="mt-4 text-lg font-bold">
                پیشنهاد هوشمند
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                پیشنهادهایی بر اساس سن، علاقه و نیازهای رشدی کودک.
              </p>
            </div>

            <div
              className="rounded-2xl border bg-white p-6"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <div className="text-3xl">📚</div>
              <h3 className="mt-4 text-lg font-bold">
                محتوای کاربردی
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                راهنماها و مقاله‌هایی برای کمک به والدین در انتخاب بهتر.
              </p>
            </div>

            <div
              className="rounded-2xl border bg-white p-6"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <div className="text-3xl">🛍️</div>
              <h3 className="mt-4 text-lg font-bold">
                مسیر خرید بهتر
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                در آینده، مقایسه و هدایت والدین به فروشگاه‌های مناسب برای خرید.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="text-4xl">🌱</div>

          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            انتخاب بهتر، مسیر رشد بهتر
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80">
            کیدهاب را برای پیدا کردن کتاب، اسباب‌بازی و محتوای مناسب کودک
            امتحان کنید.
          </p>

          <Link
            href="/toys"
            className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-bold transition hover:-translate-y-0.5"
            style={{ color: "var(--color-secondary)" }}
          >
            مشاهده پیشنهادها
          </Link>
        </div>
      </section>

    </main>
  );
}
