type AgeGroup = {
  id: number;
  title: string;
};

type DevelopmentArea = {
  id: number;
  name: string;
};

type AffiliateSource = {
  id: number;
  name: string;
};

type Toy = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  development_areas: DevelopmentArea[];
  short_description: string;
  why_it_helps: string;
  image: string | null;
  affiliate_source: AffiliateSource | null;
  affiliate_url: string;
  price_range: string;
};

async function getToy(slug: string): Promise<Toy | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toys/?slug=${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.value;
  return list?.find((t: Toy) => t.slug === slug) || null;
}

export default async function ToyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toy = await getToy(slug);

  if (!toy) {
    return (
      <main className="p-6" dir="rtl">
        <p className="text-gray-500">این اسباب‌بازی پیدا نشد.</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto" dir="rtl">
      <a href="/" className="text-sm text-gray-500 mb-4 inline-block">
        &larr; بازگشت به خانه
      </a>

      {toy.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={toy.image}
          alt={toy.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{toy.title}</h1>
      <p className="text-gray-700 mb-4">{toy.short_description}</p>

      {toy.why_it_helps && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">چرا مفید است؟</h2>
          <p className="text-gray-600">{toy.why_it_helps}</p>
        </div>
      )}

      {toy.development_areas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {toy.development_areas.map((area) => (
            <span
              key={area.id}
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              {area.name}
            </span>
          ))}
        </div>
      )}

      {toy.price_range && (
        <p
          className="text-lg font-medium mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          {toy.price_range}
        </p>
      )}

      {toy.affiliate_url && (
        <a
          href={toy.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-white rounded-md py-3"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          خرید از {toy.affiliate_source?.name || "فروشگاه"}
        </a>
      )}
    </main>
  );
}
