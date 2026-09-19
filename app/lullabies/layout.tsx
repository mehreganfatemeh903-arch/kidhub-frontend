import type { Metadata } from "next";

const SITE_URL = "http://127.0.0.1:3000";

const lullabies = [
  "لالایی آرام شبانه",
  "لالایی ابرهای نرم",
  "لالایی خواب ناز",
  "لالایی خواب کوچولو",
  "لالایی رویای شیرین",
  "لالایی ستاره کوچولو",
  "لالایی شب بخیر",
  "لالایی مادرانه",
  "لالایی ماه و ستاره",
  "لالایی گهواره‌ای سنتی",
];

export const metadata: Metadata = {
  title: "لالایی کودک | لالایی‌های آرام برای خواب کودک | کیدهاب",
  description:
    "مجموعه لالایی‌های کودکانه برای روتین خواب؛ متن لالایی را بخوانید و صدای خودتان را برای کودک ضبط و ذخیره کنید.",
  alternates: {
    canonical: `${SITE_URL}/lullabies`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/lullabies`,
    title: "لالایی کودک | لالایی‌های آرام برای خواب کودک | کیدهاب",
    description:
      "لالایی‌های کودکانه برای زمان خواب و آرامش کودک، همراه با امکان خواندن متن و ضبط صدای والد.",
    siteName: "کیدهاب",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary",
    title: "لالایی کودک | کیدهاب",
    description:
      "لالایی‌های کودکانه برای زمان خواب و امکان ضبط صدای والد برای کودک.",
  },
};

export default function LullabiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "لالایی‌های آرام برای شب‌های کودک",
    description:
      "مجموعه لالایی‌های کودکانه برای زمان خواب و آرامش کودک.",
    url: `${SITE_URL}/lullabies`,
    inLanguage: "fa-IR",
    isPartOf: {
      "@type": "WebSite",
      name: "کیدهاب",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: lullabies.length,
      itemListElement: lullabies.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      {children}
    </>
  );
}
