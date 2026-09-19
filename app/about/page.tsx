import type { Metadata } from "next";

const SITE_URL = "http://127.0.0.1:3000";

export const metadata: Metadata = {
  title: "درباره کیدهاب | راهنمای رشد و یادگیری کودک",
  description:
    "درباره کیدهاب؛ راهنمای انتخاب کتاب، اسباب‌بازی و محتوای مناسب کودک بر اساس سن، رشد و نیازهای یادگیری.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "درباره کیدهاب | راهنمای رشد و یادگیری کودک",
    description:
      "با هدف و رویکرد کیدهاب در انتخاب آگاهانه کتاب، اسباب‌بازی و محتوای مناسب کودک آشنا شوید.",
    url: `${SITE_URL}/about`,
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary",
    title: "درباره کیدهاب",
    description:
      "آشنایی با کیدهاب و رویکرد آن در انتخاب محتوای مناسب رشد و یادگیری کودک.",
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "درباره کیدهاب",
    url: `${SITE_URL}/about`,
    description:
      "درباره کیدهاب؛ راهنمای انتخاب کتاب، اسباب‌بازی و محتوای مناسب کودک بر اساس سن، رشد و نیازهای یادگیری.",
    isPartOf: {
      "@type": "WebSite",
      name: "کیدهاب",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-indigo-600">
              درباره کیدهاب
            </p>

            <h1 className="text-3xl font-bold leading-relaxed text-slate-900 md:text-4xl">
              همراه والدین برای انتخاب آگاهانه‌تر
            </h1>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              کیدهاب با هدف ساده‌تر کردن انتخاب کتاب، اسباب‌بازی و محتوای
              مناسب کودک ایجاد شده است؛ تا والدین بتوانند گزینه‌های مناسب را
              بر اساس سن، نیازهای رشدی و زمینه‌های یادگیری کودک بهتر بررسی و
              مقایسه کنند.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              انتخاب بر اساس سن
            </h2>
            <p className="mt-3 leading-8 text-slate-600">
              محتوا و محصولات کیدهاب بر اساس گروه‌های سنی دسته‌بندی می‌شوند تا
              پیدا کردن گزینه‌های مناسب برای هر مرحله از رشد آسان‌تر باشد.
            </p>
          </article>

          <article className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              توجه به رشد کودک
            </h2>
            <p className="mt-3 leading-8 text-slate-600">
              در دسته‌بندی‌ها به زمینه‌هایی مانند رشد زبانی، مهارت‌های حرکتی،
              خلاقیت و یادگیری توجه می‌شود تا انتخاب فقط بر اساس ظاهر یا
              محبوبیت یک محصول نباشد.
            </p>
          </article>

          <article className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              اطلاعات شفاف
            </h2>
            <p className="mt-3 leading-8 text-slate-600">
              کیدهاب تلاش می‌کند اطلاعات هر مورد، از جمله توضیحات، منبع و
              لینک خرید را تا حد امکان شفاف ارائه کند تا والدین بتوانند پیش
              از تصمیم‌گیری اطلاعات بیشتری در اختیار داشته باشند.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-3xl border bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-2xl font-bold text-slate-900">
            کیدهاب چه کاری انجام می‌دهد؟
          </h2>

          <div className="mt-6 space-y-5 text-base leading-9 text-slate-600">
            <p>
              کیدهاب یک راهنمای محتوایی و انتخاب است که کتاب‌ها، اسباب‌بازی‌ها
              و مطالب مرتبط با رشد کودک را در یک فضای منظم در اختیار والدین
              قرار می‌دهد.
            </p>

            <p>
              کیدهاب مستقیماً محصولات را نمی‌فروشد. لینک‌های خرید موجود در
              صفحات محصولات، در صورت وجود، کاربر را برای خرید مستقیم به
              فروشگاه یا ناشر مربوط هدایت می‌کنند.
            </p>

            <p>
              هدف کیدهاب جایگزین کردن نظر متخصصان کودک نیست؛ بلکه ارائه
              اطلاعات ساختاریافته و قابل استفاده برای کمک به فرایند بررسی و
              انتخاب والدین است.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
