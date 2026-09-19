import { getMediaUrl } from "@/lib/api";

type AgeGroup = {
  id: number;
  title: string;
};

type Book = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  book_type: string;
  description: string;
  cover_image: string | null;
  author: string;
  translator: string;
  publisher: string;
  source_name: string;
  source_url: string;
  purchase_url: string;
  price: number | null;
  topic: string;
  developmental_benefit: string;
  evidence_source_name: string;
  evidence_source_url: string;
  awards: string;
  is_parent_guide: boolean;
};

const typeLabel: Record<string, string> = {
  video: "ویدیویی",
  text: "متنی",
  audio: "صوتی",
};

function formatPrice(price: number | null) {
  if (!price) return null;
  return `${price.toLocaleString("fa-IR")} تومان`;
}

async function getBook(slug: string): Promise<Book | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/?slug=${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const list = Array.isArray(data)
    ? data
    : data.results ?? data.value ?? [];

  return list?.find((b: Book) => b.slug === slug) || null;
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    return (
      <main className="p-6 max-w-3xl mx-auto" dir="rtl">
        <p className="text-gray-500">این کتاب پیدا نشد.</p>
      </main>
    );
  }

  const imageUrl = getMediaUrl(book.cover_image);
  const price = formatPrice(book.price);

  return (
    <main className="p-6 max-w-3xl mx-auto" dir="rtl">
      <div
        className="border rounded-2xl p-5 shadow-sm"
        style={{ borderColor: "var(--color-card-border)" }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full max-h-[420px] object-cover rounded-xl mb-5"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            {typeLabel[book.book_type] || book.book_type}
          </span>

          {book.is_parent_guide && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              راهنمای والدین
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {book.title}
        </h1>

        {book.author && (
          <p className="text-gray-700 mb-2">
            <strong>نویسنده:</strong> {book.author}
          </p>
        )}

        {book.translator && (
          <p className="text-gray-700 mb-2">
            <strong>مترجم:</strong> {book.translator}
          </p>
        )}

        {book.publisher && (
          <p className="text-gray-700 mb-4">
            <strong>ناشر:</strong> {book.publisher}
          </p>
        )}

        {book.age_groups?.length > 0 && (
          <div className="mb-4">
            <strong>گروه سنی:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {book.age_groups.map((age) => (
                <span
                  key={age.id}
                  className="text-sm px-3 py-1 rounded-full border"
                >
                  {age.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {book.topic && (
          <div className="mb-4">
            <h2 className="font-semibold mb-1">موضوع</h2>
            <p className="text-gray-700 leading-7">{book.topic}</p>
          </div>
        )}

        <div className="mb-5">
          <h2 className="font-semibold mb-1">معرفی کتاب</h2>
          <p className="text-gray-700 leading-8">
            {book.description}
          </p>
        </div>

        {book.developmental_benefit && (
          <div className="mb-5">
            <h2 className="font-semibold mb-1">فایده رشدی برای کودک</h2>
            <p className="text-gray-700 leading-8">
              {book.developmental_benefit}
            </p>
          </div>
        )}

        {book.awards && (
          <div className="mb-5">
            <h2 className="font-semibold mb-1">جوایز و افتخارات</h2>
            <p className="text-gray-700 leading-8">
              {book.awards}
            </p>
          </div>
        )}

        {price && (
          <div className="mb-5">
            <h2 className="font-semibold mb-1">قیمت</h2>
            <p className="text-lg font-bold">{price}</p>
          </div>
        )}

        <div className="border-t pt-5 mt-5">
          {book.source_name && (
            <p className="text-sm text-gray-500 mb-3">
              <strong>منبع:</strong> {book.source_name}
            </p>
          )}

          {book.evidence_source_name && (
            <p className="text-sm text-gray-500 mb-3">
              <strong>منبع علمی:</strong>{" "}
              {book.evidence_source_name}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {book.purchase_url && (
              <a
                href={book.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium border"
              >
                خرید کتاب
              </a>
            )}

            {book.source_url && (
              <a
                href={book.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium border"
              >
                منبع اصلی
              </a>
            )}

            {book.evidence_source_url && (
              <a
                href={book.evidence_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium border"
              >
                مشاهده منبع علمی
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
