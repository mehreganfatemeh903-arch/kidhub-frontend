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

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/?slug=${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.value;
  return list?.find((a: Article) => a.slug === slug) || null;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  } catch {
    return dateStr;
  }
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
      <main className="p-6" dir="rtl">
        <p className="text-gray-500">این مقاله پیدا نشد.</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
      {article.published_at && (
        <p className="text-sm text-gray-400 mb-4">
          {formatDate(article.published_at)}
        </p>
      )}
      {article.summary && (
        <p className="text-gray-700 font-medium mb-4">{article.summary}</p>
      )}
      <div
        className="prose max-w-none leading-8 whitespace-pre-line"
        style={{ color: "var(--color-text)" }}
      >
        {article.body}
      </div>
    </main>
  );
}
