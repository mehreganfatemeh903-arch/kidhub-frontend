import type { Metadata } from "next";

type AgeGroup = {
  id: number;
  title: string;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  summary: string;
  body: string;
  source_name: string;
  source_url: string;
  published_at: string;
};

const SITE_URL = "http://127.0.0.1:3000";

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const list = Array.isArray(data)
    ? data
    : data.results ?? data.value ?? [];

  return list?.find((a: Article) => a.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "مقاله پیدا نشد | کیدهاب",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const description =
    article.summary?.trim() ||
    "مقاله‌ای کاربردی درباره رشد، یادگیری و تربیت کودک در کیدهاب.";

  const canonical = `${SITE_URL}/articles/${article.slug}`;

  return {
    title: `${article.title} | کیدهاب`,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${article.title} | کیدهاب`,
      description,
      url: canonical,
      type: "article",
      locale: "fa_IR",
      siteName: "کیدهاب",
      publishedTime: article.published_at || undefined,
    },
    twitter: {
      card: "summary",
      title: `${article.title} | کیدهاب`,
      description,
    },
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";

  try {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  } catch {
    return dateStr;
  }
}

function renderBody(body: string) {
  return body.split("\n").map((line, index) => {
    const key = `${index}-${line}`;

    if (line.startsWith("### ")) {
      return (
        <h3
          key={key}
          className="mt-8 mb-3 text-lg font-bold text-[var(--color-text)]"
        >
          {line.replace(/^### /, "")}
        </h3>
      );
    }

    if (line.startsWith("## ")) {
      return (
        <h2
          key={key}
          className="mt-10 mb-4 text-xl font-bold text-[var(--color-text)]"
        >
          {line.replace(/^## /, "")}
        </h2>
      );
    }

    if (line.trim() === "") {
      return <div key={key} className="h-3" />;
    }

    const parts = line.split(/(\*\*.*?\*\*)/g);

    return (
      <p
        key={key}
        className="mb-4 text-[1rem] leading-8 text-[var(--color-text)]"
      >
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center" dir="rtl">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <h1 className="mb-3 text-2xl font-bold">مقاله پیدا نشد</h1>
          <p className="text-gray-500">
            این مقاله در حال حاضر در دسترس نیست.
          </p>
        </div>
      </main>
    );
  }

  const canonical = `${SITE_URL}/articles/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description:
      article.summary ||
      "مقاله‌ای درباره رشد و یادگیری کودک در کیدهاب.",
    url: canonical,
    datePublished: article.published_at || undefined,
    publisher: {
      "@type": "Organization",
      name: "کیدهاب",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "مقالات",
        item: `${SITE_URL}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonical,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر صفحه"
          className="mb-6 text-sm text-gray-500"
        >
          <a href="/" className="hover:text-gray-900">
            خانه
          </a>
          <span className="mx-2">←</span>
          <a href="/articles" className="hover:text-gray-900">
            مقالات
          </a>
          <span className="mx-2">←</span>
          <span className="text-gray-700">{article.title}</span>
        </nav>

        <article className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <header className="border-b px-5 py-8 sm:px-8 sm:py-10">
            <div className="mb-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              🧠 راهنمای والدین و رشد کودک
            </div>

            <h1 className="text-2xl font-extrabold leading-10 text-gray-900 sm:text-3xl sm:leading-[1.8]">
              {article.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {article.published_at && (
                <span>تاریخ انتشار: {formatDate(article.published_at)}</span>
              )}

              {article.age_groups?.length > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex flex-wrap gap-2">
                    {article.age_groups.map((age) => (
                      <span
                        key={age.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {age.title}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {article.summary && (
              <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-base font-medium leading-8 text-gray-700">
                {article.summary}
              </p>
            )}
          </header>

          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <article className="max-w-none">
              {renderBody(article.body)}
            </article>
          </div>

          {article.source_url && (
            <section className="mx-5 mb-5 rounded-2xl border bg-gray-50 p-5 sm:mx-8">
              <h2 className="mb-2 text-lg font-bold text-gray-900">
                منبع و مطالعه بیشتر
              </h2>

              {article.source_name && (
                <p className="mb-4 text-sm leading-7 text-gray-600">
                  منبع: {article.source_name}
                </p>
              )}

              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                مشاهده منبع اصلی ↗
              </a>
            </section>
          )}

          <footer className="border-t px-5 py-5 text-center text-sm text-gray-500 sm:px-8">
            محتوای این صفحه برای آگاهی و راهنمایی والدین تهیه شده است.
          </footer>
        </article>
      </div>
    </main>
  );
}
