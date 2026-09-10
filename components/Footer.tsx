import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-card-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">

          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🧸</span>
              <span
                className="text-xl font-extrabold"
                style={{ color: "var(--color-primary)" }}
              >
                کیدهاب
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              راهنمای هوشمند والدین برای انتخاب کتاب و اسباب‌بازی مناسب
              با توجه به سن، علاقه و نیازهای رشدی کودک.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              شروع انتخاب هوشمند
            </Link>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-ink)]">
              دسترسی سریع
            </h3>
            <nav className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <Link href="/" className="transition hover:text-[var(--color-primary)]">
                خانه
              </Link>
              <Link href="/toys" className="transition hover:text-[var(--color-primary)]">
                اسباب‌بازی‌ها
              </Link>
              <Link href="/books" className="transition hover:text-[var(--color-primary)]">
                کتاب‌ها
              </Link>
              <Link href="/articles" className="transition hover:text-[var(--color-primary)]">
                مجله والدین
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-ink)]">
              درباره کیدهاب
            </h3>
            <nav className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <Link href="/about" className="transition hover:text-[var(--color-primary)]">
                درباره ما
              </Link>
              <Link href="/contact" className="transition hover:text-[var(--color-primary)]">
                تماس با ما
              </Link>
              <Link href="/register" className="transition hover:text-[var(--color-primary)]">
                ساخت حساب کاربری
              </Link>
              <Link href="/login" className="transition hover:text-[var(--color-primary)]">
                ورود
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-ink)]">
              چرا کیدهاب؟
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-6 text-gray-500">
              <li>✓ انتخاب متناسب با سن کودک</li>
              <li>✓ توجه به نیازهای رشدی</li>
              <li>✓ پیشنهاد کتاب و اسباب‌بازی</li>
              <li>✓ محتوای آموزشی برای والدین</li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-[var(--color-card-border)] pt-6">
          <div className="flex flex-col gap-3 text-center text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-right">
            <p>
              © {new Date().getFullYear()} کیدهاب — تمامی حقوق محفوظ است.
            </p>

            <p>
              انتخاب آگاهانه، رشد بهتر، کودکی شادتر
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
