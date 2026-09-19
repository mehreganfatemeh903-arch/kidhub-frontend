import type { Metadata } from "next";

const SITE_URL = "http://127.0.0.1:3000";

export const metadata: Metadata = {
  title: "تماس با ما | ارتباط با کیدهاب",
  description:
    "با کیدهاب در ارتباط باشید؛ پرسش‌ها، پیشنهادها و بازخوردهای خود درباره کتاب، اسباب‌بازی و محتوای سایت را برای ما ارسال کنید.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "تماس با ما | ارتباط با کیدهاب",
    description:
      "ارسال پرسش، پیشنهاد و بازخورد درباره کتاب‌ها، اسباب‌بازی‌ها و محتوای کیدهاب.",
    url: `${SITE_URL}/contact`,
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary",
    title: "تماس با کیدهاب",
    description:
      "با کیدهاب در ارتباط باشید و پرسش‌ها و پیشنهادهای خود را ارسال کنید.",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
