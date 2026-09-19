import { getMediaUrl } from "../../lib/api";

type AgeGroup = {
  id: number;
  title: string;
  min_age_months: number;
  max_age_months: number;
};

type Book = {
  id: number;
  title: string;
  slug: string;
  author: string;
  translator: string;
  description: string;
  cover_image: string | null;
  price: number | null;
  purchase_url: string;
  source_name: string;
  source_url: string;
  age_groups?: AgeGroup[];
};

async function getBooks(ageGroupId?: string) {
  const url = ageGroupId
    ? `${process.env.NEXT_PUBLIC_API_URL}/books/?age_groups=${ageGroupId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/books/`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? data.value ?? [];
}

function formatPrice(price: number | null) {
  if (!price) return "";
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;
  const books: Book[] = await getBooks(age);

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
                📚 انتخاب هوشمندانه کتاب کودک
              </span>

              <h1
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--color-primary)" }}
              >
                {age
                  ? "کتاب‌های مناسب این سن"
                  : "کتاب کودک و کتاب‌های مناسب رشد و یادگیری"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                مجموعه‌ای از کتاب‌های کودک با توضیحات واقعی، نویسنده،
                قیمت و لینک خرید برای انتخاب آگاهانه‌تر والدین.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-primary)",
              }}
            >
              {books.length} کتاب
            </div>
          </div>
        </section>

        {books.length === 0 && (
          <section className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">📚</div>

            <h2 className="text-lg font-bold text-gray-800">
              کتابی برای این بازه‌ی سنی پیدا نشد
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              می‌توانید بازه‌ی سنی دیگری را امتحان کنید.
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <article
              key={book.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <a
                href={`/books/${book.slug}`}
                className="block overflow-hidden bg-gray-50"
              >
                {book.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getMediaUrl(book.cover_image) || ""}
                    alt={`جلد کتاب ${book.title}`}
                    className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center text-5xl">
                    📚
                  </div>
                )}
              </a>

              <div className="flex flex-1 flex-col p-5">
                <a href={`/books/${book.slug}`}>
                  <h2
                    className="line-clamp-2 text-lg font-bold leading-8 transition"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {book.title}
                  </h2>
                </a>

                {book.author && (
                  <p className="mt-2 text-sm text-gray-500">
                    نویسنده: {book.author}
                  </p>
                )}

                {book.translator && (
                  <p className="mt-1 text-xs text-gray-400">
                    مترجم: {book.translator}
                  </p>
                )}

                <p className="mt-3 line-clamp-4 text-sm leading-7 text-gray-600">
                  {book.description}
                </p>

                <div className="mt-auto pt-5">
                  {book.price && (
                    <div
                      className="mb-3 text-base font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {formatPrice(book.price)}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <a
                      href={`/books/${book.slug}`}
                      className="flex-1 rounded-xl border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50"
                      style={{
                        borderColor: "var(--color-card-border)",
                      }}
                    >
                      مشاهده جزئیات
                    </a>

                    {book.purchase_url && (
                      <a
                        href={book.purchase_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                        style={{
                          backgroundColor: "var(--color-secondary)",
                        }}
                      >
                        خرید کتاب
                      </a>
                    )}
                  </div>

                  {book.source_name && (
                    <p className="mt-2 text-center text-xs text-gray-400">
                      منبع: {book.source_name}
                    </p>
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
