"use client";

import { FormEvent, useState } from "react";

const SITE_URL = "http://127.0.0.1:3000";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("ارسال پیام با خطا مواجه شد.");
      }

      setSent(true);
      form.reset();
    } catch {
      setError("ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تماس با کیدهاب",
    url: `${SITE_URL}/contact`,
    description:
      "صفحه تماس با کیدهاب برای ارسال پرسش، پیشنهاد، بازخورد و پیام‌های مرتبط با سایت.",
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
          __html: JSON.stringify(contactSchema),
        }}
      />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="mb-3 text-sm font-semibold text-indigo-600">
            ارتباط با کیدهاب
          </p>

          <h1 className="text-3xl font-bold leading-relaxed text-slate-900 md:text-4xl">
            تماس با ما
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
            پرسش، پیشنهاد یا بازخوردی درباره کتاب‌ها، اسباب‌بازی‌ها،
            مقالات یا سایر بخش‌های کیدهاب دارید؟ پیام خود را برای ما ارسال
            کنید.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <aside className="rounded-3xl border bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              چگونه می‌توانیم کمک کنیم؟
            </h2>

            <div className="mt-7 space-y-7">
              <div>
                <h3 className="font-semibold text-slate-900">
                  پرسش و پشتیبانی
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  اگر درباره محتوای سایت، کتاب‌ها، اسباب‌بازی‌ها یا نحوه
                  استفاده از کیدهاب پرسشی دارید، از فرم تماس استفاده کنید.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  پیشنهاد و بازخورد
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  پیشنهادهای شما به بهتر شدن تجربه والدین و کیفیت محتوای
                  کیدهاب کمک می‌کند.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  معرفی محتوا
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  اگر درباره یک کتاب، اسباب‌بازی یا محتوای مرتبط پیشنهادی
                  دارید، می‌توانید اطلاعات آن را برای بررسی ارسال کنید.
                </p>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border bg-white p-7 shadow-sm md:col-span-2 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              ارسال پیام
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              فرم زیر را تکمیل کنید تا پیام شما برای بررسی ثبت شود.
            </p>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
                  ✓
                </div>

                <h3 className="text-lg font-bold text-emerald-900">
                  پیام شما با موفقیت ثبت شد
                </h3>

                <p className="mt-2 text-sm leading-7 text-emerald-800">
                  پیام شما دریافت و برای بررسی ثبت شده است. از اینکه با
                  کیدهاب در ارتباط هستید سپاسگزاریم.
                </p>

                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      نام و نام خانوادگی
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="نام شما"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      ایمیل
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      dir="ltr"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    موضوع پیام
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="موضوع پیام را وارد کنید"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    پیام شما
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-6 text-slate-500">
                    اطلاعات واردشده برای ثبت و پیگیری پیام شما استفاده می‌شود.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {loading ? "در حال ارسال..." : "ارسال پیام"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
