type AgeGroup = { id: number; title: string };
type Article = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  summary: string;
  body: string;
  published_at: string;
};

async function getArticles(ageGroupId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/?age_groups=${ageGroupId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.value;
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
  const articles: Article[] = age ? await getArticles(age) : [];

  return (
    <main className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">مقالات مناسب این سن</h1>
      {articles.length === 0 && (
        <p className="text-gray-500">موردی برای این بازه‌ی سنی پیدا نشد.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={`/articles/${article.slug}`}
            className="border rounded-lg p-4 flex flex-col gap-2"
            style={{ borderColor: "var(--color-card-border)" }}
          >
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600">{article.summary}</p>
            {article.published_at && (
              <span className="text-xs text-gray-400">
                {formatDate(article.published_at)}
              </span>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
