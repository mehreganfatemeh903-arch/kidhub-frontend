type AgeGroup = { id: number; title: string };

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

async function getArticles(ageGroupId?: string) {
  const url = ageGroupId
    ? `${process.env.NEXT_PUBLIC_API_URL}/articles/?age_groups=${ageGroupId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/articles/`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? data.value ?? [];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";

  try {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  } catch {
    return dateStr;
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;
  const articles: Article[] = await getArticles(age);

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      dir="rtl"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-7xl">

        <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-primary)",
                }}
              >
                🧠 راهنمای والدین و رشد کودک
              </span>

              <h1
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--color-primary)" }}
              >
                {age
                  ? "مقالات مناسب این سن"
                  : "مقالات معتبر والدین و کودک"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                مطالب آموزشی و کاربردی درباره رشد، یادگیری و تربیت کودک
                با استفاده از منابع معتبر و قابل بررسی.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-primary)",
              }}
            >
              {articles.length} مقاله
            </div>
          </div>
        </section>

        {articles.length === 0 && (
          <section className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">🧠</div>

            <h2 className="text-lg font-bold text-gray-800">
              مقاله‌ای برای این بازه‌ی سنی پیدا نشد
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              می‌توانید بازه‌ی سنی دیگری را امتحان کنید.
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-primary)",
                  }}
                >
                  مقاله آموزشی
                </span>

                {article.published_at && (
                  <span className="text-xs text-gray-400">
                    {formatDate(article.published_at)}
                  </span>
                )}
              </div>

              <a href={`/articles/${article.slug}`}>
                <h2
                  className="line-clamp-2 text-xl font-bold leading-9 transition"
                  style={{ color: "var(--color-primary)" }}
                >
                  {article.title}
                </h2>
              </a>

              <p className="mt-3 line-clamp-5 text-sm leading-8 text-gray-600">
                {article.summary}
              </p>

              {article.age_groups?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.age_groups.map((ageGroup) => (
                    <span
                      key={ageGroup.id}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {ageGroup.title}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-6">
                {article.source_name && (
                  <p className="mb-3 text-xs text-gray-400">
                    منبع: {article.source_name}
                  </p>
                )}

                <div className="flex gap-2">
                  <a
                    href={`/articles/${article.slug}`}
                    className="flex-1 rounded-xl border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50"
                    style={{
                      borderColor: "var(--color-card-border)",
                    }}
                  >
                    مطالعه مقاله
                  </a>

                  {article.source_url && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                      style={{
                        backgroundColor: "var(--color-secondary)",
                      }}
                    >
                      منبع اصلی
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
