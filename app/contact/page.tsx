"use client";

import { FormEvent, useState } from "react";

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

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold">تماس با ما</h1>
          <p className="mx-auto max-w-2xl leading-8 text-gray-600">
            اگر پرسشی، پیشنهادی یا بازخوردی درباره کیده‌اب دارید، خوشحال می‌شویم
            با ما در میان بگذارید.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <section className="rounded-2xl border p-6 md:col-span-1">
            <h2 className="mb-5 text-xl font-semibold">راه‌های ارتباط</h2>

            <div className="space-y-5 text-sm leading-7 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900">پشتیبانی</h3>
                <p>
                  برای پرسش‌های مربوط به اسباب‌بازی‌ها، کتاب‌ها و محتوای سایت
                  می‌توانید از فرم تماس استفاده کنید.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  پیشنهاد و بازخورد
                </h3>
                <p>
                  پیشنهادهای شما به ما کمک می‌کند تجربه بهتری برای والدین و
                  کودکان ایجاد کنیم.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">پاسخ‌گویی</h3>
                <p>
                  پیام شما بررسی می‌شود و اطلاعات آن در سیستم پشتیبانی ثبت
                  خواهد شد.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border p-6 md:col-span-2">
            <h2 className="mb-6 text-xl font-semibold">فرم تماس</h2>

            {sent ? (
              <div className="rounded-xl border p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  پیام شما با موفقیت ثبت شد
                </h3>
                <p className="text-sm leading-7 text-gray-600">
                  پیام شما دریافت شد و برای بررسی در سیستم ثبت شده است.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      نام و نام خانوادگی
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                      placeholder="نام شما"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      ایمیل
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium"
                  >
                    موضوع
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                    placeholder="موضوع پیام"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium"
                  >
                    پیام
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full resize-y rounded-lg border px-4 py-3 outline-none focus:ring-2"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                {error && (
                  <div className="rounded-lg border p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs leading-6 text-gray-500">
                    اطلاعات شما فقط برای پیگیری پیام استفاده خواهد شد.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 rounded-lg px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {loading ? "در حال ارسال..." : "ارسال پیام"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
